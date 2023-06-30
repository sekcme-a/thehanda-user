import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import styles from "../styles/BottomNavigation2.module.css"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useRouter } from 'next/router';
import useData from 'context/data';
import { firestore as db } from 'firebase/firebase';
import { Badge } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';


const BottomNavigation2 = () => {
  const [value, setValue] = useState("home")

  const router = useRouter()

  useEffect(()=>{
    if(router.pathname==="/message"){
      setValue("message")
    }
    else if (router.pathname==="/schedule")
      setValue("schedule")
    else if (router.pathname==="/menu")
      setValue("menu")
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
    router.push("/menu")
  }
  
  return(
    <div className={styles.main_container}>
      <div className={value==="message" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onMessageClick}>
        <EmailOutlinedIcon className={styles.icon}/>
        <p>메세지</p>
      </div>
      <div className={value==="schedule" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onScheduleClick}>
        <CalendarMonthOutlinedIcon className={styles.icon} />
        <p>스케쥴</p>
      </div>
        <div className={styles.home_container} onClick={onHomeClick}>
          <div className={styles.home}>
            <HomeOutlinedIcon className={styles.home_icon}/>
          </div>
        </div>
      <div className={value==="menu" ? `${styles.item} ${styles.selected}` : styles.item} onClick={onMenuClick}>
        <MenuOutlinedIcon className={styles.icon}/>
        <p>메뉴</p>
      </div>
      <div className={styles.item}>
        <KeyboardBackspaceOutlinedIcon className={styles.icon}/>
        <p>뒤로가기</p>
      </div>
    </div>
  )
}

export default BottomNavigation2