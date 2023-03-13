import ShowSurvey from "src/public/components/ShowSurvey"
import { useEffect, useState } from "react"
import styles from "src/programs/styles/index.module.css"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

import useData from "context/data"
import { CircularProgress } from "@mui/material"


const Survey = () => {
  const router = useRouter()
  const { team_id, id } = router.query;
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const {user} = useData()

  useEffect(() => {
    const fetchData = async () => {
      const result = await db.collection("team").doc(team_id).collection("programs").doc(id).get()
      if(result.exists){
        setData(result.data())

        if(user){
          db.collection("user").doc(user.uid).collection("history").doc("programs").get().then((doc)=>{
            if(doc.exists && doc.data().data){
              //array of object 의 id키와 id가 일치한게 있는지 확인 후 true 반환(history 에 있는지 확인)
              if(doc.data().data.some(obj => obj.id == id)){
                alert("이미 신청한 프로그램입니다.")
                router.push("/")
              }
            }
          })
        } else{
          alert("로그인 후 이용해주세요.")
          router.push("/")
        }
    
        if(result.data().hasLimit){
          db.collection("team_admin").doc(team_id).collection("result").doc(id).collection("users").get().then((query) => {
            if(parseInt(result.data().limit)<=query.docs.length)
              alert("선착순 마감되었습니다.")
              router.push("/")
          })
        }
    
        if(result.data().deadline?.toDate()<=new Date()){
          alert("신청 마감되었습니다.")
          router.push("/")
        }


        setIsLoading(false)


      } else{
        alert("존재하지 않거나 삭제된 게시물입니다.")
        router.push("/")
      }

      
    }
    if(localStorage.getItem("selectedTeamId")===null){
      localStorage.setItem("selectedTeamId", team_id)
      db.collection("team").doc(team_id).get().then((doc) => {
        localStorage.setItem("selectedTeamName", doc.data().teamName)
      })
    }
    fetchData()
  }, [])


  if (isLoading)
    return (
      <div className={styles.loader}>
        <CircularProgress />
      </div>
    )
  
  return (
    <>
      <ShowSurvey data={data} team_id={team_id} id={id} type="test" />
      <div style={{width:"100%", height:"200px"}}></div>
    </>
  )
}
export default Survey