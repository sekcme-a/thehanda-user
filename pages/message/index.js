import { useEffect, useState } from "react"
import styles from "src/message/index.module.css"
import { useRouter } from "next/router"
import Image from "next/image"
import useData from "context/data"
import useUserData from "context/userData"
import { firestore as db } from "firebase/firebase"
import AlarmContainer from "src/message/AlarmContainer"

import Menu from "src/public/components/header/Menu"

import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
const Message = () => {
  const router = useRouter()
  const { user } = useUserData()
  const [messageList, setMessageList] = useState([])

  const [isHide, setIsHide] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)
  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }

  useEffect(() => {
    const fetchData = async () => {
      // db.collection("user").doc(user.uid).collection("message").orderBy("repliedAt", "desc").get().then((query)=>{
      //   const temp = query.docs.map((doc)=>{
      //     if(doc.id!=="status")
      //       return {...doc.data(), id:doc.id}
      //   }).filter(Boolean)
      //   setMessageList(temp)
      // })
      const dbRef = db.collection("user").doc(user.uid).collection("message").orderBy("repliedAt", "desc")
      const unsubscribe = dbRef.onSnapshot((query)=>{
        const temp = query.docs.map((doc)=>{
          if(doc.id!=="status")
            return {...doc.data(), id:doc.id}
        }).filter(Boolean)
        setMessageList(temp)
      })


      return () => {
        unsubscribe()
      }
    }
    if(user)
      fetchData()
    else
      router.push("/login")

  }, [])

  // const onClick = () => {
  //   router.push("/message/dahanda")
  // }
  const onClick = (address) => {
    router.push(address)
  }
  return (
    <div className={styles.main_container}>
      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 
      <div className={styles.header_container}>
        <div className={styles.header_right}>
          <div className={styles.logo_container}>
            <Image src="/logo_simple.png" width={38} height={38} alt="다한다 로고" />
          </div>
          <h1>더한다</h1>
        </div>
        <div>
          <EditNotificationsOutlinedIcon onClick={() => {router.push("/message/setting")}} color="primary"  />
          <MenuRoundedIcon className={styles.menu_icon} onClick={onMenuClick} style={{marginLeft:"10px"}}color="primary" />
          {/* <CloseRoundedIcon style={{ marginLeft: "14px" }} color="primary" /> */}
        </div>
      </div>

      {/* <AlarmContainer image="/logo_simple.png" name="더한다 도우미" date=""
        text={"안녕하세요,\n어플의 궁금점을 해결해드리고,\n 이용자 맞춤 컨텐츠를 추천해드리는\n더한다 도우미입니다."}
        button="대화 보기" onClick={onClick} /> */}
      {messageList.map((item, index)=>{
        if(item.mode==="center")
          return(
            <div key={index}>
              <AlarmContainer image="/logo_simple.png" name="더한다 도우미" 
                text={`문의하신 "${item.title}" 에 대한 답장이 도착했습니다.`}
                button={["답장 확인하기"]} onClick={[()=>onClick(`/message/reply/${item.id}`)]}
                read={item.read}
              />  
            </div>
          )
        if(item.mode==="program")
          return(
            <div key={index}>
              <AlarmContainer image="/logo_simple.png" name="더한다 도우미" 
                text={`문의하신 [${item.title}] 프로그램에 대한 답장이 도착했습니다.`}
                button={["답장 확인하기"]} onClick={[()=>onClick(`/message/reply/${item.id}`)]}
                read={item.read}
              />  
            </div>
          )
        if(item.mode==="benefitRequestAccept")
          return(
            <div key={index}>
              <AlarmContainer image="/logo_simple.png" name="더한다 도우미" 
                text={item.title}
                button={["제휴 등록하러 가기"]} onClick={[()=>onClick(`/card/editBenefit`)]}
                read={item.read}
              />  
            </div>
          )
        if(item.mode==="benefitRequestDecline")
          return(
            <div key={index}>
              <AlarmContainer image="/logo_simple.png" name="더한다 도우미" 
                text={item.title}
                read={item.read}
              />  
            </div>
          )
        if(item.mode==="talk")
          return(
            <div key={index}>
              <AlarmContainer image={item.teamProfile} name={item.title} date={item.repliedAt}
                text={item.content}
                button={["메세지 보기"]} onClick={[()=>onClick(`/talk/${item.id}`)]}
                unread={item.unread}
              />  
            </div>
          )
      })}
      <AlarmContainer image="/logo_simple.png" name="더한다 도우미" 
        text={"안녕하세요\n더한다를 이용해주셔서 감사합니다!\n어플에 대해 궁금하시다면 도움말 보기,\n문의할 사항이 있으시다면 문의하기를 눌러주세요."}
        button={["도움말 보기", "센터 문의하기", "어플 문의하기"]} onClick={[()=>onClick("/info/faq"), ()=>onClick("/contact/center"), ()=>onClick("/contact/app")]}
      />
      <div style={{height:"80px"}} />
    </div>
  )
}

export default Message