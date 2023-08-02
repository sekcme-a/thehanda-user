
import { motion } from "framer-motion"
import CircularProgress from '@mui/material/CircularProgress';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Backdrop from '@mui/material/Backdrop';
import styles from "./SubmitLoader.module.css"

const SubmitLoader = ({openBackdrop, onBackdropClick, isSubmitting, text}) => {
  return(
    <Backdrop
    sx={{ color: 'white', zIndex: (theme) => theme.zIndex.drawer + 1, display:"flex", justifyContent:"center" }}
    open={openBackdrop}
    onClick={onBackdropClick}
  >
    <div className={styles.backdrop_container}>
      {isSubmitting ?
        <>
          <CircularProgress style={{'color': 'white'}} />
          <p>잠시만 기다려주세요...</p>
        </>
        :
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }}>
            <AddTaskIcon style={{ fontSize: "80px" }} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.2, delay:0.5 } }}
          style={{ width: "100%", textAlign: "center" }}>
            <h1>제출 성공!</h1>
            <h2>{text}</h2>
          </motion.div>
        </>
      }
    </div>
  </Backdrop>
  )
}

export default SubmitLoader