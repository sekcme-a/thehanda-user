import { useState, useEffect } from "react"

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddTaskIcon from '@mui/icons-material/AddTask';
import styles from "./backdropLoader.module.css";

import { motion } from "framer-motion"

  // const [backdropValue, setBackdropValue] = useState({
  //   openBackdrop: false,
  //   submitted: false,
  //   title: "알림",
  //   text: "",
  //   buttonText:"확인"
  // })
const BackdropLoader = ({openBackdrop, setOpenBackdrop, submitted, title, text, buttonText}) => {
  const [isSubmitting, setIsSubmitting] = useState(true)

  const onBackdropClick = () => {
    setOpenBackdrop(false)
  }

  return (
    <Backdrop
      sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1, display:"flex", justifyContent:"center" }}
      open={openBackdrop}
      onClick={onBackdropClick}
    >
      <div className={styles.backdrop_container}>
        {!submitted ?
          <>
            <CircularProgress style={{'color': 'white'}} />
            <p>잠시만 기다려주세요...</p>
          </>
          :
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.0} }}
            style={{ width: "100%", textAlign: "center" }}>
              <div className={styles.alarm_container}>
                <h1>{title}</h1>
                <h2>{text}</h2>
                <h3>{buttonText}</h3>
              </div>
            </motion.div>
          </>
        }
      </div>
    </Backdrop>
  )
}

export default BackdropLoader