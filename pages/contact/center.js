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
  const { user } = useData()
  const [selectedCenter, setSelectedCenter] = useState("")
  const [input, setInput] = useState("")
  const [title, setTitle] = useState("")
  const [error, setError] = useState(false)
  const [helperText, setHelperText] = useState("")
  const [isAble, setIsAble] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(true)
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    const fetchData = async () => {
      // const result = await firebaseHooks.fetch_team_list()
      // setGroups(result)
      db.collection("team").get().then((query)=>{
        const result = query.docs.map((doc) => {
          return(doc.data())
        })
        setGroups(result)
        console.log(result)
        setIsLoading(false)
      })
    }
    if(user)
      fetchData()
    else{
      alert("로그인 후 이용해주세요.")
      router.push("/login")
    }
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
    // await db.collection("contents").doc(selectedCenter).collection("contact").doc().set({uid:user.uid, text:input, createdAt: new Date()})
    await db.collection("team_admin").doc(selectedCenter).collection("contact").doc().set({
      uid:user.uid, 
      text:input, 
      title: title, 
      reply: false, 
      show: false,
      mode: "center",
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

  if(!isLoading)
  return (
    <div className={styles.main_container}>
      <PageHeader text="센터 문의" />
      <div className={styles.content_container}>
        <h1>센터에 문의할 내용이 있으신가요?</h1>
        <h2>문의할 센터를 선택하고 내용을 적어주시면</h2>
        <h2>센터에서 확인 후 빠르게 도움을 드리겠습니다!</h2>
        <h3>센터 선택</h3>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="select-label">센터를 선택해주세요.</InputLabel>
              <Select
                id="select"
                value={selectedCenter}
                label="센터를 선택해주세요."
                onChange={(e) => { setSelectedCenter(e.target.value); console.log(e.target.value) }}
                style={{width:"100%"}}
             >
              {groups?.map((group, index) => {
                return (
                  // <div key={index}>
                    <MenuItem key={index} value={group.id}>{group.teamName}</MenuItem>
                  // </div>
                )
              })}
            </Select>
          </FormControl>
        </Box>  
        {selectedCenter !== "" && 
          <>
            <p>제목</p>
            <TextField placeholder='' error={error} helperText={helperText}
              style={{ width: "100%", marginTop: "12px" }} rows={6} value={title} onChange={(e)=>{setTitle(e.target.value)}} />
          </>
        }
        {selectedCenter !== "" && 
          <>
            <p>문의내용</p>
            <TextField multiline id='textarea-outlined' placeholder='' error={error} helperText={helperText}
              style={{ width: "100%", marginTop: "12px" }} rows={6} value={input} onChange={onInputChange} />
          </>
        }
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