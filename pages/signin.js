
import styles from "src/signIn/styles/index.module.css"
import { useRouter } from "next/router"

import SignInCompo from "src/signIn/components/SignIn"

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';




const SignIn = () => {
  const router = useRouter()
  const onTitleClick = () => {
    router.back()
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onTitleClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>회원가입</p>
      </div>  
      <SignInCompo mode="user" />
    </div>
  )
}

export default SignIn