import { useEffect, useState } from "react"
import styles from "src/contact/center.module.css"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"
import { motion } from "framer-motion"

import useData from "context/data"

import PageHeader from "src/public/components/PageHeader"

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddTaskIcon from '@mui/icons-material/AddTask';

const Center = () => {
  const router = useRouter()
  const {id, team_id} = router.query
  const { user } = useData()
  const [selectedType, setSelectedType] = useState("")
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("")
  const [isAble, setIsAble] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(true)
  const [title, setTitle] = useState("")
  // const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      db.collection("team").doc(team_id).collection("programs").doc(id).get().then((doc) => {
        setTitle(doc.data().title)
      })
    }
    if (user === null) {
      alert("로그인 후 이용해주세요.")
      router.push("/login")
    }
    fetchData()
  }, [])


  const onInputChange = (e) => {
    setInput(e.target.value)
    if (e.target.value.length > 1000) {
      setError(true)
      setHelperText("문의 내용이 너무 깁니다.")
    } else {
      setError(false)
      setHelperText("")
      if(e.target.value !== "" && e.target.value!==" ")
        setIsAble(true)
      else
        setIsAble(false)
    }
  }

  const onSubmitClick = async () => {
    setOpenBackdrop(true)
    setIsSubmitting(true)
    await db.collection("team_admin").doc(team_id).collection("contact").doc().set({
      uid:user.uid, 
      text:input, 
      title: title, 
      reply: false, 
      show: false,
      mode: "program",
      createdAt: new Date()
    })
    setIsSubmitting(false)
  }

  const onBackdropClick = () => {
    //제출 완료 후 backdrop 클릭시 메인화면으로 이동
    if (!isSubmitting) {
      router.push("/")
    } else {
      setOpenBackdrop(false)
    }
  }


  return (
    <div className={styles.main_container}>
    <PageHeader text="프로그램 문의" />
    <div className={styles.content_container}>
      <h1>프로그램에 문의할 내용이 있으신가요?</h1>
      <h2>이 프로그램에 대해 궁금하신 내용을 적어주시면</h2>
      <h2>확인 후 빠르게 도움을 드리겠습니다!</h2>
      <h4 style={{marginTop:"25px", fontWeight:"bold"}}>문의할 프로그램</h4>
      <h4 style={{marginTop: "5px"}}>{title}</h4> 

      <p>문의내용</p>
      <TextField multiline id='textarea-outlined' placeholder='' error={error} helperText={helperText}
        style={{ width: "100%", marginTop: "12px" }} rows={6} value={input} onChange={onInputChange} />

      <div className={styles.button_container}>
        <Button fullWidth variant="outlined" disabled={!isAble} onClick={onSubmitClick}>보내기</Button>
      </div>
    </div>
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
              <h1>문의가 접수되었습니다.</h1>
              <h2>빠른 시일 내에 답변드리겠습니다!</h2>
            </motion.div>
          </>
        }
      </div>
    </Backdrop>
  </div>
  )
}

export default Center