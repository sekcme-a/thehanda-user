import styles from "./TopNavbar.module.css"
import { useRouter } from "next/router";

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const TopNavbar = ({scrollY, onMenuClick, teamName, hideArrow}) => {
  const router = useRouter()


  return(
    <div className={scrollY === 0 ? styles.header_container : `${styles.header_container} ${styles.add_background}`}>
      <div className={styles.logo_container} onClick={()=>router.push("/start/selectTeam")}>
        <h1>더한다+</h1>
        <h2>{teamName}</h2>
        {!hideArrow && <ArrowDropDownIcon />}
      </div>
      <div>
        {/* <NotificationsNoneIcon /> */}
        <MenuRoundedIcon className={styles.menu_icon} onClick={onMenuClick} />
      </div>
    </div>
  )
}

export default TopNavbar