import { useState, useEffect } from "react";
import useData from "context/data";
import { useRouter } from "next/router";
import styles from "../styles/PhoneNumber.module.css"
import { MuiTelInput,matchIsValidTel } from 'mui-tel-input'
import { Button } from "@mui/material";
import CustomAlert from "./CustomAlert";

const PhoneNumber = ({phoneNumber, setPhoneNumber, onNext, onPrev}) => {
  const [isLoading, setIsLoading] = useState(true)
  const {user} = useData()
  const router = useRouter()
  //phoneNumber 이 바뀌면 PhoneVerificate.js 의 useEffect에 trigger로 인증번호가 보내지기 때문에 e.target.value바뀌는건 phone으로 hanlde
  const [phone, setPhone] = useState("")
  const [customAlert, setCustomAlert] = useState({
    title:"",
    content:"",
    open: false,
    type:"",
    result: true,
  })

  useEffect(()=>{

  },[])

  const handleChange = (newPhone) => {
    setPhone(newPhone)
  }

  const onSendVerificationClick = () => {
    if(!matchIsValidTel(phone)){
      setCustomAlert({
        title:"전화번호 양식오류",
        content:"전화번호 양식이 잘못되었습니다. 다시 입력해주세요.",
        type:"alert",
        open: true,
        result: true,
      })
    } else{
      setPhoneNumber(phone)
      onNext()
    }
  }

  return(
    <>
      <div className={styles.main_container}>
        <MuiTelInput
          value={phone} 
          onChange={handleChange} 
          focusOnSelectCountry
          defaultCountry="KR"
          preferredCountries={['KR','CN','VN', 'JP', 'TH']} 
        />
        <p>{phoneNumber}</p>
        <Button onClick={onSendVerificationClick} fullWidth variant="contained" sx={{mt:"30px"}}>다음</Button>

        <Button onClick={()=>onPrev()} fullWidth sx={{bgcolor:"rgb(160,160,160)", color:"white", mt:"20px"}}>이전으로</Button>
        <CustomAlert alert={customAlert} setAlert={setCustomAlert}/>
      </div>
    </>
  )
}

export default PhoneNumber