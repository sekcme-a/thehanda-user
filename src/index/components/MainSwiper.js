import React, { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import "swiper/css/pagination";
import SwiperCore, { Pagination, Navigation, Autoplay} from "swiper";

import Image from "next/image";
import Skeleton from '@mui/material/Skeleton';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import Button from '@mui/material/Button';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import styles from "../styles/mainSwiper.module.css"

import SwiperContainer from "./SwiperContainer"
import OpenWebview from "src/public/components/OpenWebview"
import { CircularProgress } from "@mui/material";

const MainSwiper = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [color, setColor] = useState("white")
  const [list, setList] = useState([])
  const [openWebview, setOpenWebview] = useState(false)
  const router = useRouter()
  SwiperCore.use([Autoplay])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      let selectedTeamId = localStorage.getItem("selectedTeamId");
      if (selectedTeamId === null) selectedTeamId = "suwon";
      let tempList = [];
  
      const query = await db
        .collection("team")
        .doc(selectedTeamId)
        .collection("programs")
        .where("isMain", "==", true)
        .where("condition", "==", "confirm")
        .get();
  
      query.docs.forEach((doc) => {
        let color = "white";
        if (
          doc.data().thumbnailBg === "/thumbnail/003.png" ||
          doc.data().thumbnailBg === "/thumbnail/004.png" ||
          doc.data().thumbnailBg === "/thumbnail/006.png" ||
          doc.data().thumbnailBg === "/thumbnail/008.png" ||
          doc.data().thumbnailBg === "/thumbnail/009.png" ||
          doc.data().thumbnailBg === "/thumbnail/010.png" ||
          doc.data().thumbnailBg === "/thumbnail/011.png" ||
          doc.data().thumbnailBg === "/thumbnail/012.png"
        )
          color = "black";
        tempList.push({ ...doc.data(), id: doc.id, color: color });
      });
  
      localStorage.setItem("list", JSON.stringify(tempList)); // Save the list to local storage
      setList(tempList);
      setIsLoading(false);
    };
  
    const storedList = JSON.parse(localStorage.getItem("list")); // Retrieve the list from local storage
    if (storedList) setList(storedList);
  
    fetchData();
  }, []);
  

  if(isLoading && list.length===0)
    return(
      <div className={styles.main_container}>
      <div className={styles.swiper_container}>
        
        <div className={styles.image_container}>
          <div className={styles.blur} />
          
        </div>
        <div className={styles.overlay}>
        {/* <div className={styles.overlay_container}> */}
          <div className={styles.content}>
          <h2></h2>
            <h3></h3>
            <h4></h4>
            
          </div>
          <div className={styles.thumbnail_container}>
            <div className={styles.thumbnail_image_container} >
              {/* { data.thumbnailBg!=="/custom" && */}
              <Skeleton variant="rectangular" width="100%" height="100%" animation="wave"/>
                <div className={color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
                
                  <h2></h2>   
                  <h3></h3>
                  <h4></h4>
                </div>
              {/* } */}
            </div>
          </div>
          <div className={styles.button_container}>

          </div>
        </div>
      </div>
    {openWebview &&
      <OpenWebview src="https://kmcn.kr/"open={openWebview} setOpen={setOpenWebview} />
    }
    </div>
    )

  if (!isLoading && list.length===0)
    return (
      
      <div className={styles.main_container}>
        <div className={styles.swiper_container}>
          <div className={styles.image_container}>
            <Image src="/background/black.jpg" alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
            <div className={styles.blur} />
          </div>
          <div className={styles.overlay}>
          {/* <div className={styles.overlay_container}> */}
            <div className={styles.content}>
            <h2>한국다문화뉴스</h2>
              <h3>한국 전역의 다문화 뉴스를 확인하세요.</h3>
              <h4>다양한 문화와 가치관을 담은 양방향 소통지!</h4>
              
            </div>
            <div className={styles.thumbnail_container}>
              <div className={styles.thumbnail_image_container}>
                <Image src="/thumbnail/001.png"alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
                {/* { data.thumbnailBg!=="/custom" && */}
                  <div className={color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
                  <h2>한국다문화뉴스</h2>   
                  <h3>한국 전역의 다문화 뉴스를 확인하세요.</h3>
                  <h4>교육과 정책, 비전 제시, 진정성 있는 내용 전달과 독자의 알 권리를 위해 최선을 다하겠습니다.</h4>
                  </div>
                {/* } */}
              </div>
            </div>
            <div className={styles.button_container}>
              <Button startIcon={<BubbleChartOutlinedIcon />} className={styles.button}
                style={{ margin: "10px 15px", padding: "8px 0px", width: '150px' }} onClick={()=>router.push("/home/multiculturalNews/main")}>
                뉴스 보러가기
              </Button>
              <Button startIcon={<CalendarMonthOutlinedIcon />} className={styles.button}
                style={{ margin: "10px 15px", padding: "5px 0px", width: '150px', color: "#333" }} onClick={() => { setOpenWebview(true)}}>
                홈페이지 방문
              </Button>
            </div>
          </div>
        </div>
      {openWebview &&
        <OpenWebview src="https://kmcn.kr/"open={openWebview} setOpen={setOpenWebview} />
      }
      </div>
    )
  
  return (
    <>
      <div className={styles.main_container}>
        <Swiper
          grabCursor={true}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          className={styles.swiper}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
        >

          {list.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <SwiperContainer data={item} />
              </SwiperSlide>
            )
          })}

        </Swiper>
        
      </div>
    </>
  )
}

export default MainSwiper