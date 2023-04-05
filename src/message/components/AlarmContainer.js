import { useEffect, useState } from "react"
import styles from "../styles/alarmContainer.module.css"
import { useRouter } from "next/router"
import Image from "next/image"

import { firebaseHooks } from "firebase/hooks"

import Button from '@mui/material/Button';
import { Badge } from "@mui/material"

const AlarmContainer = ({image, name, date, text, button, onClick, read, unread}) => {

  useEffect(() => {
    const fetchData = async () => {

    }
    fetchData()
  }, [])
  return (
    <div className={styles.main_container}>
      {unread!==undefined && <div className={styles.badge}><Badge badgeContent={unread} color="primary"></Badge></div>}
      {read===false && <div className={styles.badge}><Badge badgeContent={1} color="primary"></Badge></div>}
      {/* {unread && <div className={styles.badge}>{unread}</div>} */}
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Image src={image} width={38} height={38} alt="로고" style={{borderRadius:"24%"}} />
        </div>
        <div className={styles.text_container}>
          <h1>{name}<p>{date && date.toDate().toLocaleString()}</p></h1>
          <h2>{text}</h2>
        </div>
      </div>
      {button && button.map((item, index) => {
        return (
          <Button key={index} style={{width:"100%", marginTop:"10px"}} variant="outlined" onClick={onClick[index]}>{item}</Button>
        )
      })}
    </div>
  )
}

export default AlarmContainer