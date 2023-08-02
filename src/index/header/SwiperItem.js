import styles from "./DefaultSwiperItem.module.css"
import Image from "next/image"
import { Button } from "@mui/material"
import { useState, useEffect, use } from "react";
import useUserData from "context/userData";

import BubbleChartOutlinedIcon from '@mui/icons-material/BubbleChartOutlined';

import ShareIcon from '@mui/icons-material/Share';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import { useRouter } from "next/router";

const DefaultSwiperItem = ({data}) => {
  const router = useRouter()
  const [color, setColor] = useState("white")
  const {userData} = useUserData()

  useEffect(()=>{
    let color_temp = "white";
    if (
      data.thumbnailBg === "/image/thumbnail/003.png" ||
      data.thumbnailBg === "/image/thumbnail/004.png" ||
      data.thumbnailBg === "/image/thumbnail/006.png" ||
      data.thumbnailBg === "/image/thumbnail/008.png" ||
      data.thumbnailBg === "/image/thumbnail/009.png" ||
      data.thumbnailBg === "/image/thumbnail/010.png" ||
      data.thumbnailBg === "/image/thumbnail/011.png" ||
      data.thumbnailBg === "/image/thumbnail/012.png"
    )
      color_temp = "black";
    setColor(color_temp)
  },[])

  // 공유하기 버튼 클릭 시 실행되는 함수
  const onShareClick = () => {
    if(window.ReactNativeWebView){
      window.ReactNativeWebView.postMessage(`SHARE_URL: https://dahanda.netlify.app/preview/${userData.selectedTeamId}/${data.id}`)
    }
  }


  
  return(
    <div className={styles.main_container}>
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
                <h4>{data.keyword}</h4>
              </div>
            }
          </div>
        </div>
        <div className={styles.button_container}>
          <Button startIcon={<BubbleChartOutlinedIcon />} className={styles.button}
            style={{ margin: "10px 15px", padding: "8px 0px", width: '150px' }} onClick={()=>router.push(`article/${userData.selectedTeamId}/${data.id}`)}>
            자세히 보기
          </Button>
          <Button startIcon={<ShareIcon />} className={styles.button}
            style={{ margin: "10px 15px", padding: "5px 0px", width: '150px', color: "#333" }} onClick={onShareClick}>
            공유하기
          </Button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default DefaultSwiperItem