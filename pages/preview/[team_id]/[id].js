import { useEffect, useState } from "react"
import styles from "src/article/Article.module.css"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"

import Preview from "src/preview/Preview"
import { CircularProgress } from "@mui/material"

const Contents = () => {
  const router = useRouter()
  const { team_id, id } = router.query;
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState()
  const [selectedItem, setSelectedItem] = useState(0)
  const handleChange = (event, newValue) => {
    setSelectedItem(newValue);
    console.log(newValue)
    // fetchProgramData(groups[newValue].id)
  };



  useEffect(() => {
    const fetchData = async () => {
      let doc = await db.collection("team").doc(team_id).collection("programs").doc(id).get()
      if(doc.exists)
        setType("programs")
      else{
        doc = await db.collection("team").doc(team_id).collection("surveys").doc(id).get()
        setType('surveys')
      }
      if(doc.exists){
        setData({...doc.data()})
        setIsLoading(false)
      } else{
        alert("존재하지 않거나 삭제된 게시물입니다.")
        // router.push("/")
      }
    }
    if(router.query.team_id)
      fetchData()
  }, [router.query])


  if (isLoading)
    return (
      <div className={styles.loader}>
        <CircularProgress />
      </div>
    )
  

  return (
    <Preview data={data} teamName={team_id} id={id} type={type} />
  )
}

export default Contents