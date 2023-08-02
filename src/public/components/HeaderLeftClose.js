import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import styles from "./headerLeftClose.module.css"

import { useRouter } from 'next/router';

const HeaderRightClose = ({ title }) => {
  const router = useRouter()

  const onCloseClick = () => {
    router.back()
  }
  return (
    <div className={styles.main_container}>
      <ArrowBackIosRoundedIcon className={styles.close_button} style={{ fontSize: "20px" }} onClick={onCloseClick} />
      <h1>{title}</h1>
      
    </div>
  )
}

export default HeaderRightClose