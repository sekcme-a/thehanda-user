import {useState, useEffect} from 'react';
import useData from 'context/data';
import styles from "./BottomNavigation2.module.css"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useRouter } from 'next/router';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';

import { Badge } from '@mui/material';


const BottomNavigation2 = () => {
  const {unread} = useData()
  const [value, setValue] = useState("home")

  const router = useRouter()

  useEffect(()=>{
    if(router.pathname==="/message"){
      setValue("message")
    }
    else if (router.pathname==="/schedule")
      setValue("schedule")
    else if (router.pathname==="/card")
      setValue("card")
    else
      setValue("home")
  },[router.pathname])

  const onHomeClick = () => {
    // setValue("home")
    router.push("/")
  }
  const onMessageClick = () => {
    // setValue("message")
    router.push("/message")
  }
  const onScheduleClick = () => {
    // setValue("schedule")
    router.push("/schedule")
  }
  
  const onMenuClick = () => {
    // setValue("menu")
    router.push("/card")
  }
  
  return(
    <div className={styles.main_container}>
      {unread > 0 ? 
        <Badge badgeContent={unread} color="primary">
          <div className={value==="message" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onMessageClick}>
            <EmailOutlinedIcon className={styles.icon}/>
            <p>메세지</p>
          </div>
        </Badge>
        :
        <div className={value==="message" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onMessageClick}>
          <EmailOutlinedIcon className={styles.icon}/>
            <p>메세지</p>
        </div>
      }
      <div className={value==="schedule" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onScheduleClick}>
        <CalendarMonthOutlinedIcon className={styles.icon} />
        <p>스케쥴</p>
      </div>
        <div className={styles.home_container} onClick={onHomeClick}>
          <div className={styles.home}>
            <HomeOutlinedIcon className={styles.home_icon}/>
          </div>
        </div>
      <div className={value==="card" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onMenuClick}>
        <PaymentsOutlinedIcon className={styles.icon}/>
        <p>회원권</p>
      </div>
      <div className={styles.item} onClick={()=>router.back()}>
        <KeyboardBackspaceOutlinedIcon className={styles.icon}/>
        <p>뒤로가기</p>
      </div>
    </div>
  )
}

export default BottomNavigation2