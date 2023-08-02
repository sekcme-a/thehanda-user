import { useState, useEffect } from "react"

import styles from "src/card/benefitRequest.module.css"
import PageHeader from "src/public/components/PageHeader"

import {DB} from "./benefitRequestDB"
import useUserData from "context/userData"

import { TextField, Button } from "@mui/material"

import { useRouter } from "next/router"
import CustomAlert from "src/public/components/CustomAlert"
import SubmitLoader from "src/public/components/loader/SubmitLoader"

import { firestore as db } from "firebase/firebase"

const BenefitRequest = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alreadySendedRequest, setAlreadySendedRequest] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const onBackdropClick = () => setOpenBackdrop(false)
  const {user} = useUserData()
  //*****for inputs
  const [values, setValues] = useState({
    companyName: "",
    benefits: ""
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****

  

  useEffect(()=>{ 
    const fetchData = async () => {
      const doc = await DB.FETCH_REQUESTED_DATA(user.uid)
      if(doc){
        setValues(doc)
        setAlreadySendedRequest(true)
      }
    }

    if(user)
      fetchData()
    else
      router.push("/start/walkthrough")
    
  },[])

  const onSubmit = async () => {
    setIsSubmitting(true)

    //신청취소
    if(alreadySendedRequest){
      db.collection("benefitRequest").doc(user.uid).delete().then(() => {
        alert("신청 취소되었습니다.")
        setAlreadySendedRequest(false)
        setIsSubmitting(false)
      })
    } else {
      if(values.companyName==="")
        setError({type:"companyName", message: "상호명을 입력해주세요."})
      else if(values.benefits==="")
        setError({type:"benefits", message: "혜택을 입력해주세요."})
      else{
        setOpenBackdrop(true)

        db.collection("benefitRequest").doc(user.uid).set(values).then(() => {
          setIsSubmitting(false)
          setAlreadySendedRequest(true)
        })
        
      }
    }
  }

  return(
    <div className={styles.main_container}>
      <PageHeader text="제휴 신청" />
      <div className={styles.content_container}>
        <h1>제휴 신청에 관심을 가져주셔서 감사합니다.</h1>
        
        <h2>더한다는 항상 협력과 파트너십을 환영합니다.</h2>
        <h2>함께 협력하여 더 나은 미래를 만들어 나가길 기대합니다.</h2>

        <h3 style={{marginTop:"20px"}}>제휴 신청에 대한 검토를 진행한 후, 가능한 빠르게 연락 드리겠습니다.</h3>
        <h3>{`승인이 완료되면 "마이페이지-제휴 게시물 관리" 를 통해 더한다 이용자들을 위한 혜택을 작성하실 수 있으며, 해당 내용은 모든 사용자들이 확인할 수 있습니다.`}</h3>
        <div style={{height:"30px"}} />

        <TextField
          label="상호명 * "
          fullWidth
          error={error.type==="companyName"}
          helperText={error.type!=="companyName" ? "" : error.message}
          value={values.companyName}
          onChange={onValuesChange("companyName")}
          // multiline={false} rows={1} maxRows={1}
          size="small"
          disabled={alreadySendedRequest}
        />
        <TextField
          sx={{mt:"18px"}}
          label="혜택 내용 * "
          fullWidth
          error={error.type==="benefits"}
          helperText={error.type!=="benefits" ? "제공할 혜택 내용을 간략하게 작성해주세요." : error.message}
          value={values.benefits}
          onChange={onValuesChange("benefits")}
          disabled={alreadySendedRequest}
          // multiline={false} rows={1} maxRows={1}
          size="small"
        />
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{mt:"30px"}}
          fullWidth
          disabled={isSubmitting}
        >
          {!alreadySendedRequest ? "신청하기" : "신청 취소"}
        </Button>
      </div>
      <SubmitLoader openBackdrop={openBackdrop} onBackdropClick={onBackdropClick} text="신청해주셔서 감사합니다. 최대한 빠른 시일 내에 답변드리겠습니다."/>
    </div>
  )
}

export default BenefitRequest