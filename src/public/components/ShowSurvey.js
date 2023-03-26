import { useEffect, useState } from "react"
import styles from "../styles/showSurvey.module.css"
import { useRouter } from "next/router"
import { motion } from "framer-motion"

import useData from "context/data"

import HeaderLeftClose from "src/public/components/HeaderLeftClose"
import BackdropLoader from "src/programs/components/BackdropLoader"

import CircularProgress from '@mui/material/CircularProgress';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Form from "../form/Form"
import { firebaseHooks } from "firebase/hooks"
import { firestore as db } from "firebase/firebase"



const ShowSurvey = ({data, team_id, id, type}) => {
  const router = useRouter()
  const { user } = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [text, setText] = useState()
  const [formData, setFormData] = useState()
  const [inputData, setInputData] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [hasHistory, setHasHistory] = useState(false)
  const [backdropValue, setBackdropValue] = useState({
    openBackdrop: false,
    submitted: true,
    title: "알림",
    text: "",
    buttonText:"확인"
  })

  const [selectedMembers, setSelectedMembers] = useState([])

  const handleInputData = (data) => {
    setInputData([...data])
  }

  useEffect(() => {
    setIsLoading(false)
  }, [])
  
  const onApplyClick = async () => {
    setIsSubmitting(true)
    for (const formItem of data.formData) {
      if (formItem.isRequired) {
        let hasValue=false
        for (const inputItem of inputData) {
          if(inputItem.id===formItem.id)
            hasValue=true
        }
        if (!hasValue) {
          setBackdropValue({
            openBackdrop: true,
            submitted: true,
            title: "알림",
            text: `${formItem.title}은(는) 필수항목입니다.`,
            buttonText:"확인"
          })
          setIsSubmitting(false)
          return
        }
      }
    }
    if(data.type!=="common"){
      if(selectedMembers.length===0){
        setBackdropValue({
          openBackdrop: true,
          submitted: true,
          title: "알림",
          text: `가족 구성원 선택은(는) 필수항목입니다.`,
          buttonText:"확인"
        })
        setIsSubmitting(false)
        return
      }
    }
    setOpenBackdrop(true)
      // await firebaseHooks.submit_form_input(user.uid, id, type, teamName, inputData, data.submitCount)
      const batch = db.batch()
    if(type==="programs"||type==="surveys"){
      //users로 등록 (team, team_admin 둘다)
      const teamDoc = await db.collection("team").doc(team_id).collection("users").doc(user.uid).get()
      if(!teamDoc.exists){
        batch.set(db.collection("team_admin").doc(team_id).collection("users").doc(user.uid), {})
        batch.set(db.collection("team").doc(team_id).collection("users").doc(user.uid), {})
      }
    }

    if(type==="programs" || type==="surveys"){
      //데이터 저장
      batch.set(db.collection("team_admin").doc(team_id).collection("result").doc(id).collection("users").doc(user.uid),{
        data: [...inputData],
        selectedMembers: selectedMembers,
        createdAt: new Date()
      })
    } else if (type==="programSurvey"){
        //데이터 저장 및 유저안에서 프로그램 설문조사 제거
        batch.set(db.collection("team_admin").doc(team_id).collection("programSurveyResult").doc(id).collection("users").doc(user.uid),{
          data: [...inputData]
        })
        batch.update(db.collection("user").doc(user.uid).collection("programSurvey").doc(id), {hasSubmit: true})
    }
    //관리자에 기록 저장
    if(type==="programs"){
      batch.set(db.collection("team_admin").doc(team_id).collection("users").doc(user.uid).collection("timeline").doc(), {
        createdAt: new Date(),
        docId: id,
        text: `사용자가 [${data.title}]을(를) 신청했습니다.`,
        title: `[${data.title}] 프로그램 신청`,
        type: type
      })
    } else if(type==="surveys"){
      batch.set(db.collection("team_admin").doc(team_id).collection("users").doc(user.uid).collection("timeline").doc(), {
        createdAt: new Date(),
        docId: id,
        text: `사용자가 [${data.title}] 설문조사를 작성했습니다..`,
        title: `[${data.title}] 설문조사 작성`,
        type: type
      })
    } 
    else if (type==="programSurvey"){
      batch.set(db.collection("team_admin").doc(team_id).collection("users").doc(user.uid).collection("timeline").doc(), {
        createdAt: new Date(),
        docId: id,
        text: `사용자가 [${data.title}]프로그램의 설문조사를 참여했습니다..`,
        title: `[${data.title}] 프로그램 설문조사 참여`,
        type: type
      })
    }

    //사용자 기록 저장
    if(type==="programs" || type==="surveys"){
      let history = []
      const historyDoc = await db.collection("user").doc(user.uid).collection("history").doc(type).get()
      if(historyDoc.exists)
        history = [...historyDoc.data().data]
      batch.set(db.collection("user").doc(user.uid).collection("history").doc(type),{
        data: [{id: id, team: team_id}, ...history]
      })
    }

    await batch.commit()
    
    setIsSubmitting(false)
    // router.push(`/thanks/${teamName}/${id}`)
  }
  
  const onBackdropClick = () => {
    //제출 완료 후 backdrop 클릭시 메인화면으로 이동
    if (!isSubmitting) {
      router.push("/")
    } else {
      setOpenBackdrop(false)
    }
  }

  // if (text!==undefined && isLoading)
  //   return(
  //     <div className={styles.main_container}>
  //       <HeaderLeftClose title={data.title} />
  //       <div className={styles.content_container}>
  //         <CircularProgress />
  //       </div>
  //     </div>
  //   )  
  // else if(text!==undefined)
  if(!isLoading)
  return(
    <div className={styles.main_container}>
      <HeaderLeftClose title={type==="programSurvey" ? `"${data.title}" 설문조사`: data.title} />
      <div className={styles.content_container}>
          <Form formDatas={data.formData} data={inputData} handleData={handleInputData} addMargin={true} type={data.type} setSelectedMembers={setSelectedMembers}/>
      </div>
      {type!=="test" &&
        <div className={styles.button_container}>
          <Button variant="contained" className={styles.button} disabled={isSubmitting} onClick={onApplyClick}>
            {isSubmitting ? "제출중입니다." : "제출"}
          </Button>
        </div>
      }
      <BackdropLoader openBackdrop={backdropValue.openBackdrop}
        setOpenBackdrop={(value) => setBackdropValue({ ...backdropValue, ["openBackdrop"]: value })}
        submitted={backdropValue.submitted}
        title={backdropValue.title}
        text={backdropValue.text}
        buttonText={backdropValue.buttonText}
      />


      <Backdrop
        sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1, display:"flex", justifyContent:"center" }}
        open={openBackdrop}
        onClick={onBackdropClick}
      >
        <div className={styles.backdrop_container}>
          {isSubmitting ?
            <>
              <CircularProgress style={{'color': 'white'}} />
              <p>잠시만 기다려주세요...</p>
            </>
            :
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }}>
                <AddTaskIcon style={{ fontSize: "80px" }} />
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.2, delay:0.5 } }}
              style={{ width: "100%", textAlign: "center" }}>
                <h1>제출 성공!</h1>
                <h2>작성해주셔서 감사합니다.</h2>
              </motion.div>
            </>
          }
        </div>
      </Backdrop>
    </div>
  )
}

export default ShowSurvey