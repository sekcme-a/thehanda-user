import ShowSurvey from "src/public/components/ShowSurvey"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"


import { firestore as db } from "firebase/firebase"


import { CircularProgress } from "@mui/material"


const ProgramSurvey = () => {
  const router = useRouter()
  const { team_id, id } = router.query;
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      const result = await db.collection("team").doc(team_id).collection("programSurvey").doc(id).get()
      setData(result.data())
      setIsLoading(false)
    }
    fetchData()
  }, [])


  if (isLoading)
    return (
      <div >
        <CircularProgress />
      </div>
    )
  
  return (
    <>
      <ShowSurvey data={data} team_id={team_id} id={id} type="programSurvey" />
    </>
  )
}
export default ProgramSurvey