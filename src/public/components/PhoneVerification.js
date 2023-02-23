import { useState } from 'react';
import firebase, {auth} from 'firebase/firebase';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';
// import firebase from 'firebase';
import styles from "../styles/phoneVerification.module.css"

export default function PhoneVerification({phoneNumber, handlePhoneNumber, handleIsPhoneVerificated}) {
  const [verificationId, setVerificationId] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerificated, setIsVerificated] = useState(false)
  const [isVerificationClick, setIsVerficationClick] = useState(false)

  const sendVerificationCode = async (phoneNumber) => {
    const applicationVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container', {size:"invisible"});
    try{
      const result = await auth.signInWithPhoneNumber(phoneNumber, applicationVerifier);
      return result.verificationId;
    } catch(e){
      console.log(e)
      if(e.message==="reCAPTCHA has already been rendered in this element")
        alert("새로고침 후 다시시도해주세요.")
    }
  };

  // const isValidPhoneNumber = (phoneNumber) => {
  //   const phoneRegex = /^\+[1-9]\d{1,14}$/; //+8201058120630
  //   const phoneNumber = /^\d{3}-\d{4}-\d{4}$/ //010-5812-0630
  //   return phoneRegex.test(phoneNumber);
  // };
  

  const onClick = async() => {

    const phoneRegex = /^\+[1-9]\d{1,14}$/; //+8201058120630
    const phoneRegex2 = /^\d{3}-\d{4}-\d{4}$/ //010-5812-0630

    let resultNumber = phoneNumber
    if(!phoneRegex.test(phoneNumber) && !phoneRegex2.test(phoneNumber)){
      alert("전화번호 형식이 틀렸습니다. 예) 010-1234-1234 or +8201058120630")
      return
    }
    else if(phoneRegex2.test(phoneNumber))
      resultNumber = `+82${resultNumber}`

    try{
      setIsVerficationClick(true)
        const id = await sendVerificationCode(resultNumber);
      console.log(id)
      setVerificationId(id);
      if(id!==undefined)
        alert("인증번호가 발송되었습니다. 몇 분 정도 소요될 수 있습니다. 잠시만 기다려주세요. ")
    }catch(e){
      console.log(e)
    }
  }

  const onVerifyClick = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await firebase.auth().signInWithCredential(credential);
      // 사용자 인증 완료 시 동작할 코드 추가
      handleIsPhoneVerificated(true)
      setIsVerificated(true)
      alert("인증완료되었습니다.")
    } catch (err) {
      // setError(err);
      console.log(err)
      if(err.code==="auth/invalid-verification-code")
        alert("인증번호가 틀렸습니다. 새로고침 후 다시 시도해주세요.")
    }
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.item_container}>
        <TextField value={phoneNumber} onChange={(e)=>handlePhoneNumber(e.target.value)} label="전화번호" placeholder='010-1234-5678'/>
        <Button onClick={onClick} style={{width:"120px"}} disabled={isVerificationClick&&verificationId!==undefined}>인증번호 받기</Button>
      </div>

      {verificationId!==""&&
        <div className={styles.item_container}>
          <TextField value={verificationCode} onChange={(e)=>setVerificationCode(e.target.value)} label="인증번호" />
          <Button onClick={onVerifyClick} style={{width:"100px"}} disabled={isVerificated}>{isVerificated ? "인증완료" :"인증"}</Button>
        </div>
      }

      <div id="recaptcha-container"></div>
    </div>
  );
}
