import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import styles from "./Survey.module.css"

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

import useData from "context/data";
import useUserData from "context/userData";



const Program = () => {
  // const {}
  const router = useRouter()
  const [selectedItem, setSelectedItem] = useState(0)
  const {section, surveyList} = useData()
  const {userData} = useUserData()
  const [list, setList] = useState([])
  // const intl = useIntl()

  useEffect(() => {
    handleChange("event",0)  //event는 그냥 넣은 값
  },[])

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    fetch_survey_data(newValue)
  };

  const fetch_survey_data = (sectionIndex) => {
    if(!section?.survey)
      setList([])
    else {
      const selectedSectionId = section.survey[sectionIndex].id
      setList(surveyList.filter(survey => survey.sectionsId.includes(selectedSectionId)))
    }
  }

  const onMoreClick = () => {
    router.push(`/home/survey/1`)
  }
  

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
          section?.survey?.map((item, index) => {
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
          {list.length === 0 && 
            <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p>아직 등록된 설문조사가 없습니다.</p>
            </div>
          }

          {list.length !== 0 && 
            <SwiperSlide className={styles.swiper_slide}>
              {list[0] && <div><Thumbnail data={list[0]} path={`/article/${userData.selectedTeamId}/${list[0].id}`} /></div>}
              {list[1] && <div><Thumbnail data={list[1]} path={`/article/${userData.selectedTeamId}/${list[1].id}`} /></div>}
              {list[2] && <div><Thumbnail data={list[2]} path={`/article/${userData.selectedTeamId}/${list[2].id}`} /></div>}
            </SwiperSlide>
          }
          {list.length !== 0 && list.length>3 &&
            <SwiperSlide className={styles.swiper_slide}>
              {list[3] && <div><Thumbnail data={list[3]} path={`/article/${userData.selectedTeamId}/${list[3].id}`} /></div>}
              {list[4] && <div><Thumbnail data={list[4]} path={`/article/${userData.selectedTeamId}/${list[4].id}`} /></div>}
              {list[5] && <div><Thumbnail data={list[5]} path={`/article/${userData.selectedTeamId}/${list[5].id}`} /></div>}
            </SwiperSlide>
          }
          {list.length !== 0 && list.length>6 &&
            <SwiperSlide className={styles.swiper_slide}>
              {list[6] && <div><Thumbnail data={list[6]} path={`/article/${userData.selectedTeamId}/${list[6].id}`} /></div>}
              {list[7] && <div><Thumbnail data={list[7]} path={`/article/${userData.selectedTeamId}/${list[7].id}`} /></div>}
              {list[8] && <div><Thumbnail data={list[8]} path={`/article/${userData.selectedTeamId}/${list[8].id}`} /></div>}
            </SwiperSlide>
          }

        </Swiper>
      </div>
    </div>
  )
}

export default Program