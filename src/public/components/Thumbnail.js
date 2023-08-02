import styles from "./Thumbnail.module.css"
import { useEffect, useState } from "react"
import Image from "next/image";
import { useRouter } from "next/router";

import AccessAlarmOutlinedIcon from '@mui/icons-material/AccessAlarmOutlined';


const Thumbnail = ({data, smallMargin,  path}) => {
  const [color, setColor] = useState("white")
  const [date, setDate] = useState()
  const router = useRouter()

  useEffect(() => {
    if (data.thumbnailBg === "/thumbnail/003.png" ||
      data.thumbnailBg === "/thumbnail/004.png" ||
      data.thumbnailBg === "/thumbnail/006.png" ||
      data.thumbnailBg === "/thumbnail/008.png" ||
      data.thumbnailBg === "/thumbnail/009.png" ||
      data.thumbnailBg === "/thumbnail/010.png" ||
      data.thumbnailBg === "/thumbnail/011.png"||
      data.thumbnailBg === "/thumbnail/012.png"
    ) {
      setColor("black")
    }
    setInterval(()=>setDate( new Date()), 1000)
  }, [data])

    //몇 초후 신청가능, 몇분후 신청가능, 몇시간, 몇일 단위 계산
    // const getTimeLeft = () => {
    //   const timeLeft = Math.round((data.publishStartDate.toDate().getTime()-date.getTime())/1000)
    //   if(timeLeft<=60)
    //     return `${timeLeft}초 후 신청가능`
    //   else if(timeLeft<=3600)
    //     return `${Math.round(timeLeft/60)}분 후 신청가능`
    //   else if(timeLeft <= 3600*12)
    //     return`${Math.floor(timeLeft/3600)}시간 ${Math.round((timeLeft-Math.floor(timeLeft/3600)*3600)/60)}분 후 신청가능`
    //   else
    //   return`
    //     ${Math.floor(timeLeft/(3600*24))}일 후 신청가능`
    // }
    const getTimeLeft = () => {
      const timeLeft = Math.round((data.publishStartDate.toDate().getTime() - date.getTime()) / 1000);
    
      if (timeLeft <= 60) {
        return `${timeLeft}초 후 신청가능`;
      } else if (timeLeft <= 60 * 60) {
        const minutesLeft = Math.floor(timeLeft / 60);
        return `${minutesLeft}분 후 신청가능`;
      } else if (timeLeft <= 60 * 60 * 24) {
        const hoursLeft = Math.floor(timeLeft / (60 * 60));
        const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
        return `${hoursLeft}시간 ${minutesLeft}분 후 신청가능`;
      } else {
        const daysLeft = Math.floor(timeLeft / (60 * 60 * 24));
        return `${daysLeft}일 후 신청가능`;
      }
    };
    

    const onClick = async () => {
      router.push(path)
    }

  return(
    <div className={smallMargin ? `${styles.main_container} ${styles.small_margin}` : styles.main_container}onClick={onClick}>
          <div className={styles.thumbnail_container}>
            {data.publishStartDate.toDate() > date ? 
              <div className={styles.waiting_container}>
                <div style={{display:"flex", justifyContent:"center", flexWrap:"wrap"}}>
                <AccessAlarmOutlinedIcon style={{fontSize:"40px", color:"white"}}/>
                {/* <p>{`${Math.round((data.publishedDate.toDate().getTime()-date.getTime())/1000/60)}분 후 신청가능`}</p> */}
                <p>{getTimeLeft()}</p>
                </div>
              </div>
              :
              <div className={styles.thumbnail_image_container}>
                <Image src={data.thumbnailBg==="/custom" ? data.customBgURL : data.thumbnailBg} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
                {data.thumbnailBg!=="/custom" &&
                  <div className={color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
                    <h2>{data.title}</h2>
                    <h3>{data.subtitle}</h3>
                    {/* <div style={{width:"100%"}}/> */}
                    <h4>{data.date}</h4>
                  </div>
                }
              </div>
            }
          </div>
      <div className={styles.content_container}>
        {data.keyword && <h2>{`[${data.keyword}]`}</h2>}
        <h3>{data.title}</h3>
        <h4>{data.subtitle}</h4>
        <p>신청마감일 - {true ? 
          data.deadline?.toDate().toLocaleString('ko-KR').replace(/\s/g, '')
          : 
          data.deadline?.toDate().toLocaleString('en-US').replace(/\s/g, '')}
        </p>
      </div>
      <div>
        {/* <SurveyDialog isShow={openDialog} handleShow={(bool)=>setOpenDialog(bool)} path={surveyPath} /> */}
      </div>
    </div>
  )
}
export default Thumbnail