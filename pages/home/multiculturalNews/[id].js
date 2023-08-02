
import HomeHeader from "src/home/components/HomeHeader"
import GroupsHeader from "src/home/components/GroupsHeader";

import { useEffect, useState } from "react"
// import styles from "styles/components/myPage/myPageProfile.module.css"
import { useRouter } from "next/router"

import useData from "context/data"
import useUserData from "context/userData";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { firestore as db } from "firebase/firebase";


import MainNews from "src/news/components/MainNews"
import PostList from "src/news/components/PostList"
import NewsHeader from "src/news/components/NewsHeader"
import styles from "src/home/styles/index.module.css"
import Menu from "src/public/components/header/Menu"

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Dialog } from "@mui/material";
import { CircularProgress } from "@mui/material";
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import PageHeader from "src/public/components/PageHeader";

import TopNavbar from "src/index/TopNavbar";

const Home = () => {
  const router = useRouter()
  const { id } = router.query
  const { user, userData } = useUserData()
  const [selectedItem, setSelectedItem] = useState(0)
  const [selectedGroup, setSelectedGroup] = useState(0)
  const [selectedNews, setSelectedNews] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [programList, setProgramList] = useState([])
  const [newsMenu, setNewsMenu] = useState([])
  const [address, setAddress] = useState()
  const [groups, setGroups] = useState([])
  const [openCityDialog, setOpenCityDialog] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [teams, setTeams] = useState([])
  const [isTeamsLoading, setIsTeamsLoading] = useState(true)
  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)
  const [selectedTeam, setSelectedTeam] = useState({id:"suwon", name:"수원시"})
  const [isHide, setIsHide] = useState(false)

  const menu = [
    {id: 0, name:"메인"},
    {id: 1, name:"지역별"},
    {id: 2, name:"언어별"},
    {id: 3, name:"사회"},
    {id: 4, name:"문화"},
    {id: 5, name:"기획"},
  ]

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    // router.push(`/home`)
    if(newValue===0)
      router.push(`/home/program/0`)
    else if(newValue===1)
      router.push(`/home/survey/0`)
    else if(newValue===2)
      router.push(`/home/anouncement/0`)
    else if(newValue===3)
      router.push("/home/multiculturalNews/main")
  };

  useEffect(() => {
    setSelectedItem(3)
  },[])

  // useEffect(() => {
  //   if (selectedGroup === 0) {
  //     setNewsMenu([])
  //     setAddress("https://www.kmcn.kr/news/article_list_all.html")
  //   }
  //   else if (selectedGroup === 1) {
  //     setNewsMenu([
  //       { id: 25, name: "경기도" },
  //       { id: 26, name: "충청도" },
  //       { id: 27, name: "강원도" },
  //       { id: 28, name: "경상도" },
  //       { id: 30, name: "제주도" },
  //       { id: 87, name: "특별/광역시" },
  //     ])
  //     setSelectedNews(0)
  //     setAddress("https://www.kmcn.kr/news/section_list_all.html?sec_no=25")
  //   }
  //   else if (selectedGroup === 2) {
  //     setNewsMenu([
  //       { id: 35, name: "한국어" },
  //       { id: 36, name: "영어" },
  //       { id: 37, name: "중국어" },
  //       { id: 38, name: "일본어" },
  //       { id: 39, name: "베트남어" },
  //       { id: 40, name: "태국어" },
  //       { id: 41, name: "타갈로그어" },
  //     ])
  //     setSelectedNews(0)
  //     setAddress("https://www.kmcn.kr/news/section_list_all.html?sec_no=35")
  //   }
  // }, [selectedGroup])

  useEffect(() => {
    if (id === "main") {
      setAddress("https://www.kmcn.kr/news/article_list_all.html")
      setNewsMenu([])
      return
    }
    else {
      const ID = parseInt(id)
      if ((ID > 24 && ID < 31) || ID === 87) {
        setSelectedGroup(1)
        setNewsMenu([
          { id: 25, name: "경기도" },
          { id: 26, name: "충청도" },
          { id: 27, name: "강원도" },
          { id: 28, name: "경상도" },
          { id: 30, name: "제주도" },
          { id: 87, name: "특별/광역시" },
        ])
      }
      else if (ID > 34 && ID < 42) {
        setSelectedGroup(2)
        setNewsMenu([
        { id: 35, name: "한국어" },
        { id: 36, name: "영어" },
        { id: 37, name: "중국어" },
        { id: 38, name: "일본어" },
        { id: 39, name: "베트남어" },
        { id: 40, name: "태국어" },
        { id: 41, name: "타갈로그어" },
        ])
      }
      else if (ID > 41 && ID < 45) {
        setSelectedGroup(3)
        setNewsMenu([
        { id: 42, name: "경제" },
        { id: 43, name: "정치" },
        { id: 44, name: "교육" },
        ])
      }
      else if (ID=== 45 || ID===47 || ID===84) {
        setSelectedGroup(4)
        setNewsMenu([
        { id: 45, name: "생활" },
        { id: 47, name: "연예" },
        { id: 84, name: "스포츠" },
        ])
      }
      else if (ID>47 && ID<52) {
        setSelectedGroup(5)
        setNewsMenu([
        { id: 48, name: "칼럼" },
        { id: 50, name: "인터뷰" },
        { id: 49, name: "오피니언" },
        { id: 51, name: "우리지역명소" },
        ])
      }
        
        
      if (ID === 25) setSelectedNews(0)
      else if (ID === 26) setSelectedNews(1)
      else if (ID === 27) setSelectedNews(2)
      else if (ID === 28) setSelectedNews(3)
      else if (ID === 30) setSelectedNews(4)
      else if (ID === 87) setSelectedNews(5)
      else if (ID === 35) setSelectedNews(0)
      else if (ID === 36) setSelectedNews(1)
      else if (ID === 37) setSelectedNews(2)
      else if (ID === 38) setSelectedNews(3)
      else if (ID === 39) setSelectedNews(4)
      else if (ID === 40) setSelectedNews(5)
      else if (ID === 41) setSelectedNews(6)
      else if (ID === 42) setSelectedNews(0)
      else if (ID === 43) setSelectedNews(1)
      else if (ID === 44) setSelectedNews(2)
      else if (ID === 45) setSelectedNews(0)
      else if (ID === 47) setSelectedNews(1)
      else if (ID === 84) setSelectedNews(2)
      else if (ID === 48) setSelectedNews(0)
      else if (ID === 50) setSelectedNews(1)
      else if (ID === 49) setSelectedNews(2)
      else if (ID === 51) setSelectedNews(3)
    }
    setAddress(`https://www.kmcn.kr/news/section_list_all.html?sec_no=${id}`)
  },[id])


  const handleGroupChange = (event, newValue) => {
    console.log(newValue)
    setSelectedGroup(newValue)
    if(newValue===0)
      router.push(`/home/multiculturalNews/main`)
    else if(newValue===1)
      router.push(`/home/multiculturalNews/25`)
    else if(newValue===2)
      router.push(`/home/multiculturalNews/35`)
    else if(newValue===3)
      router.push(`/home/multiculturalNews/42`)
    else if(newValue===4)
      router.push(`/home/multiculturalNews/45`)
    else if(newValue===5)
      router.push(`/home/multiculturalNews/48`)
  }

  const handleNewsChange = (event, newValue) => {
    console.log(newValue)
    setSelectedNews(newValue)
    router.push(`/home/multiculturalNews/${event.target.id}`)
      // setAddress(`https://www.kmcn.kr/news/section_list_all.html?sec_no=${event.target.id}`)
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

  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }
  // if(isLoading || text===undefined)
  //   return (<>
  //   </>)
  

  return (
    <>
      {!isMenuOpen && <TopNavbar scrollY={1} onMenuClick={onMenuClick} teamName={userData.selectedTeamName}/>}

      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 

      <div style={{width:"100%", position: "fixed", top:"45px", left: 0, zIndex:"10", backgroundColor:"white"}}>
        <HomeHeader selectedItem={3} handleChange={handleChange} />
        <GroupsHeader selectedItem={selectedGroup} handleChange={handleGroupChange} groups={menu} />
        {newsMenu.length !== 0 && <NewsHeader selectedItem={selectedNews} handleChange={handleNewsChange} groups={newsMenu} />}
      </div>
      {/* <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} />  */}
      {/* <NewsHeader /> */}
      <div style={{padding:"0 10px"}}>
        {newsMenu.length === 0 && <MainNews />}
        {newsMenu.length === 0 && <h2 style={{ fontWeight: "bold", margin: "40px 0 -13px 25px", fontSize: "20px" }}>실시간 뉴스</h2>}
        {newsMenu.length !== 0 && <div style={{ height: "180px", width: "100%" }} />}
        {address && <PostList id={address} addMargin={false} />}
      </div>
    </>
  )
}

export default Home;