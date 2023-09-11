import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { DB } from "./dataDB";
import FullScreenLoader from "src/public/components/FullScreenLoader";
import useUserData from "./userData";
import { useRouter } from "next/router";
const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
  const {user, userData} = useUserData()
  const [isLoading, setIsLoading] = useState(true)
  // const [user, setUser] = useState(null) 
  // const [userData, setUserData] = useState(null) 

  const [centerList, setCenterList] = useState()
  const [centerProfileSettingsList, setCenterProfileSettingsList] = useState({})

  const [programList, setProgramList] = useState([])
  const [surveyList, setSurveyList] = useState([])
  const [anouncementList, setAnouncementList]= useState([])

  const [section, setSection] = useState()

  const [unread, setUnread] = useState(0)

  const [mySchedule, setMySchedule] = useState()
  const [teamSchedule, setTeamSchedule] = useState()

  //** 아래부터 card 데이터 */
  const [locationList, setLocationList] = useState()
  const [benefitList, setBenefitList] = useState()


  //** card 데이터 끝 */



  //아직 미설정 기능
  const [language, setLanguage] = useState("ko")



  const router = useRouter()


  //프로그램 데이터 받기
  useEffect(()=>{
    const fetchData = async () => {
      console.log(userData && !(!userData.selectedTeamId))
      if((router.pathname.includes("/start/")&& !router.pathname.includes("/selectTeam")) || router.pathname.includes("/preview") || router.pathname.includes("/test/article") || router.pathname.includes("/test/programs") || router.pathname.includes("/test/surveys"))
        setIsLoading(false)
      else if(userData && !(!userData.selectedTeamId)){
        console.log("fetch")
        setIsLoading(true)
        const programList_temp = await DB.FETCH_DOCS_DATA("programs", userData.selectedTeamId)
        setProgramList(programList_temp)
        const surveyList_temp = await DB.FETCH_DOCS_DATA("surveys", userData.selectedTeamId)
        setSurveyList(surveyList_temp)
        const anouncementprogramList_temp = await DB.FETCH_DOCS_DATA("anouncements", userData.selectedTeamId)
        setAnouncementList(anouncementprogramList_temp)
        

        const programSectionList = await DB.FETCH_SECTION_DATA(userData.selectedTeamId, "program")
        const surveySectionList = await DB.FETCH_SECTION_DATA(userData.selectedTeamId, "survey")
        const anouncementSectionList = await DB.FETCH_SECTION_DATA(userData.selectedTeamId, "anouncement")
        setSection({program: programSectionList, survey: surveySectionList, anouncement: anouncementSectionList})
       
        setTimeout(()=>{
          setIsLoading(false)

        },100)
      } 
      else setIsLoading(false)


    }
    fetchData()
  },[userData])


  //메세지 컨트롤
  useEffect(() => {
    if(user){
      const dbRef = db.collection("user").doc(user.uid).collection("message").doc("status");

      const unsubscribe = dbRef.onSnapshot((doc) => {
        if (doc.exists) {
          setUnread(doc.data().unread);
        }
      });

      return() => {
        unsubscribe()
      }
      
    }
    },[user])

  const SET_CENTER_LIST = async () => {
    const list_temp = await DB.FETCH_CENTER_LIST()
    if(list_temp)
      setCenterList(list_temp)
    return list_temp
  }


  //**card 데이터 컨트롤 */
  const SET_LOCATION_LIST = async () => {
    const list_temp = await DB.FETCH_LOCATION_LIST()
    if(list_temp)
      setLocationList(list_temp)
  }

  const SET_BENEFIT_LIST = async (location) => {
    console.log(location)
    const query = await db.collection("benefit").where("location","==",location).where("isPublished","==",true).orderBy("savedAt", "desc").get()
    const list_temp = query.docs.map(doc => ({...doc.data(), id: doc.id}))
    setBenefitList({...benefitList, [location]: list_temp})
    return({...benefitList, [location]: list_temp})
  }

  const value = {
    unread, setUnread,
    centerList, setCenterList, SET_CENTER_LIST,
    programList, setProgramList,
    surveyList, setSurveyList,
    anouncementList, setAnouncementList,
    section, setSection,
    language, setLanguage,
    centerProfileSettingsList, setCenterProfileSettingsList,
    mySchedule, setMySchedule,
    teamSchedule, setTeamSchedule,
    locationList, setLocationList, SET_LOCATION_LIST,
    benefitList, setBenefitList, SET_BENEFIT_LIST,
  }
  
  if(isLoading) return <FullScreenLoader isLoading={isLoading}/>

  return <dataContext.Provider value={value} {...props} />
}