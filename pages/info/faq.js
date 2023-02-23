import React, {useEffect, useState} from "react"
import styles from "src/info/faq.module.css"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";

import PageHeader from "src/public/components/PageHeader";


import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from "@mui/material/Button"
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';

import Image from "next/image";


const Faq = () => {
  const router = useRouter()
  const onTitleClick = () => { router.back() }
  const [expanded, setExpanded] = useState(false)
  const [list, setList] = useState([])
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let temp1List = []
      let count = 0
      const doc = await db.collection("setting").doc("help").get()
      if (doc.exists) {
        let text = doc.data().text
        const temp2 = text.split("[[[")
        const linkList = doc.data().link?.split("\n")
        temp2.map((text) => {
          const temp3List = text.split("]]]")
          if (temp3List[0] !== "" && temp3List[1] !== undefined) {
            let temp4string = temp3List[1]
            while(temp4string.includes("<<<"))
              temp4string = temp4string.replace("<<<",`<strong>`)
            while(temp4string.includes(">>>"))
              temp4string = temp4string.replace(">>>", "</strong>")
            while(temp4string.includes("\n"))
              temp4string = temp4string.replace("\n", "<br />")
            if (linkList) {
              linkList.map((link) => {
                const temp5List = link.split("==")
                while (temp4string.includes(temp5List[0])) {
                  temp4string = temp4string.replace(temp5List[0], `<a href="private">${temp5List[1]}</a>`)
                }
              })
            }
            if (temp4string[0] === "<" && temp4string[1] === "b" && temp4string[2] === "r" && temp4string[3] === " "
              && temp4string[4] === "/" && temp4string[5] === ">") {
              temp4string = temp4string.replace("<br />","")
            }
            temp1List = [
              ...temp1List,
              {
                title: temp3List[0],
                content: temp4string,
                count: count,
              }
            ]
            count++
          }
        })
        setIsLoading(false)
        setList(temp1List)
      }
    }
    fetchData()
  },[])

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onLinkClick = (url) => {
    console.log(url)
  }

  const createMarkup = (content) => {
    return {__html: content}
  }

  if (isLoading)
    return (<></>)
  
  return (
    <div className={styles.main_container}>
      <PageHeader text="도움말" />
      
      <div className={styles.cannot_solve_container}>
        <h1 className={styles.main_title}><h2>{`"다한다"`}</h2>어플을 소개합니다.</h1>
        <div>
          <p>해결되지 않는 문제가 있다면 직접 문의해보세요!</p>
          <Button style={{width:'50%', color:"#814ad8", fontSize:"15px"}} onClick={()=>{router.push("/contact/center")}}><SupportAgentOutlinedIcon />센터에 문의하기</Button>
          <Button style={{width:'50%', color:"#814ad8", fontSize:"15px"}} onClick={()=>{router.push("/contact/app")}}><PhoneIphoneIcon />어플에 문의하기</Button>
        </div>
      </div>
      {
        list.map((data, index) => {
          return (
          <Accordion expanded={expanded === `panel${data.count}`} onChange={handleChange(`panel${data.count}`)} style={{width: "100%"}} key={index}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#814ad8" }} />}
              aria-controls={`panel${data.count}bh-content`}
                id={`panel${data.count}bh-header`}
              // style={{border: "1px solid #ddccf9"}}
            >
              <h1 className={styles.title}>{data.title}</h1>
            </AccordionSummary>
            <AccordionDetails>
              <h3 className={styles.text} dangerouslySetInnerHTML={createMarkup(data.content)} />
            </AccordionDetails>
          </Accordion>
          )
        })
      }
    </div>
  )
}

export default Faq