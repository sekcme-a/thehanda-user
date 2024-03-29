import { useEffect, useState } from "react"
import styles from "./preview.module.css"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"
import Image from "next/image"

import useData from "context/data"
import { firestore as db } from "firebase/firebase"

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Timeline from '@mui/lab/Timeline';
import TimelineItem,{ timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Backdrop from '@mui/material/Backdrop';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';import ShareIcon from '@mui/icons-material/Share';

import { motion } from "framer-motion"

const createMarkup = (text) => {
  return {__html: text}
}

const Contents = ({data, teamName, id, type, mode}) => {
  const router = useRouter()
  const { user } = useData()
  const [hasHistory, setHasHistory] = useState(false)
  const [hasEnd, setHasEnd] = useState(false)
  const [hasLimitEnd, setHasLimitEnd] = useState(false)//선착순 마감

  const [isShow, setIsShow] = useState(false)
  const [programSurveyDoc, setProgramSurveyDoc] = useState("")
  const [programSurveyTitle, setProgramSurveyTitle] = useState("")
  const [programSurveyTeam, setProgramSurveyTeam] = useState("")

  const [color, setColor] = useState("white")
  const [selectedItem, setSelectedItem] = useState(0)

  const [openWebview, setOpenWebview] = useState(false)
  const [url, setUrl] = useState("")
  const handleChange = (event, newValue) => {
    setSelectedItem(newValue); 
    console.log(newValue)
    // fetchProgramData(groups[newValue].id)
  };
//4689101112
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
    if(user){
      db.collection("user").doc(user.uid).collection("history").doc(type).get().then((doc)=>{
        if(doc.exists && doc.data().data){
          //array of object 의 id키와 id가 일치한게 있는지 확인 후 true 반환(history 에 있는지 확인)
          if(doc.data().data.some(obj => obj.id == id)){
            setHasHistory(true)
          }
        }
      })
    }

    if(data.hasLimit){
      db.collection("team_admin").doc(teamName).collection("result").doc(id).collection("users").get().then((query) => {
        if(parseInt(data.limit)<=query.docs.length)
          setHasLimitEnd(true)
      })
    }

    if(data.deadline?.toDate()<=new Date()){
      setHasEnd(true)
    }
  },[]) 


  const onButtonClick = async() => {
    // if(data.hasSurvey)'
    if(user===null)
      router.push("/login")
    else if(type==="programs"){
      db.collection("user").doc(user.uid).collection("programSurvey").where("hasSubmit","==", false).get().then((query)=>{
        if(query.empty)
          router.push(`/programs/${teamName}/${id}`)
        else{
          query.docs.forEach((doc)=>{
            if(doc.data().deadline.toDate() < new Date()){
              db.collection("user").doc(user.uid).collection("programSurvey").doc(doc.id).delete()
            }
            else{
              setIsShow(true)
              setProgramSurveyDoc(doc.id)
              setProgramSurveyTitle(doc.data().title)
              setProgramSurveyTeam(doc.data().team)
            }
          })
        }
      })
    } else
      router.push(`/surveys/${teamName}/${id}`);
    // else
    //   router.push(`result/${teamName}/${id}`)
  }

  const onCancelClick = async() => {
    if(confirm("신청 취소 하시겠습니까?")){
      const doc = await db.collection("user").doc(user.uid).collection("history").doc(type).get()
      const deleteHistoryResult = doc.data().data.map((item)=>{
        if(item.id!==id)
          return item
      }).filter(Boolean);
    
      const batch = db.batch()
      batch.update(db.collection("user").doc(user.uid).collection("history").doc(type),{data: deleteHistoryResult})
      batch.delete(db.collection("team_admin").doc(teamName).collection("result").doc(id).collection("users").doc(user.uid))
      await batch.commit()
      alert("신청취소되었습니다.")
      setHasHistory(false)
    }
  }


  const handleUrl = (url) => {
    if(window.ReactNativeWebView){
      window.ReactNativeWebView.postMessage(`OPEN_URL: ${url}`)
    }
  }

  const onDownClick = () => {
    const userAgent = window.navigator.userAgent;
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

    if (isAndroid) {
      router.push('https://play.google.com/store/apps/details?id=com.zzsoft.thehanda');
    } else if (isIOS) {
      router.push('https://itunes.apple.com/app/%EB%8D%94%ED%95%9C%EB%8B%A4/id1665555435');
  }
}

  return (
    <div className={styles.main_container}>
{/*       
      <ArrowBackRoundedIcon className={color === "white" ? `${styles.back_button}` : `${styles.back_button} ${styles.black}`} 
        onClick={()=>router.back()}
      /> */}
      <div className={styles.thumbnail_container}>
        <div className={styles.thumbnail_image_container}>
          <Image priority src={data.thumbnailBg==="/custom" ? data.customBgURL : data.thumbnailBg} alt="배경" layout="fill" objectFit="cover" objectPosition="center" />
          {data.thumbnailBg!=="/custom"&&
            <div className={color === "white" ? `${styles.thumbnail_overlay} ${styles.white}` : `${styles.thumbnail_overlay} ${styles.black}`} >
              <h2>{data.keyword}</h2>
              <h3>{data.title}</h3>
              <h4>{data.subtitle}</h4>
              <h5>{data.date}</h5>
            </div>
          }
        </div>
      </div>
      <div style={mode==="preview" ? {marginTop:"-329px"} : {marginTop:"0 "}} />
      <div className={styles.info_container}>
        <h3>{data.keyword}</h3>
        <h1>{data.title}</h1>
        <h2>{data.subtitle}</h2>
        {data.info.length!==0 &&
          <div className={styles.info_sub_container}>
            {data.info.map((item, index) => {
              if (item.type === "link")
                return (
                  <Button style={{fontSize:"15px"}} onClick={()=>{handleUrl(item.text)}}>{item.title}</Button>
                )
              return (
                <div className={styles.item_container} key={index}>
                  <h1>{item.title}</h1>
                  <p>{item.text}</p>
                </div>
              )
            })}
          </div>
        }
      </div>


      <Tabs
        value={selectedItem}
        onChange={handleChange}
        // centered
        scrollButtons="auto"
        textColor='secondary'
        indicatorColor='secondary'
        style={{borderBottom:"2px solid rgb(248,248,248)", }}
      >
        <Tab label={type === "surveys" ? "설문조사 정보" : "프로그램 소개"} style={{ margin: "0 10px", fontSize:"15px" }} />
        {type !== "surveys" && <Tab label="프로그램 일정" style={{ margin: "0 10px", fontSize: "15px" }} />}
      </Tabs>

      {console.log(data.publishedDate)}
      {selectedItem === 0 && data.introduce.map((item, index) => {
        return (
          <div className={styles.content_container} key={index}>
            <h1>{item.title}</h1>
            <div className="quill_custom_editor">
              <div dangerouslySetInnerHTML={createMarkup(item.html)} />
            </div>
            {/* <p>{item.text}</p> */}
          </div>
        )
      })}

      
      {selectedItem === 0 && data.introduce?.length === 0 &&
        <div className={styles.no_schedule}>
          <InfoOutlinedIcon sx={{ fontSize: "40px !important" }} />
          {type === "surveys" ? <p>설문조사 정보가 없습니다.</p> : <p>프로그램 소개가 없습니다.</p>}
        </div>
      }
      
      {selectedItem === 1 && data.schedule?.length === 0 &&
        <div className={styles.no_schedule}>
          <EventBusyOutlinedIcon sx={{ fontSize: "40px !important" }} />
          <p>프로그램 일정이 없습니다.</p>
        </div>
      }

      
      {selectedItem === 1 && data.schedule?.length !== 0 &&
        <div className={styles.timeline_container}>
          <Timeline sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}>
            {data.schedule.map((item, index) => {
              return (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot variant="outlined" color="primary" />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent style={{paddingBottom:"30px"}}>
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant='body1' sx={{ mr: 2, fontWeight: "bold", color: 'text.primary' }}>
                        {item.title}
                      </Typography>
                      <Typography variant='caption'>{item.date}</Typography>
                    </Box>
                    <Typography variant='body2' style={{whiteSpace: "pre-wrap", lineHeight:"1.2"}}>{item.text}</Typography>
                  </TimelineContent>
                </TimelineItem>
              )
            })}
          </Timeline>
        </div>
      }
      <div style={{ height: "200px" }}></div>
          <div className={styles.submit_container}>
            <p>해당 프로그램을 신청하거나 다른 프로그램들을 확인하려면 어플을 다운받으세요!</p>
            <Button variant="contained" onClick={onDownClick}>더한다 어플 다운받기</Button>
            {/* <a href="https://apps.apple.com/kr/app/%EB%8D%94%ED%95%9C%EB%8B%A4/id1665555435">
              <Button variant="contained">더한다 어플 다운받기</Button>
            </a> */}
            
          </div>      





    </div>
  )
}

export default Contents