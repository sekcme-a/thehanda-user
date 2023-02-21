import { useEffect, useState } from "react";
import styles from "../styles/pageHeader.module.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from "next/router";

const PageHeader = ({text}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(false)
    }
    fetchData()
  }, [])
  
  const onBackButtonClick = () => {
    router.back()
  }
  if(isLoading) (<></>)
  return (
      <div className={styles.header_container}>
        <div className={styles.icon_container} onClick={onBackButtonClick}><ArrowBackIosIcon style={{fontSize: "18px"}}/></div>
          <p onClick={onBackButtonClick}>{text}</p>
      </div>
  )
}

export default PageHeader