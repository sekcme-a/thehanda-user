import { useState, useEffect } from "react";
import useData from "context/data";
import { useRouter } from "next/router";
// import styles from "../styles/InputUserData.module.css"
import { auth } from "firebase/firebase";

import { Button } from "@mui/material";

const InputUserData = () => {
  const [isLoading, setIsLoading] = useState(true)
  const {user} = useData()
  const router = useRouter()

  useEffect(()=>{

  },[])

  return(
    <>
      {/* <div className={styles.main_container}> */}
        <Button onClick={()=>{auth.signOut(); router.push("/")}}>로그아웃</Button>
      {/* </div> */}
    </>
  )
}

export default InputUserData