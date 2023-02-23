import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import styles from "../styles/anouncement.module.css"

import { firestore as db } from "firebase/firebase"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import "swiper/css/pagination";
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { useIntl } from "react-intl";
import MiniThumbnail from "src/public/components/MiniThumbnail"
import { CircularProgress } from "@mui/material";



const Anouncement = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [anouncementList, setAnouncementList] = useState([])
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState(0)
  const [sections, setSections] = useState([])
  const [isAnouncementLoading, setIsAnouncementLoading] = useState(true)
  // const intl = useIntl()

  useEffect(()=>{
    const fetchData = async () => {
      // let temp = []
      const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc("anouncement").get()
      if(doc.exists){
        setSections([...doc.data().data])
        fetchAnouncementData(doc.data().data[0].id)
      }else
        setIsAnouncementLoading(false)

      setIsLoading(false)
    }
    fetchData()
  },[])

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    fetchAnouncementData(sections[newValue].id)
  };

  const fetchAnouncementData = async (id) => {
    setIsAnouncementLoading(true)
    const query = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("anouncements").where("condition","==","confirm").where("sectionsId","array-contains", id).orderBy("publishStartDate", "desc").limit(9).get()
    query.docs.forEach((doc) => {
      console.log(doc.id)
    })
    const temp = query.docs.map((doc)=> {return{...doc.data(), id: doc.id}})
    console.log(temp)
    setAnouncementList([...temp])

    // db.collection("team").doc("suwon").collection("anouncements").where("sectionsId","array-contains", id).get().then((query)=>{
    //   query.forEach((doc)=>{
    //     console.log(doc.id)
    //   })
    // })
 
    setIsAnouncementLoading(false)
  }

  const onMoreClick = () => {
    router.push(`/home/anouncement/1`)
  }

  if(isLoading)
    return (<>
    </>)
  

  return (
    <div className={styles.main_container}>
      <div className={styles.title}><h3>공지사항</h3><p onClick={onMoreClick}>{`더보기 >`}</p></div>
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
          {isAnouncementLoading &&
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </div>
          }

          {!isAnouncementLoading && anouncementList.length === 0 && 
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>아직 등록된 프로그램이 없습니다.</p>
            </div>
          }

          {anouncementList.length !== 0 && 
            <SwiperSlide className={styles.swiper_slide}>
              {anouncementList[0] && <div><MiniThumbnail data={anouncementList[0]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[0].id}`} /></div>}
              {anouncementList[1] && <div><MiniThumbnail data={anouncementList[1]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[1].id}`} /></div>}
              {anouncementList[2] && <div><MiniThumbnail data={anouncementList[2]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[2].id}`} /></div>}
            </SwiperSlide>
          }
          {anouncementList.length !== 0 && anouncementList.length>3 &&
            <SwiperSlide className={styles.swiper_slide}>
              {anouncementList[3] && <div><MiniThumbnail data={anouncementList[3]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[3].id}`} /></div>}
              {anouncementList[4] && <div><MiniThumbnail data={anouncementList[4]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[4].id}`} /></div>}
              {anouncementList[5] && <div><MiniThumbnail data={anouncementList[5]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[5].id}`} /></div>}
            </SwiperSlide>
          }
          {anouncementList.length !== 0 && anouncementList.length>6 &&
            <SwiperSlide className={styles.swiper_slide}>
              {anouncementList[6] && <div><MiniThumbnail data={anouncementList[6]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[6].id}`} /></div>}
              {anouncementList[7] && <div><MiniThumbnail data={anouncementList[7]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[7].id}`} /></div>}
              {anouncementList[8] && <div><MiniThumbnail data={anouncementList[8]} path={`/anouncement/${localStorage.getItem("selectedTeamId")}/${anouncementList[8].id}`} /></div>}
            </SwiperSlide>
          }

        </Swiper>
      </div>
    </div>
  )
}

export default Anouncement