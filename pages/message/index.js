import { useEffect, useState } from "react"
import styles from "src/message/styles/index.module.css"
import { useRouter } from "next/router"
import Image from "next/image"
import useData from "context/data"

import AlarmContainer from "src/message/components/AlarmContainer"

import EditNotificationsOutlinedIcon from '@mui/icons-material/EditNotificationsOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TextField from '@mui/material/TextField';

const Message = () => {
  const router = useRouter()
  const { user } = useData()
  const [input, setInput] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      
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

      <div className={styles.header_container}>
        <div className={styles.header_right}>
          <div className={styles.logo_container}>
            <Image src="/logo_simple.png" width={38} height={38} alt="다한다 로고" />
          </div>
          <h1>더한다</h1>
        </div>
        <div>
          <EditNotificationsOutlinedIcon onClick={() => {router.push("/message/setting")}} color="primary"  />
          {/* <CloseRoundedIcon style={{ marginLeft: "14px" }} color="primary" /> */}
        </div>
      </div>

      {/* <AlarmContainer image="/logo_simple.png" name="더한다 도우미" date=""
        text={"안녕하세요,\n어플의 궁금점을 해결해드리고,\n 이용자 맞춤 컨텐츠를 추천해드리는\n더한다 도우미입니다."}
        button="대화 보기" onClick={onClick} /> */}
      <AlarmContainer image="/logo_simple.png" name="더한다 도우미" date=""
        text={"안녕하세요\n더한다를 이용해주셔서 감사합니다!\n어플에 대해 궁금하시다면 도움말 보기,\n문의할 사항이 있으시다면 문의하기를 눌러주세요."}
        button={["도움말 보기", "센터 문의하기", "어플 문의하기"]} onClick={[()=>onClick("/info/faq"), ()=>onClick("/contact/center"), ()=>onClick("/contact/app")]}
      />
    </div>
  )
}

export default Message