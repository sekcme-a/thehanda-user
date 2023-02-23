import { useEffect, useState } from "react"
import styles from "../styles/showArticle.module.css"
import { useRouter } from "next/router"

import HeaderRightClose from "src/public/components/HeaderRIghtClose"

import Button from '@mui/material/Button';


const ShowArticle = ({createMarkup, data, teamName, id, type}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className={styles.main_container}>
      <HeaderRightClose title={type==="anouncement" ? "공지사항" : data.title} />
      <div className={styles.content_container}>
        <h1>{data.title}</h1>
        <h2>{data.subtitle}</h2>
        <h3>게시일:  {data.publishStartDate?.toDate().toLocaleString('ko-KR').replace(/\s/g, '')}</h3>
        {/* {data.content && <div className="quill_custom_editor"><Editor textData={data.content} custom={true} /></div>} */}
        {/* {data.content && <QuillNoSSRWrapper value={data.content || ""} readOnly={true} theme="snow" />} */}
        <div className={styles.border} />
        <div className="quill_custom_editor" style={{marginTop:"3px"}}>
          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
        <div style={{ height: "30px" }}></div>
        <Button onClick={()=>router.push("/")} variant="contained" fullWidth style={{ backgroundColor: "#5316b5" }}>홈으로</Button>
      </div>
    </div>
  )
}

export default ShowArticle