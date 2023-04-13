import { useEffect, useState } from "react";
import styles from "src/index/styles/index.module.css"
import useData from "context/data"
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


import Menu from "src/menu/components/Menu";
import MainSwiper from "src/index/components/MainSwiper"
import Program from "src/index/components/Program";

import { Dialog } from "@mui/material";
import { CircularProgress } from "@mui/material";
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import BasicSelect from "src/public/mui/BasicSelect";
import Survey from "src/index/components/Survey"
import News from "src/index/components/News"
import Anouncement from "src/index/components/Anouncement"
const Home = () => {
  const {user, userData} = useData()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isHide, setIsHide] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState({id:"suwon", name:"수원시"})
  const [openCityDialog, setOpenCityDialog] = useState(false)
  const [teams, setTeams] = useState([])
  const [isTeamsLoading, setIsTeamsLoading] = useState(true)
  const [scrollYIsZero, setScrollYIsZero] = useState(true)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)

  //handle scroll y
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(()=>{
    console.log(user)
    if(user===null)
      router.push("/walkthrough")
    else if(!userData || !userData.realName || !userData.displayName||!userData.gender||!userData.phoneNumber||userData.phoneVerified!==true||!localStorage.getItem("selectedTeamId")){
      router.push("/walkthrough")
    }
    if(user!==null){
      setIsLoading(false)
      db.collection("user").doc(user.uid).get().then((doc)=>{
        if(doc.exists){
            console.log(window.ReactNativeWebView)
            if(window.ReactNativeWebView){
              console.log("asdf")
              window.ReactNativeWebView.postMessage(`UID_DATA: ${user.uid}|||${doc.data().pushToken}`)
            }
          // }
        }
      })
    }
    
    setSelectedTeam({id:localStorage.getItem("selectedTeamId"), name: localStorage.getItem("selectedTeamName")})

  },[user])

  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }
  const onCityClick =async () => {
    setOpenCityDialog(true)
    if(teams.length===0){
      let temp = []
      const query = await db.collection("team").get()
      query.docs.forEach((doc) => {
        temp.push({name: doc.data().teamName, id: doc.id})
      })
      setTeams([...temp])
      // setTeams([{name: "수원시다문화센터", id: "suwon"},{name: "안산시",id:"ansan"}])
      console.log(temp)
      setIsTeamsLoading(false)
    }else
      setIsTeamsLoading(false)
  }
  
  const onTeamClick= (id,name) => {
    setSelectedTeam({id: id, name: name})
    localStorage.setItem("selectedTeamId", id)
    localStorage.setItem("selectedTeamName", name)
    setOpenCityDialog(false)
  }

  if(!isLoading)
  return(
    <>
    {!isMenuOpen &&
    <> 
        <div className={scrollY === 0 ? styles.header_container : `${styles.header_container} ${styles.add_background}`}>
          <div className={styles.logo_container} onClick={onCityClick}>
            <h1>더한다+</h1>
            <h2>{selectedTeam.name}</h2>
            {openCityDialog ? <ArrowDropUpIcon />:<ArrowDropDownIcon />}
          </div>
          <div>
            <NotificationsNoneIcon />
            <MenuRoundedIcon className={styles.menu_icon} onClick={onMenuClick} />
          </div>
        </div>
        </>
      }
      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 
      {!isHide &&
        <>
          <MainSwiper />
          <Program />
          <div className={styles.border} />
          <Anouncement />
          <div className={styles.border} />
          <News />
          <div className={styles.border} />
          <Survey />
          <div className={styles.border} />
          <div style={{height:"60px"}}></div>
        </>
      }

      <Dialog open={openCityDialog} onClose={()=>setOpenCityDialog(false)}>
        <div className={styles.city_dialog_container}>
          {isTeamsLoading ? 
            <div className={styles.center}>
              <CircularProgress />
            </div>
            :
            <>
              <h1><MapsHomeWorkOutlinedIcon style={{marginRight:"7px"}}/>센터를 선택해주세요.</h1>
              <div className={styles.item_container}>
                {console.log(teams)}
                {teams.map((team, index) => {
                  return(
                    <div key={index} className={selectedTeam.id===team.id ? `${styles.item} ${styles.selected}` : styles.item} onClick={()=>onTeamClick(team.id, team.name)}>
                      {team.name}
                    </div>
                  )
                })}
              </div>
            </>
          }
        </div>
      </Dialog>

    </>
  )
}

export default Home