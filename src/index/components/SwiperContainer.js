import React, { useEffect, useState } from "react"
import { useRouter } from "next/router";

import Link from "next/link";
import Image from "next/image";
import Skeleton from '@mui/material/Skeleton';
import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';
import Button from '@mui/material/Button';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import styles from "../styles/swiperContainer.module.css"

import img1 from "public/multicultural-news.png"
import famtaverse from "public/famtaverse.jpg"
import program from "public/program.png"
import ShareIcon from '@mui/icons-material/Share';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const MainSwiper = ({ data }) => {
  const router = useRouter()

    // 공유하기 버튼 클릭 시 실행되는 함수
    const onShareClick = () => {
      if(window.ReactNativeWebView){
        window.ReactNativeWebView.postMessage(`SHARE_URL: https://dahanda.netlify.app/preview/${localStorage.getItem("selectedTeamId")}/${data.id}`)
      }
    }

  return (
    // <div className={styles.main_container}>
      <div className={styles.swiper_container}>
        <div className={styles.image_container}>
          <Image src={data.mainBg} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
          <div className={styles.blur} />
        </div>
        <div className={styles.overlay}>
        {/* <div className={styles.overlay_container}> */}
          <div className={styles.content}>
            <h2>{data.title}</h2>
            <h3>{data.subtitle}</h3>
            <h5>{data.keyword}</h5>
            <h4>{data.date}</h4>
            
          </div>
          <div className={styles.thumbnail_container}>
            <div className={styles.thumbnail_image_container}>
              <Image src={data.thumbnailBg==="/custom" ? data.customBgURL:data.thumbnailBg} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
              { data.thumbnailBg!=="/custom" &&
                <div className={data.color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
                  <h2>{data.title}</h2>
                  <h3>{data.subtitle}</h3>
                  <h4>{data.date}</h4>
                </div>
              }
            </div>
          </div>
          <div className={styles.button_container}>
            <Button startIcon={<BubbleChartOutlinedIcon />} className={styles.button}
              style={{ margin: "10px 15px", padding: "8px 0px", width: '150px' }} onClick={()=>router.push(`article/${localStorage.getItem("selectedTeamId")}/${data.id}`)}>
              자세히 보기
            </Button>
            <Button startIcon={<ShareIcon />} className={styles.button}
              style={{ margin: "10px 15px", padding: "5px 0px", width: '150px', color: "#333" }} onClick={onShareClick}>
              공유하기
            </Button>
          </div>
        {/* </div> */}
        </div>
      </div>
    // </div>
  )
}

export default MainSwiper