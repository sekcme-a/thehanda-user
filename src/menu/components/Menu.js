import { useState, useEffect } from "react"
import styles from "../styles/menu.module.css"
import { useRouter } from "next/router";

import { AnimatePresence, motion } from "framer-motion"

import useData from "context/data";
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
// import { firebaseHooks } from "firebase/hooks";


const Menu = (props) => {
  const [text, setText] = useState("")
  const [menuItems, setMenuItems] = useState([])
  const { user, userData } = useData()
  const router = useRouter()
  const onCloseMenuClick = () => {
    props.setIsHide(false)
    props.handleIsMenuOpen(false)
  }

  useEffect(() => {
    const fetchData = async (lang) => {
      const iconStyle={color: "#814ad8"}
      // let programData = []
      // let surveyData = []
      // let noticeData = []
      // // let programData = [{ icon: <PublicOutlinedIcon style={iconStyle}/>, text: "??????" },]
      // // let surveyData = [{ icon: <PublicOutlinedIcon style={iconStyle}/>, text: "??????" },]
      // // let noticeData = [{ icon: <PublicOutlinedIcon style={iconStyle}/>, text: "??????" }]
      // let groupsList = groups
      // if (groupsList.length === 0) {
      //   const result = await firebaseHooks.fetch_team_list()
      //   setGroups(result)
      //   groupsList = result
      // }
      // groupsList.forEach((group) => {
      //   programData.push({
      //     icon: <Diversity2OutlinedIcon style={iconStyle} />, text: group.name, path: `/home/program/${group.id}`
      //   })
      //   surveyData.push({
      //     icon: <AodOutlinedIcon style={iconStyle}/>, text: group.name, path:`/home/survey/${group.id}`
      //   })
      //   noticeData.push({
      //     icon: <CampaignOutlinedIcon style={iconStyle}/>, text: group.name, path:`/home/anouncement/${group.id}`
      //   })
          
      // })

      const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc('program').get()
      const programData = doc.data()?.data.map((item)=>{
        return {icon: <Diversity2OutlinedIcon style={iconStyle} />, text: item.name, path: `/home/program/${item.id}`}
      })
      const surveyDoc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc('survey').get()
      const surveyData = surveyDoc.data()?.data.map((item)=>{
        return {icon: <PollIcon style={iconStyle} />, text: item.name, path: `/home/survey/${item.id}`}
      })
      const anDoc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc('anouncement').get()
      const anData = anDoc.data()?.data.map((item)=>{
        return {icon: <CampaignOutlinedIcon style={iconStyle} />, text: item.name, path: `/home/anouncement/${item.id}`}
      })
      

      setMenuItems(
        [
          {
            title: "????????????",
            data: programData,
            
          },
          {
            title: "????????????",
            data: surveyData,
          },
          {
            title: "????????????",
            data: anData,
          },
          // {
          //   title: txt.survey,
          //   data: surveyData,
            
          // },
          // {
          //   title: txt.anouncement,
          //   data: noticeData,
            
          // },
          {
            title: "??????",
            data: [
              { icon: <SupportAgentOutlinedIcon style={iconStyle} />, text: "?????? ??????", path:"contact/center" },
              { icon: <DeviceUnknownOutlinedIcon style={iconStyle} />, text: "?????? ??????", path:"contact/app"},
            ]
          },
          {
            title: "?????? ??????",
            data: [
              { icon: <NewspaperOutlinedIcon style={iconStyle} />, text: "????????? ??????", path:"/home/multiculturalNews/main" },
              { icon: <SupportAgentOutlinedIcon style={iconStyle} />, text: "?????????", path:"/info/faq" },
              { icon: <DocumentScannerOutlinedIcon style={iconStyle} />, text: "?????????????????????", path:"/info/service" },
              { icon: <ContactPageOutlinedIcon style={iconStyle} />, text: "????????????????????????", path:"/info/private"},
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
                    <h1>???????????????, {userData.displayName} ???</h1>
                    <p>{user.email ? user.email : "???????????? ??????????????????."}</p>
                  </div>
                  <ArrowForwardIosRoundedIcon />
                </div>
                :
                <div className={styles.login_container}>
                  <p>??? ?????? ????????? ???????????? ????????? ?????? ????????? ??? ?????????.</p>
                  {/* <p>{text.please_log_in_for_more_information_and_participation_in_the_program}</p> */}
                  <Button variant="outlined" style={{width:"90%", color:"white", border: "1px solid white"}} onClick={onLoginClick}>?????????</Button>
                </div>
              }
          </div>
          <MenuItemsContainer items={menuItems}  />
          
        </motion.div>
      }
    </AnimatePresence>
  )
}

export default Menu