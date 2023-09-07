import { useState, useEffect } from "react"
import { firestore as db } from "firebase/firebase"
import PageHeader from "src/public/components/PageHeader"
import styles from "src/message/setting.module.css"
import Image from "next/image"
import { Switch } from "@mui/material"
import useData from "context/data"
import useUserData from "context/userData"
import { CircularProgress } from "@mui/material"
import { Button } from "@mui/material"
import { useRouter } from "next/router"
import BackdropLoader from "src/message/BackdropLoader"

const Setting = () => {
  const [sections, setSections] = useState([])
  const [teams, setTeams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAlarmOn, setIsAlarmOn] = useState(true)
  const [checked, setChecked] = useState({})

  const [submitted, setSubmitted] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const {user} = useUserData()
  const router = useRouter()
  useEffect(()=>{
    // const fetchData = async () => {
    //   const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc("program").get()
    //   if(doc.exists){
    //     setSections([...doc.data().data])
    //   }else{
    //     alert("데이터 불러오기 실패")
    //   }
    //   const userDoc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("users").doc(user.uid).get()
    //   if(userDoc.exists){
    //     if(userDoc.data().alarmSetting)
    //       setChecked({...userDoc.data().alarmSetting})
    //     if(userDoc.data().isAlarmOn)
    //       setIsAlarmOn(userDoc.data().isAlarmOn)
    //     console.log(userDoc.data().alarmSetting)
    //   }
    //   setIsLoading(false)
    // }
    // fetchData()
    const fetchData = async () => {
      try {
        const querySnapshot = await db.collection("team").get();
        const teamIds = querySnapshot.docs.map(doc => ({id: doc.id, name: doc.data().teamName}));
        setTeams(teamIds);

        const userDoc = await db.collection("user").doc(user.uid).get()
        if(userDoc.exists){
          if(userDoc.data().alarmSetting)
            setChecked({...userDoc.data().alarmSetting})
          else{
            //알람세팅이 안된 초기상태에서는 모든 알람 활성화
            let tempChecked = {}
            teamIds.map((team)=>{
              tempChecked = {...tempChecked, [team.id]: true}
            })
            setChecked(tempChecked)
          }

          if(userDoc.data().isAlarmOn)
            setIsAlarmOn(userDoc.data().isAlarmOn)
        }
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        // alert("오류가 발생했습니다.")
        // router.push("/")
      }
    };
    
    if(user)
      fetchData()
  },[user])

  const onIsAlarmChange = (e) => {
    setIsAlarmOn(e.target.checked)
    if(e.target.checked){
      let temp = checked
      for (let prop in temp)
        temp[prop] = true
      setChecked({...temp})
    } else {
      let temp = checked
      for (let prop in temp)
        temp[prop] = false
      setChecked({...temp})
    }
  }
  useEffect(()=>{
    console.log(checked)
  },[checked])

  const onCheckedChange = (id, e) => {
    setChecked({...checked, [id]: e.target.checked})
  }

  const onSubmitClick = async() => {
    setSubmitted(false)
    setOpenBackdrop(true)
    db.collection("user").doc(user.uid).update({
      isAlarmOn: isAlarmOn,
      alarmSetting: checked
    }).then(()=>setSubmitted(true))
    // const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("users").doc(user.uid).get()
    // if(doc.exists){
    //   db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("users").doc(user.uid).update({
    //     isAlarmOn: isAlarmOn,
    //     alarmSetting: checked
    //   }).then(()=>setSubmitted(true))
    // } else{
    //   db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("users").doc(user.uid).set({
    //     isAlarmOn: isAlarmOn,
    //     alarmSetting: checked
    //   }).then(()=>setSubmitted(true))
    // }
  }

  return(
    <div className={styles.main_container}>
      <PageHeader text="메세지 설정" />

      <div className={styles.profile_container}>
        <div className={styles.logo_container}>
          <Image priority src="/logo_simple.png" width={50} height={50} alt="다한다 로고" />
        </div>
        <div className={styles.text_container}>
          <h1>더한다 도우미</h1>
          <p>이용자 맞춤 컨텐츠를 소개하고, 일정을 관리해드립니다.</p>
        </div>
      </div>

      <div className={styles.content_container}>
        <h2>메세지 알림 설정</h2>
        <div className={styles.item_container}>
          <p>{isAlarmOn ? "메세지 받기" : "메세지 받지 않기"}</p>
          <Switch onChange={(e) => {onIsAlarmChange(e)}} checked={isAlarmOn} />
        </div>
      </div>
      {isLoading ? <CircularProgress /> : isAlarmOn &&
        <div className={styles.content_container}>
          {/* <h2>받을 메세지 설정</h2>
          {sections.map((section, index) => {
            return(
              <div className={styles.item_container} key={index}>
                <p>{section.name}</p>
                <Switch onChange={(e) => { onCheckedChange(section.id, e) }} checked={checked[section.id]} />
              </div>
            )
          })} */}
          <h2>받을 메세지 설정</h2>
          {
            teams.map((team, index) => {
              return(
                <div className={styles.item_container} key={index}>
                  <p>{team.name}</p>
                  <Switch onChange={(e) => { onCheckedChange(team.id, e) }} checked={checked[team.id]} />
                </div>
              )
            })
          }
        </div>
      }
      <div style={{width:"100%", display:"flex", justifyContent:"center"}}>
        <Button onClick={onSubmitClick} style={{fontSize:"17px", width:"90%", marginTop:"20px"}} variant="outlined">저 장</Button>
      </div>
      <BackdropLoader title="알림" buttonText="확인" openBackdrop={openBackdrop} setOpenBackdrop={setOpenBackdrop} submitted={submitted} text="변경되었습니다."/>
    </div>
  )
}

export default Setting