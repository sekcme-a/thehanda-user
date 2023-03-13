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


        setIsLoading(false)


      } else{
        alert("최초 저장 후 미리보기가 가능합니다.")
      }

      
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