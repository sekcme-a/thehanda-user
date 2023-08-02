import { useState, useEffect } from "react"
import styles from "./menu.module.css"
import { useRouter } from "next/router";

import { AnimatePresence, motion } from "framer-motion"

import useData from "context/data";
import useUserData from "context/userData";
import { firestore as db } from "firebase/firebase";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Button from '@mui/material/Button';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import MenuItemsContainer from "./MenuItemsContainer"

import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import AodOutlinedIcon from '@mui/icons-material/AodOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined';
import DeviceUnknownOutlinedIcon from '@mui/icons-material/DeviceUnknownOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import PollIcon from '@mui/icons-material/Poll';
import Image from "next/image";
// import { firebaseHooks } from "firebase/hooks";


const Menu = (props) => {
  const [text, setText] = useState("")
  const [menuItems, setMenuItems] = useState([])
  const { user, userData } = useUserData()
  const {section} = useData()
  const router = useRouter()
  const onCloseMenuClick = () => {
    props.setIsHide(false)
    props.handleIsMenuOpen(false)
  }

  useEffect(() => {
    const fetchData = async (lang) => {
      const iconStyle={color: "#814ad8"}

      const programData = section?.program?.map((item)=>{
        return {icon: <Diversity2OutlinedIcon style={iconStyle} />, text: item.name, path: `/home/program/${item.id}`}
      })
      const surveyData = section?.survey?.map((item)=>{
        return {icon: <PollIcon style={iconStyle} />, text: item.name, path: `/home/survey/${item.id}`}
      })
      const anData = section?.anouncement?.map((item)=>{
        return {icon: <CampaignOutlinedIcon style={iconStyle} />, text: item.name, path: `/home/anouncement/${item.id}`}
      })
      

      setMenuItems(
        [
          {
            title: "프로그램",
            data: programData,
            
          },
          {
            title: "설문조사",
            data: surveyData,
          },
          {
            title: "공지사항",
            data: anData,
          },
          {
            title: "문의",
            data: [
              { icon: <SupportAgentOutlinedIcon style={iconStyle} />, text: "센터 문의", path:"contact/center" },
              { icon: <DeviceUnknownOutlinedIcon style={iconStyle} />, text: "어플 문의", path:"contact/app"},
            ]
          },
          {
            title: "어플 안내",
            data: [
              { icon: <NewspaperOutlinedIcon style={iconStyle} />, text: "다문화 소식", path:"/home/multiculturalNews/main" },
              { icon: <SupportAgentOutlinedIcon style={iconStyle} />, text: "도움말", path:"/info/faq" },
              { icon: <DocumentScannerOutlinedIcon style={iconStyle} />, text: "서비스이용약관", path:"/info/service" },
              { icon: <ContactPageOutlinedIcon style={iconStyle} />, text: "개인정보처리방침", path:"/info/private"},
            ]
          },
        ]
      )
    }
    fetchData()
  },[])

  
  const onLoginClick = () => {
    router.push("/login")
  }



  const onProfileClick = () => {
    router.push("/myPage")
  }
  return (
    <AnimatePresence>
      {props.isMenuOpen &&
        <motion.div
          key="modal"
          className={props.isMenuOpen ? styles.main_container : `${styles.main_container} ${styles.hide}`}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, transition: { duration: .5, }, x: 0 }}
          exit={{ opacity: 0, x: 40, transition: { duration: .5, } }}
        >
          
          <div className={styles.header_container}>
            <div className={styles.button_container}>
              <div>
                <CloseRoundedIcon onClick={onCloseMenuClick} style={{ fontSize: "27px", color: "#EEEEEE" }} />
              </div>
              <div>
                {/* <MailOutlineIcon style={{ fontSize: "27px", marginRight: "10px" , color: "#EEEEEE"}}/>
                <SettingsOutlinedIcon style={{ fontSize: "27px" , color: "#EEEEEE"}}/> */}
              </div>
            </div>
            
              {user ?
                <div className={styles.profile_container} onClick={onProfileClick}>
                  <div className={styles.profile}>
                    <h1>안녕하세요, {userData.displayName} 님</h1>
                    <p>{user.email ? user.email : "이메일을 등록해주세요."}</p>
                  </div>
                  <ArrowForwardIosRoundedIcon />
                </div>
                :
                <div className={styles.login_container}>
                  <p>더 많은 정보와 프로그램 참여를 위해 로그인 해 주세요.</p>
                  {/* <p>{text.please_log_in_for_more_information_and_participation_in_the_program}</p> */}
                  <Button variant="outlined" style={{width:"90%", color:"white", border: "1px solid white"}} onClick={onLoginClick}>로그인</Button>
                </div>
              }
          </div>


          <div className={styles.banner_container} onClick={()=>router.push("/card/benefits")}>
            <Image src="/banner/event_for_everyone.png" layout="responsive" width={232} height={365} alt="basic card"/>
          </div>


          <MenuItemsContainer items={menuItems}  />
          
        </motion.div>
      }
    </AnimatePresence>
  )
}

export default Menu