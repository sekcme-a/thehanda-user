import { useState, useEffect } from "react";
import useData from "context/data";
import { useRouter } from "next/router";
import styles from "src/schedule/schedule.module.css";
import Calendar from "src/public/components/Calendar";
import { firestore as db } from "firebase/firebase";
import { CircularProgress } from "@mui/material";

const Schedule = () => {
  const [isLoading, setIsLoading] = useState(true)
  const {user, mySchedule, setMySchedule, teamSchedule, setTeamSchedule} = useData()
  const router = useRouter()
  const [mode, setMode] = useState("my")
  const [events, setEvents] = useState({colorValue:{}, data:[]})
  const [teamName, setTeamName] = useState("")

  useEffect(()=>{
    const teamId = localStorage.getItem("selectedTeamId")
    let colorValues={}
    const fetchMyScheduleData = async () => {
      if(!mySchedule){
        setTeamName(localStorage.getItem("selectedTeamName"))
        if(!teamId)
          router.push("/walkthrough")
        const fetchedData = []

        //선택된 센터의 colorValues가져오기
        const teamDoc = await db.collection("team").doc(teamId).get()
        if(teamDoc.exists && teamDoc.data().programScheduleColorValues)
        colorValues = teamDoc.data().programScheduleColorValues
        //history 를 통해서 선택된 센터에 한에 모든 스케쥴 가져오기
        const historyDoc = await db.collection("user").doc(user.uid).collection("history").doc("programs").get()
        if(historyDoc.exists && historyDoc.data().data){
          const programList = historyDoc.data().data.filter(item=>item.team === teamId)
          await Promise.all(
            programList.map(async(program)=>{
              const programDoc = await db.collection("team").doc(teamId).collection("programs").doc(program.id).get()
              if(programDoc.exists && programDoc.data().calendar){
                fetchedData.push(...programDoc.data().calendar)
              }
            })
          )
          if(fetchedData){
            console.log(fetchedData)
            setMySchedule({colorValues: colorValues, data: fetchedData})
          }
        }
      }

      fetchTeamScheduleData()
    }

    const fetchTeamScheduleData = async () => {
      if(!teamSchedule){
        //프로그램 최초 시작일이 1년이내라면
        let date = new Date()
        date = date.setFullYear(date.getFullYear()-1)
        const querySnapshot = await db.collection("team").doc(teamId).collection("programs").where("programStartDate", ">", new Date(date)).where("condition", "==","confirm").get()
        const fetchedData = []
        querySnapshot.docs.map((doc) => {
          if(doc.exists && doc.data().calendar){
            fetchedData.push(...doc.data().calendar)
          }
        })
        if(fetchedData){
          console.log(fetchedData)
          setTeamSchedule({colorValues: colorValues, data: fetchedData})
        }
      }
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchMyScheduleData()
  },[mode])
  
  if(isLoading)
    return(
      <>
      
        <div className={styles.header_container}>
          <h1 onClick={()=>setMode("my")} className={mode==="my" && styles.selected}>내 일정</h1>
          <h1 onClick={()=>setMode("center")}className={mode==="center" && styles.selected}>센터 일정</h1>
        </div>
        <div className={styles.loader_container}>
          <CircularProgress />
        </div>
      </>
    )

  return(
    <>
      <div className={styles.header_container}>
        <h1 onClick={()=>setMode("my")} className={mode==="my" && styles.selected}>내 일정</h1>
        <h1 onClick={()=>setMode("center")}className={mode==="center" && styles.selected}>센터 일정</h1>
      </div>
      <div className={styles.content_container}>
        {mode==="my" && 
          <>
            <p className={styles.info}>신청한 프로그램의 일정을 확인하고 해당 프로그램에 잊지말고 참여하세요!</p>
            <Calendar events={mySchedule} setEvents={setMySchedule} editable={false} />
          </>
        }
        {mode==="center" && 
          <>
            <p className={styles.info}>{`${teamName}의 모든 프로그램 일정입니다.\n1년내의 프로그램만 열람하실 수 있습니다.`}</p>
            <Calendar events={teamSchedule} setEvents={setTeamSchedule} editable={false} />
          </>
        }
        {/* <Calendar events={events} setEvents={setEvents} editable={false} /> */}
      </div>
    </>
  )
}

export default Schedule