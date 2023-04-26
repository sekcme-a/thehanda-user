import { useState, useEffect } from "react";
import firebase, {auth} from 'firebase/firebase';
import useData from "context/data";
import { useRouter } from "next/router";
import styles from "../styles/PhoneVerificate.module.css"
import { Button, TextField } from "@mui/material";
import { FIREBASE } from "firebase/hooks";

const PhoneVerificate = ({onNext, onPrev, phoneNumber, setPhoneNumber,routeWhenVerificated}) => {
  const [isLoading, setIsLoading] = useState(true)
  const {user, em, ps, setEm, setPs} = useData()
  const router = useRouter()
  const [verificationId, setVerificationId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerificating, setIsVerificating] = useState(false)
  const [isCodeSend, setIsCodeSend] = useState(false)
  // useEffect(()=>{
  //   const sendVerificationCode = async (phoneNumber) => {
  //     const applicationVerifier = new firebase.auth.RecaptchaVerifier(
  //       'recaptcha-container', {size:"invisible"});
  //     try{
  //       const result = await auth.signInWithPhoneNumber(phoneNumber, applicationVerifier);
  //       return result.verificationId;
  //     } catch(e){
  //       console.log(e)
  //       alert(e.message)
  //       if(e.message==="reCAPTCHA has already been rendered in this element"){
  //         alert("새로고침 후 다시시도해주세요.")
  //         router.reload()
  //       }
  //       else if(e.message==="Invalid format."){
  //         alert("형식에 맞지 않는 전화번호입니다.")
  //         router.reload()
  //       } else if (e.message==="We have blocked all requests from this device due to unusual activity. Try again later."){
  //         alert("인증 요청을 너무 자주 했습니다. 몇분 있다 다시 시도해주세요.")
  //         router.reload()
  //       }
  //     }
  //   };

  //   const sendVerification = async () => {
  //     const id = await sendVerificationCode(phoneNumber)
  //     setVerificationId(id)
  //     if(id===undefined){
  //       setPhoneNumber("")
  //       onPrev()
  //     }
  //   }
  //   if (!phoneNumber){
  //     sendVerification()
  //   }
  // },[phoneNumber])

  const onVerifyClick = async () => {
    try {
      console.log(verificationCode)
      setIsVerificating(true)
      const credential = await firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      console.log(credential)
      await firebase.auth().signInWithCredential(credential).then(async()=>{
      // 사용자 인증 완료 시 동작할 코드 추가
      await FIREBASE.UPDATE_USER_INFO(user.uid,{
        phoneNumber: phoneNumber,
        phoneVerified: true,
      })


      await firebase.auth().signInWithCredential(firebase.auth.EmailAuthProvider.credential(user.email, localStorage.getItem("ps")))
      setIsVerificating(false)
      alert("인증완료되었습니다.")
      if(routeWhenVerificated)
        router.push(routeWhenVerificated)
      
      onNext()
      })

    } catch (err) {
      setIsVerificating(false)
      if(err.code==="auth/invalid-verification-code")
        alert("인증번호가 틀렸습니다. 다시 시도해주세요.")
      router.reload()
    }
  }


  const onSendVerfication = () => {
    const sendVerificationCode = async (phoneNumber) => {
      const applicationVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container', {size:"invisible"});
      try{
        const result = await auth.signInWithPhoneNumber(phoneNumber, applicationVerifier);
        return result.verificationId;
      } catch(e){
        console.log(e)
        if(e.message==="reCAPTCHA has already been rendered in this element"){
          alert("새로고침 후 다시시도해주세요.")
          router.reload()
        }
        else if(e.message==="Invalid format."){
          alert("형식에 맞지 않는 전화번호입니다.")
          router.reload()
        } else if (e.message==="We have blocked all requests from this device due to unusual activity. Try again later."){
          alert("인증 요청을 너무 자주 했습니다. 몇분 있다 다시 시도해주세요.")
          router.reload()
        }
      }
    };

    const sendVerification = async () => {
      const id = await sendVerificationCode(phoneNumber)
      setVerificationId(id)
      if(id===undefined){
        setPhoneNumber("")
        onPrev()
      }
    }
    if (phoneNumber){
      setIsCodeSend(true)
      sendVerification()
    }
  }

  return(
    <>
      <div className={styles.main_container}>
        {!isCodeSend ? 
        <>
          <h1>인증번호 받기를 눌러주세요</h1>
          <Button onClick={onSendVerfication} variant="contained" fullWidth sx={{mt:"20px"}}>인증번호 받기</Button>
        </>
        :
        <>
          <h1>메세지 인증번호를 확인해주세요.</h1>
          <h2>해당 작업은 몇초에서 몇분이내 소요될 수 있습니다.</h2>
          <TextField type="number" value={verificationCode}
            onChange={(e)=>setVerificationCode(e.target.value)}
            sx={{mt:"20px"}}
            label="인증번호를 입력해주세요."
            fullWidth
          />
          <Button onClick={onVerifyClick} fullWidth variant="contained" sx={{mt:"30px"}} disabled={isVerificating}>
            {isVerificating ? "인증중입니다..":"인증하기"}
          </Button>
        </>
        }
        <div id="recaptcha-container"></div>
      </div>
    </>
  )
}

export default PhoneVerificate
