import ShowSurvey from "src/public/components/ShowSurvey"
import { useEffect, useState } from "react"
import styles from "src/programs/styles/index.module.css"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

import { CircularProgress } from "@mui/material"


const Survey = () => {
  const router = useRouter()
  const { team_id, id } = router.query;
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      const result = await db.collection("team").doc(team_id).collection("surveys").doc(id).get()
      if(result.exists){
        setData(result.data())
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
      <ShowSurvey data={data} team_id={team_id} id={id} type="surveys" />
      <div style={{width:"100%", height:"200px"}}></div>
    </>
  )
}
export default Survey