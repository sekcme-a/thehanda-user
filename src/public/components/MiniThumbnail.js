import styles from "./miniThumbnail.module.css"
import { useEffect, useState } from "react"
import CampaignIcon from '@mui/icons-material/Campaign';
import { useRouter } from "next/router";

const Thumbnail = ({ data, path }) => {
  const [text, setText] = useState({})
  const router = useRouter()
  
  return (
    <div className={styles.main_container} onClick={()=>router.push(path)}>
      <div className={styles.icon_container}><CampaignIcon style={{ fontSize: "32px" }} /></div>
      <div className={styles.content_container}>
        <h3>{`${data.title}`}</h3>
        <h4>{data.subtitle}</h4>
        <p>
          {data.publishStartDate.toDate().toLocaleString('ko-KR').replace(/\s/g, '')}
        </p>
      </div>
    </div>
  )
}

export default Thumbnail