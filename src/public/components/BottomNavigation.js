import {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import styles from "../styles/footer.module.css"
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

const BottomNavigationComponent = () => {
  const { user, unread } = useData()
  const [value, setValue] = useState(0)
  const router = useRouter()


  const onBackClick = () => {
    router.back()
  }
  const onAlarmClick = () => {router.push("/message")}

  const onScheduleClick = () => {
    if (user)
      router.push("/schedule")
    else
      router.push("/login")
  }
  
  const onMenuClick = () => { router.push('/menu') }
  
  const onHomeClick = () => { router.push("/") }
  
  useEffect(() => {
    if(router.pathname==="/message"){
      setValue(0)
    }
    else if (router.pathname==="/myPage")
      setValue(1)
    else if (router.pathname==="/menu")
      setValue(4)
    else
      setValue(-1)
  },[router.pathname])

  return (
    <div className={styles.main_container}>
      <BottomNavigation
        showLabels={true}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        style={{height: "65px"}}
      >
        {unread>0 ?
        <BottomNavigationAction onClick={onAlarmClick} label="메세지" icon={<Badge badgeContent={unread} color="primary" ><EmailOutlinedIcon className={styles.icon} /></Badge>}  />
        :
        <BottomNavigationAction onClick={onAlarmClick} label="메세지" icon={<EmailOutlinedIcon className={styles.icon} />}  />
        
        }
        
        <BottomNavigationAction onClick={onScheduleClick} label="스케쥴" sx={{ "& .MuiBottomNavigationAction-label" : {fontSize:"11px !important"} }} icon={<CalendarMonthOutlinedIcon sx={{fontSize:"27px !important"}}  className={styles.icon}/>} />


        <BottomNavigationAction label=" "  />
        <div className={styles.home_container} onClick={onHomeClick}>
          <BottomNavigationAction icon={<HomeOutlinedIcon className={styles.home_icon}/>} className={styles.home} />
        </div>
        <BottomNavigationAction onClick={onMenuClick} label="메뉴" icon={<MenuOutlinedIcon className={styles.icon} />} />
        <BottomNavigationAction label="뒤로가기" onClick={onBackClick} icon={<KeyboardBackspaceOutlinedIcon className={styles.icon}/>} />
      </BottomNavigation>
    </div>
  );
}

export default BottomNavigationComponent