import { auth } from "firebase/firebase"
import { useRouter } from "next/router"
import useData from "context/data"
import useUserData from "context/userData"
import { useEffect, useState, useContext } from "react"

import TopNavbar from "src/index/TopNavbar"
import Header from "src/index/header/Header"
import Program from "src/index/contents/Program"
import Anouncement from "src/index/contents/Anouncement"
import Survey from "src/index/contents/Survey"
import News from "src/index/news/News"
import Menu from "src/public/components/header/Menu"

import { firestore as db } from "firebase/firebase"


const Index = () => {
  const router = useRouter()
  const {user, userData, centerList} = useUserData()


  const [isHide, setIsHide] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleIsMenuOpen = (bool) => {
    setIsMenuOpen(bool)
  }

  //**스크롤 위치 확인 */
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
  
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //**스크롤 위치 확인 끝 */

  useEffect(()=>{
    if(user){
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
  },[user])


  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }

  // if(!userData) return(<>fetchinguserData</>)
  // if(userData)
  return(
    <>
      {!isMenuOpen && <TopNavbar scrollY={scrollY} onMenuClick={onMenuClick} teamName={userData?.selectedTeamName}/>}

      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 
      
      {!isHide && 
        <>
          <Header />
          
          <Program />

          <Anouncement />

          <News />

          <Survey />
        </>
      }
    </>
  )
}

export default Index