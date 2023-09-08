import { useState, useEffect } from "react";
import useData from "context/data";
import useUserData from "context/userData";
import { useRouter } from "next/router";
import styles from "src/schedule/schedule.module.css";
import ScheduleList from "src/schedule/ScheduleList";
import { firestore as db } from "firebase/firebase";
import { CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const Schedule = () => {
  const [isLoading, setIsLoading] = useState(true)
  const {user, userData} = useUserData()
  // const {user, mySchedule, setMySchedule, teamSchedule, setTeamSchedule} = useData()
  const {mySchedule, setMySchedule, teamSchedule, setTeamSchedule} = useData()
  const router = useRouter()
  const [mode, setMode] = useState("my")
  const [events, setEvents] = useState({colorValue:{}, data:[]})
  const [teamName, setTeamName] = useState("")

  const [type, setType] = useState("다가오는 스케쥴")
  const [colorValues, setColorValues] = useState({})
  const [futureSchedule, setFutureSchedule] = useState([])
  const [pastSchedule, setPastSchedule] = useState([])

  useEffect(()=>{
    const teamId = userData.selectedTeamId
    let colorValues={}
    const fetchMyScheduleData = async () => {
      if(!mySchedule){
        setTeamName(userData.selectedTeamName)
        if(!teamId)
          router.push("/start/walkthrough")
        const fetchedData = []

        //선택된 센터의 colorValues가져오기
        const teamDoc = await db.collection("team").doc(teamId).get()
        if(teamDoc.exists && teamDoc.data().programScheduleColorValues)
        // colorValues = teamDoc.data().programScheduleColorValues
        setColorValues(teamDoc.data().programScheduleColorValues)
        //history 를 통해서 선택된 센터에 한에 모든 스케쥴 가져오기
        const historyDoc = await db.collection("user").doc(user.uid).collection("history").doc("programs").get()
        if(historyDoc.exists && historyDoc.data().data){
          const programList = historyDoc.data().data.filter(item=>item.team === teamId)
          await Promise.all(
            programList.map(async(program)=>{
              const programDoc = await db.collection("team").doc(teamId).collection("programs").doc(program.id).get()
              if(programDoc.exists && programDoc.data().condition==="confirm" &&  programDoc.data().calendar){
                const newArrayWithProgramDatas = programDoc.data().calendar.map((obj) => ({...obj, programTitle: programDoc.data().title, id: programDoc.id}))
                fetchedData.push(...newArrayWithProgramDatas)
              }
            })
          )
          if(fetchedData){
            // 현재 시간 (UNIX timestamp로 표현)
            const currentTimestamp = Math.floor(Date.now() / 1000);

            // start 시간이 현재 시간보다 미래인 객체들만 필터링
            const futureEvents = fetchedData.filter((event) => {
              const startTimestamp = event.start.seconds;
              return startTimestamp > currentTimestamp;
            });
            const pastEvents = fetchedData.filter((event) => {
              const startTimestamp = event.start.seconds;
              return startTimestamp <= currentTimestamp;
            });
            setFutureSchedule([...futureEvents])
            console.log(futureEvents)
            setPastSchedule([...pastEvents])
            console.log(pastEvents)
          }
        }
      }
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchMyScheduleData()
  },[mode])

  useEffect(()=>{
    if(mySchedule){
      if(type==="다가오는 스케쥴"){
        console.log(mySchedule)
      }
    }

  },[mySchedule, type])
  

  return(
    <div className={styles.main_container}>
      <h1 className={styles.main_title}>스케쥴<CalendarMonthOutlinedIcon sx={{ml:"10px"}} /></h1>
      <p className={styles.info}>신청한 프로그램의 일정을 확인하고 해당 프로그램에 잊지말고 참여하세요!</p>

      <FormControl>
        <Select
          value={type}
          size="small"
          onChange={(e) => setType(e.target.value)}
          variant="standard"
        >
          <MenuItem value={"다가오는 스케쥴"}>다가오는 스케쥴</MenuItem>
          <MenuItem value={"지난 스케쥴"}>지난 스케쥴</MenuItem>
        </Select>
      </FormControl>
      
      {isLoading ? <CircularProgress sx={{mt:"20px"}}/> : <ScheduleList schedule={type==="다가오는 스케쥴" ? futureSchedule : pastSchedule} colorValues={colorValues} /> }
    </div>
  )
}

export default Schedule