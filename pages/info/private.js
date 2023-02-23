import React, {useEffect, useState} from "react"
import { useRouter } from "next/router"
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styles from "src/info/faq.module.css"
import { firestore as db } from "firebase/firebase";
import dynamic from "next/dynamic";

import PageHeader from "src/public/components/PageHeader";


const Private = () => {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const onTitleClick = () => { router.back() }

  useEffect(() => {
    const fetchData = async () => {
      const data = await db.collection("setting").doc("private").get()
      if (data.exists) {
        setText(data.data().text)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const createMarkup = () => {
    return {__html: text}
  }

  if (isLoading) {
    return(<></>)
  }

  return (
    <div className={styles.main_container}>
      <PageHeader text="개인정보처리방침" />
        <div className="quill_custom_editor" style={{marginTop:"35px"}}>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
        <div style={{height:"100px"}} />
    </div>
  )
}

export default Private