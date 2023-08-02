import { useEffect, useState } from "react"
// import styles from "styles/components/myPage/myPageProfile.module.css"
import { useRouter } from "next/router"
import styles from "src/home/styles/index.module.css"

import useData from "context/data"
import useUserData from "context/userData"
import { firestore as db } from "firebase/firebase"

import HomeHeader from "src/home/components/HomeHeader"
import GroupsHeader from "src/home/components/GroupsHeader"
import TopNavbar from "src/index/TopNavbar"
import Menu from "src/public/components/header/Menu"


import Thumbnail from "src/public/components/Thumbnail"
import MiniThumbnail from "src/public/components/MiniThumbnail"

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
  const {userData} = useUserData()
  const {section, programList, surveyList, anouncementList} = useData()

  const [docList, setDocList] = useState([])

  const [selectedType, setSelectedType] = useState(0)
  const [selectedSection, setSelectedSection] = useState(0)
  const [sections, setSections] = useState([])

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)
  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }

  const [isHide, setIsHide] = useState(false)

  const handleChange = async (event, newValue) => {
    setSelectedType(newValue); 
    if(newValue===0)
      router.push(`/home/program/0`)
    else if(newValue===1)
      router.push(`/home/survey/0`)
    else if(newValue===2)
      router.push(`/home/anouncement/0`)
    else if(newValue===3)
      router.push(`/home/multiculturalNews/main`)
    setSelectedSection(0)
  };

  const handleSectionChange = async(event, newValue) => {
    setSelectedSection(newValue)
    sort_content(type, event.target.id)
  }

  useEffect(() => {
    if(type==="program")
      setSelectedType(0)
    else if(type==="survey")
      setSelectedType(1)
    else if (type==="anouncement")
      setSelectedType(2)
    else
      setSelectedType(3)

    const fetchData = async() => {
      setSections(section[type])
      let selectedIndex = 0
      section[type]?.map((item, index)=>{
        if(item.id === id)
          selectedIndex = index
      })
      setSelectedSection(selectedIndex)
      console.log(selectedIndex)
      sort_content(type, section[type][selectedIndex].id)
    }
    console.log(section[type])
    if(section[type])
      fetchData()
    else
      setSections([])
  },[type])

  const sort_content = (type, id) => {
    if(type==="program")
      setDocList(programList.filter(doc => doc.sectionsId.includes(id)))
    if(type==="survey")
      setDocList(surveyList.filter(doc => doc.sectionsId.includes(id)))
    if(type==="anouncement")
      setDocList(anouncementList.filter(doc => doc.sectionsId.includes(id)))
  }



  return (
    <>
      {!isMenuOpen && <TopNavbar scrollY={1} onMenuClick={onMenuClick} teamName={userData.selectedTeamName}/>}

      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 

      <div style={{width:"100%", position: "fixed", top:"45px", left: 0, zIndex:"10", backgroundColor:"white"}}>
        <HomeHeader selectedItem={selectedType} handleChange={handleChange} />
        {sections?.length!==0 && <GroupsHeader selectedItem={selectedSection} handleChange={handleSectionChange} groups={sections} />}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop:"165px", width:"100%" }}>
        {docList.length === 0 ?

          <div style={{width:"100%", height: "350px", display: "flex", justifyContent:"center", alignItems:"center"}}>
            아직 게시물이 없습니다.
          </div>

          :

          docList.map((item, index) => {
            return(
              <div key={index} style={{width:"100%"}}>
                {type === "anouncement" ?
                  <MiniThumbnail data={item} path={`/anouncement/${userData.selectedTeamId}/${item.id}`}/>
                  :
                  <Thumbnail data={item} smallMargin={true} path={`/article/${userData.selectedTeamId}/${item.id}`}/>
                }
              </div>
            )
          })

        }
        <div style={{width:"100%", height:"85px"}} />
      </div>
    </>
  )

}

export default MyPageProfile