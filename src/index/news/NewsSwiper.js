import React, { useRef, useState , useEffect} from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import "./styles.css";

// import required modules
import  SwiperCore, { EffectFade, Navigation, Pagination, Autoplay } from "swiper";
import styles from "./NewsSwiper.module.css"
import { firestore as db } from "firebase/firebase"
import Link from "next/link";
import Image from "next/image";
import { sendRequest } from "pages/api/sendRequest"
import Skeleton from '@mui/material/Skeleton';

import { translate } from "src/public/hooks/translate"
import useData from "context/data";

export default function App() {
  const [list, setList] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const { language } = useData()
  SwiperCore.use([Autoplay])
  useEffect(() => {
    const fetchData = async () => {
      const idList = await sendRequest.fetchMainPostIdList("https://www.kmcn.kr/")
      console.log(idList)


      const translatedList = []
      for (const list of idList) {
        const category = await translate(list.category, "ko", language)
        const title = await translate(list.title, "ko", language)
        const subtitle = await translate(list.subtitle, "ko", language)
        translatedList.push({...list, category: category, title: title, subtitle: subtitle})
      }
      console.log(translatedList)

      setList(translatedList)
      setIsLoading(false)
    }
    fetchData()
  },[language])
  
  const onPostClick = () => {
    window.sessionStorage.setItem("page", 1)
    window.sessionStorage.setItem("data", null)
    window.sessionStorage.setItem("id", "home")
    window.sessionStorage.setItem("scrollPosition", 0)
  }

  if (isLoading)
    return (
      <div className={styles.swiper_slide_skeleton}>
        <div className={styles.swiper_container}>
          {/* <Skeleton animation="wave" variant="rectangular" width="100%" height={250} /> */}
          <div className={`${styles.overlay_skeleton} ${styles.overlay}`}>
            <h2><Skeleton animation="wave" variant="text" width="90%" height={20} /></h2>
            <h3><Skeleton animation="wave" variant="text" width="90%" height={20} /></h3>
            <h4><Skeleton animation="wave" variant="text" width="90%" height={20} /></h4>
          </div>
        </div>
      </div>
    )
  return (
    <div className={styles.main_container}>
      <Swiper
        spaceBetween={30}
        effect={"fade"}
        pagination={{
          clickable: true,
        }}
        modules={[EffectFade, Navigation, Pagination]}
        className="mySwiper"
        autoplay={{ delay: 2800, disableOnInteraction: false }}
        loop={true}
      >
        {list?.map((doc, index) => {
          return (
            <SwiperSlide className={styles.swiper_slide} key={index}>
              <Link href={`/post/${doc.id}`} >
                <div className={styles.swiper_container} onClick={onPostClick}>
                  <div className={styles.overlay}>
                    <h2>{`[${doc.category}]`}</h2>
                    <h2>{doc.title}</h2>
                    <h3>{doc.subtitle}</h3>
                    {/* <h4>{`${doc.createdAt} | ${doc.author}`}</h4> */}
                  </div>
                  <Image priority src={doc.thumbnailImg.includes("https:") ? doc.thumbnailImg : `https:${doc.thumbnailImg}`} alt="메인 배경 이미지" layout="fill" objectFit="cover" objectPosition="center"/>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  );
}
