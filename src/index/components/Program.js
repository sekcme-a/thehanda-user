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



const Program = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [programList, setProgramList] = useState([])
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState(0)
  const [sections, setSections] = useState([])
  const [isProgramLoading, setIsProgramLoading] = useState(true)
  // const intl = useIntl()

  useEffect(()=>{
    const fetchData = async () => {
      // let temp = []
      const doc = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("section").doc("program").get()
      if(doc.exists){
        setSections([...doc.data().data])
        fetchProgramData(doc.data().data[0].id)
      }else
        setIsProgramLoading(false)
        
      setIsLoading(false)
    }
    fetchData()
  },[])

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    fetchProgramData(sections[newValue].id)
  };

  const fetchProgramData = async (id) => {
    const query = await db.collection("team").doc(localStorage.getItem("selectedTeamId")).collection("programs").where("condition","==","confirm").where("sectionsId","array-contains", id).orderBy("publishStartDate", "desc").limit(9).get()
    const temp = query.docs.map((doc)=> {return{...doc.data(), id: doc.id}})
    setProgramList([...temp])
 
    setIsProgramLoading(false)
  }

  const onMoreClick = () => {
    router.push(`/home/program/1`)
  }

  if(isLoading)
    return (<>
    </>)
  

  return (
    <div className={styles.main_container}>
      <div className={styles.title}><h3>프로그램</h3><p onClick={onMoreClick}>{`더보기 >`}</p></div>
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
          {isProgramLoading &&
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress />
            </div>
          }

          {!isProgramLoading && programList.length === 0 && 
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>아직 등록된 프로그램이 없습니다.</p>
            </div>
          }

          {programList.length !== 0 && 
            <SwiperSlide className={styles.swiper_slide}>
              {programList[0] && <div><Thumbnail data={programList[0]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[0].id}`} /></div>}
              {programList[1] && <div><Thumbnail data={programList[1]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[1].id}`} /></div>}
              {programList[2] && <div><Thumbnail data={programList[2]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[2].id}`} /></div>}
            </SwiperSlide>
          }
          {programList.length !== 0 && programList.length>3 &&
            <SwiperSlide className={styles.swiper_slide}>
              {programList[3] && <div><Thumbnail data={programList[3]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[3].id}`} /></div>}
              {programList[4] && <div><Thumbnail data={programList[4]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[4].id}`} /></div>}
              {programList[5] && <div><Thumbnail data={programList[5]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[5].id}`} /></div>}
            </SwiperSlide>
          }
          {programList.length !== 0 && programList.length>6 &&
            <SwiperSlide className={styles.swiper_slide}>
              {programList[6] && <div><Thumbnail data={programList[6]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[6].id}`} /></div>}
              {programList[7] && <div><Thumbnail data={programList[7]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[7].id}`} /></div>}
              {programList[8] && <div><Thumbnail data={programList[8]} path={`/article/${localStorage.getItem("selectedTeamId")}/${programList[8].id}`} /></div>}
            </SwiperSlide>
          }

        </Swiper>
      </div>
    </div>
  )
}

export default Program