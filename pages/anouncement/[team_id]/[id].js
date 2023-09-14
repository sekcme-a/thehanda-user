import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import dynamic from "next/dynamic"

import ShowArticle from "src/public/components/ShowArticle"
import { CircularProgress } from "@mui/material"
import { firestore as db } from "firebase/firebase"

const Anouncement = () => {
  const router = useRouter()
  const { team_id, id } = router.query;
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [text, setText] = useState()
  const [type, setType] = useState()


  useEffect(() => {
    const fetchData = async () => {
      let result = await db.collection("team").doc(team_id).collection("anouncements").doc(id).get()
      // console.log(result.content)
      setData(result.data())
      setIsLoading(false)
    }
    fetchData()
  }, [])


  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    )
  
  const createMarkup = () => {
    return {__html: data?.textData}
  }
  return (
    <div>
      <ShowArticle createMarkup={createMarkup} data={data} teamName={team_id} id={id} type="anouncement" />
      <div style={{width:"100%", height:"100px"}} />
    </div>
  )
}

export default Anouncement