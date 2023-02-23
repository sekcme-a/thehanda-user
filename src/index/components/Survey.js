import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import styles from "../styles/program.module.css"

import { firestore as db } from "firebase/firebase"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import "swiper/css/pagination";
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { useIntl } from "react-intl";
import Thumbnail from "src/public/components/Thumbnail"
import { CircularProgress } from "@mui/material";



const Survey = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [surveyList, setSurveyList] = useState([])
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState(0)
  const [sections, setSections] = useState([])
  const [isSurveyLoading, setIsSurveyLoading] = useState(true)
  // const intl = useIntl()

  useEffect(()=>{
    const fetchData = async () => {
      // let temp = []
      const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc("survey").get()
      if(doc.exists){
        setSections([...doc.data().data])
        fetchSurveyData(doc.data().data[0].id)
      }else
        setIsSurveyLoading(false)
      setIsLoading(false)
    }
    fetchData()
  },[])

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    fetchSurveyData(sections[newValue].id)
  };

  const fetchSurveyData = async (id) => {
    const query = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("surveys").where("condition","==","confirm").where("sectionsId","array-contains", id).orderBy("publishStartDate", "desc").limit(9).get()
    const temp = query.docs.map((doc)=> {return{...doc.data(), id: doc.id}})
    setSurveyList([...temp])

    setIsSurveyLoading(false)
  }

  const onMoreClick = () => {
    router.push(`/home/survey/1`)
  }

  if(isLoading)
    return (<>
    </>)
  

  return (
    <div className={styles.main_container}>
      <div className={styles.title}><h3>설문조사</h3><p onClick={onMoreClick}>{`더보기 >`}</p></div>
      <Tabs
        value={selectedItem}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        textColor='secondary'
        indicatorColor='secondary'
        style={{borderBottom:"2px solid rgb(248,248,248)"}}
      >
        {/* <Tab label={text?.all} style={{ margin: "0 10px" }} /> */}
        
        {
          sections.map((item, index) => {
            return (
              <Tab key={index} label={item.name} style={{ margin: "0 10px", fontSize:"17px" }} />
            )
          })
        }

      </Tabs>
      <div className={styles.swiper_container} >
        <Swiper
          grabCursor={true}
          modules={[Pagination]}
          className={styles.swiper}
        >
          {isSurveyLoading &&
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </div>
          }

          {!isSurveyLoading && surveyList.length === 0 && 
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>아직 등록된 프로그램이 없습니다.</p>
            </div>
          }

          {surveyList.length !== 0 && 
            <SwiperSlide className={styles.swiper_slide}>
              {surveyList[0] && <div><Thumbnail data={surveyList[0]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[0].id}`} /></div>}
              {surveyList[1] && <div><Thumbnail data={surveyList[1]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[1].id}`} /></div>}
              {surveyList[2] && <div><Thumbnail data={surveyList[2]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[2].id}`} /></div>}
            </SwiperSlide>
          }
          {surveyList.length !== 0 && surveyList.length>3 &&
            <SwiperSlide className={styles.swiper_slide}>
              {surveyList[3] && <div><Thumbnail data={surveyList[3]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[3].id}`} /></div>}
              {surveyList[4] && <div><Thumbnail data={surveyList[4]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[4].id}`} /></div>}
              {surveyList[5] && <div><Thumbnail data={surveyList[5]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[5].id}`} /></div>}
            </SwiperSlide>
          }
          {surveyList.length !== 0 && surveyList.length>6 &&
            <SwiperSlide className={styles.swiper_slide}>
              {surveyList[6] && <div><Thumbnail data={surveyList[6]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[6].id}`} /></div>}
              {surveyList[7] && <div><Thumbnail data={surveyList[7]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[7].id}`} /></div>}
              {surveyList[8] && <div><Thumbnail data={surveyList[8]} path={`/article/${localStorage.getItem("selectedTeamId")}/${surveyList[8].id}`} /></div>}
            </SwiperSlide>
          }

        </Swiper>
      </div>
    </div>
  )
}

export default Survey