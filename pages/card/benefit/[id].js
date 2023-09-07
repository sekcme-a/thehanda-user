import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useData from "context/data";
import useUserData from "context/userData";
import PageHeader from "src/public/components/PageHeader";
import { firestore as db } from "firebase/firebase";
import Image from "next/image";
import styles from "src/card/benefit.module.css"

import { Grid, Tab, Tabs } from "@mui/material";
import FullScreenLoader from "src/public/components/FullScreenLoader";
import Menu from "src/public/components/header/Menu";

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';


const Benefit = () => {
  const router = useRouter()
  const {id} = router.query
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const [selectedTab, setSelectedTab] = useState("정보")

  const [isHide, setIsHide] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)
  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }

  //**스크롤 위치 확인 */
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
  
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //**스크롤 위치 확인 끝 */


  useEffect(()=> {
    const fetchData = async () => {
      const doc = await db.collection("benefit").doc(id).get()
      if(doc.exists){
        setData(doc.data())
      }else{
        alert("존재하지 않거나 삭제된 게시물입니다.")
        router.push("/benefits")
      }
      setIsLoading(false)
    }
    fetchData()
  },[id])

  const handleChange = (e, sel) => {
    setSelectedTab(sel)
  }

  if(isLoading)
    return <FullScreenLoader />

  return(
    <>
      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 
      <div className={scrollY>180 ? `${styles.header} ${styles.black}`:styles.header}>
        <div style={{display:'flex', alignItems:'center'}}>
          <ArrowBackRoundedIcon onClick={()=> router.back()}/>
          {scrollY>180 && <h5 style={{marginTop:'3px', marginLeft:'10px', fontSize:"17px"}}>{data.companyName}</h5>}
        </div>
        <MenuRoundedIcon onClick={onMenuClick} />
      </div>

      <div className={styles.image_container}>
        <Image priority fill style={{objectFit:"cover"}} src={data.logoURL} alt="로고" />
      </div>
      <div className={styles.main_content}>
        <h1>{data.companyName}</h1>
        <p>{data.infoSummary}</p>
      </div>
      <div className={styles.border} />
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        variant="fullWidth"
        scrollButtons="auto"
        textColor='secondary'
        indicatorColor='secondary'
        centered
      >
        <Tab label="정보" value="정보" style={{fontSize:"15px"}} />
        <Tab label="혜택" value="혜택" style={{fontSize:"15px"}}/>
      </Tabs>
      
        {selectedTab==="정보" &&
          <>
            <div className={styles.content_container}>
              <h1>업체 소개</h1>
              <p>{data.info}</p>
            </div>
            <div className={styles.border} />

            <ul className={styles.content_container}>
              <h1>업체 정보</h1>
              <Grid container sx={{color: "#333", whiteSpace:"pre-line"}} rowSpacing={1}>
                <Grid item xs={4}>상호명</Grid><Grid item xs={8}>{data.companyName}</Grid>
                
                {data.workTime && <><Grid item xs={4}>운영시간</Grid><Grid item xs={8}>{data.workTime}</Grid></>}
                
                {data.phone && <><Grid item xs={4}>전화번호</Grid><Grid item xs={8}>{data.phone}</Grid></>}
                {data.locationDetail && <><Grid item xs={4}>세부위치</Grid><Grid item xs={8}>{data.locationDetail}</Grid></>}
                {data.facilities && <><Grid item xs={4}>편의시설</Grid><Grid item xs={8}>{data.facilities}</Grid></>}
              </Grid>
            </ul>
          </>
        }
        {selectedTab==="혜택" &&
          <div className={styles.content_container} >
            <h1>혜택 안내</h1>
            <h2>{data.benefit}</h2>
          </div>
        }
        <div style={{height:"130px"}} />
    </>
  )
}
export default Benefit