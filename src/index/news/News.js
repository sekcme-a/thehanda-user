import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import useData from "context/data"

import styles from "./News.module.css"
import { firestore as db } from "firebase/firebase"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton from '@mui/material/Skeleton';

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import "swiper/css/pagination";

import NewsSwiper from "./NewsSwiper"



const Program = (props) => {
  const router = useRouter()


  const onMoreClick = () => {
    router.push(`/home/multiculturalNews/main`)
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.title}><h3>다문화 소식</h3><p onClick={onMoreClick}>{`더보기 >`}</p></div>
      <h4 className={styles.subtitle}>한국다문화뉴스의 주요기사들을 확인해보세요!</h4>
      <NewsSwiper />
    </div>
  )
}

export default Program