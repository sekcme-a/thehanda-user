import { useEffect, useState } from "react"
// import styles from "styles/components/myPage/myPageProfile.module.css"
import { useRouter } from "next/router"
import styles from "src/home/styles/index.module.css"

import useData from "context/data"
import { firestore as db } from "firebase/firebase"

import HomeHeader from "src/home/components/HomeHeader"
import GroupsHeader from "src/home/components/GroupsHeader"


import Thumbnail from "src/public/components/Thumbnail"
import MiniThumbnail from "src/public/components/MiniThumbnail"
import Menu from "src/menu/components/Menu"

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Dialog } from "@mui/material";
import { CircularProgress } from "@mui/material";
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';

const MyPageProfile = () => {
  const router = useRouter()
  const { type, id } = router.query
  const { sectionData, setSectionData } = useData()
  const [selectedItem, setSelectedItem] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [programList, setProgramList] = useState([])
  const [groups, setGroups] = useState([])
  const [openCityDialog, setOpenCityDialog] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [teams, setTeams] = useState([])
  const [isTeamsLoading, setIsTeamsLoading] = useState(true)
  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)
  const [selectedTeam, setSelectedTeam] = useState({id:"suwon", name:"수원시"})

  const [isHide, setIsHide] = useState(false)

  const handleChange = async (event, newValue) => {
    setSelectedItem(newValue); 
    // const city = localStorage.getItem("city")
    // router.push(`/home`)
    if(newValue===0)
      router.push(`/home/program/0`)
    else if(newValue===1)
      router.push(`/home/survey/0`)
    else if(newValue===2)
      router.push(`/home/anouncement/0`)
    else if(newValue===3)
      router.push(`/home/multiculturalNews/main`)
    setSelectedGroup(0)
  };

  const handleGroupChange = async(event, newValue) => {
    setSelectedGroup(newValue)
    fetchContent(event.target.id)
  }

  useEffect(() => {
    setIsLoading(true)
    if(type==="program")
      setSelectedItem(0)
    else if(type==="survey")
      setSelectedItem(1)
    else if (type==="anouncement")
      setSelectedItem(2)
    else
      setSelectedItem(3)

    
    if(localStorage.getItem("selectedTeamId")===null){
      localStorage.setItem("selectedTeamId", "suwon")
      localStorage.setItem("selectedTeamName", "수원시")
    }
    setSelectedTeam({id:localStorage.getItem("selectedTeamId"), name: localStorage.getItem("selectedTeamName")})
    const fetchData = async() => {
      const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc(type).get()
      if(doc.exists){
        setGroups(doc.data().data)
        let selectedIndex = 0
        doc.data().data.map((item, index)=>{
          if(item.id === id)
            selectedIndex = index
        })
        console.log(selectedIndex)
        setSelectedGroup(selectedIndex)
        fetchContent(doc.data().data[selectedIndex].id)
      }
      else
        setGroups([])
      setIsLoading(false)
    }
    fetchData()
  },[type])

  const fetchContent = async (id) => {
    setIsLoading(true)
    if(type!=="anouncement"){
      const query = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection(`${type}s`).where("condition","==","confirm").where("sectionsId","array-contains", id).orderBy("publishStartDate", "desc").limit(60).get()
      const temp = query.docs.map((doc)=>{
        return({data: doc.data(), id: doc.id})
      })
      setProgramList([...temp])
      setIsLoading(false)
    }else{
      const query = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection(`${type}s`).where("condition", "==", "confirm").where("sectionsId","array-contains", id).get()
      const temp = query.docs.map((doc) => {
        return({data: doc.data(), id: doc.id})
      })
      setProgramList([...temp])
      setIsLoading(false)
    }
    
  }

  useEffect(() =>{
    console.log(programList)
  },[programList])

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

  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }

  const onTeamClick= (id,name) => {
    setSelectedTeam({id: id, name: name})
    localStorage.setItem("selectedTeamId", id)
    localStorage.setItem("selectedTeamName", name)
    setOpenCityDialog(false)
  }

  return (
    <>
      <div style={{width:"100%", position: "fixed", top:0, left: 0, zIndex:"99999999", backgroundColor:"white"}}>
        <div className={`${styles.header_container} ${styles.add_background}`}>
          <div className={styles.logo_container} onClick={onCityClick}>
            <h1>더한다+</h1>
            <h2>{localStorage.getItem("selectedTeamName")}</h2>
            {openCityDialog ? <ArrowDropUpIcon />:<ArrowDropDownIcon />}
          </div>
          <div>
            <NotificationsNoneIcon />
            <MenuRoundedIcon className={styles.menu_icon} onClick={onMenuClick}  />
          </div>
        </div>
        <HomeHeader selectedItem={selectedItem} handleChange={handleChange} />
        {groups.length!==0 && <GroupsHeader selectedItem={selectedGroup} handleChange={handleGroupChange} groups={groups} />}
      </div>
      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 
      <div style={{ display: "flex", flexWrap: "wrap", marginTop:"165px", width:"100%" }}>
        {isLoading && <CircularProgress />}
        {!isLoading && programList.length === 0 &&
          <div style={{width:"100%", height: "350px", display: "flex", justifyContent:"center", alignItems:"center"}}>
            아직 게시물이 없습니다.
          </div>
        }
        {
          !isLoading && programList.map((item, index) => {
            return(
              <div key={index} style={{width:"100%"}}>
                {type === "anouncement" ?
                  <MiniThumbnail data={item.data} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${item.id}`}/>
                  :
                  <Thumbnail data={item.data} smallMargin={true} path={`/article/${localStorage.getItem("selectedTeamId")}/${item.id}`}/>
                }
              </div>
            )
          })
        }
        <div style={{width:"100%", height:"85px"}} />
      </div>
      

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

export default MyPageProfile