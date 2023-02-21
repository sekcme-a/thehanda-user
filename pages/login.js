import React, { useState, useEffect } from "react"
import styles from "src/login/styles/index.module.css"
import { useRouter } from "next/router";
import useData from "context/data";


import Image from "next/image"

import IdAndPassword from "src/login/components/IdAndPassword"
import SocialLogin from "src/login/components/SocialLogin"
import PageHeader from "src/public/components/PageHeader"
  

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const {userData} = useData()
  const router = useRouter()

  useEffect(() => {
    // if(userData!==null) 
    //   router.push("/")
  },[])


  return (
    <div className={styles.main_container} >
      <PageHeader text="돌아가기" />
      <div className={styles.logo_container}>
        <Image src="/logo.png" width={300} height={300} alt="한국다문화뉴스 로고" />
      </div>
      <IdAndPassword />
      <SocialLogin />
      <div style={{height:"100px"}} />
    </div>
  )
}
export default Login