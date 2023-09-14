import { useState, useEffect } from "react"
import useData from "context/data"
import useUserData from "context/userData"

import { useRouter } from "next/router"
import PageHeader from "src/public/components/PageHeader"
import { CircularProgress } from "@mui/material"

import { firestore as db } from "firebase/firebase"
import styles from "src/message/reply.module.css"

const Reply = () => {
  const router = useRouter()
  const {id} = router.query
  const {user} = useUserData()
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async() => {
      db.collection("user").doc(user.uid).collection("message").doc(id).get().then(async(doc)=>{
        if(doc.exists){
          setData(doc.data())

          //읽음 control
          if(doc.data().read===false){
            const batch = db.batch()
            const statusDoc = await db.collection("user").doc(user.uid).collection("message").doc("status").get()
            batch.update(db.collection("user").doc(user.uid).collection("message").doc(id), {read: true})
            batch.update(db.collection("user").doc(user.uid).collection("message").doc("status"), {unread: statusDoc.data().unread-1})
            batch.commit()
          }
        }
        else{
          alert("존재하지 않는 답장입니다.")
          router.push('/')
        }
        setIsLoading(false)
      })
      
    }
    if(user) fetchData()
  },[user])

  if(isLoading)
    return(
      <>
        <PageHeader text="프로그램 문의" />
        <div style={{display:"flex", justifyContent:"center", marginTop:"50px"}}><CircularProgress /></div>
      </>
    )
  return(
    <>

      <PageHeader text="문의 답장" />
      <div className={styles.main_container}>
        <h1><strong>{data.type==="center" ? "문의 제목:":"문의한 프로그램:"}</strong> {data.title}</h1>
        <p><strong>문의 내용:</strong>{data.text}</p>
        <h2><strong>답장</strong><h4>{data.repliedAt.toDate().toLocaleString('ko-KR').replace(/\s/g, '')}에 회신</h4></h2>
        <h3>{data.repliedText}</h3>
        <div style={{marginBottom:"80px"}}/>
      </div>
    </>
  )
}

export default Reply