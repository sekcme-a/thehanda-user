import styles from "./DefaultSwiperItem.module.css"
import Image from "next/image"
import { Button } from "@mui/material"
import { useState, useEffect } from "react";

import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';

import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

const DefaultSwiperItem = () => {
  const [color, setColor] = useState("white")

  const openUrl = (url) => {
    if(window.ReactNativeWebView){
      window.ReactNativeWebView.postMessage(`OPEN_URL: https://www.kmcn.kr/`)
    }
  }



  
  return(
    <div className={styles.main_container}>
    <div className={styles.swiper_container}>
      <div className={styles.image_container}>
        <Image src="/image/background/black.jpg" alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
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
            style={{ margin: "10px 15px", padding: "5px 0px", width: '150px', color: "#333" }} onClick={() => {openUrl}}>
            홈페이지 방문
          </Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DefaultSwiperItem