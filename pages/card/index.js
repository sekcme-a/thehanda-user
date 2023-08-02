"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import styles from "src/card/Card.module.css"
// import Loader from "src/public/components/Loader"
import Card from "src/card/Card"
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { Button } from "@mui/material"

const CardCompo = () => {
  const {user} = useData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchData = async () => {
      setIsLoading(false)
    }
    fetchData()
  },[])

  // if(isLoading)
  //   return <Loader />
  
  return(
    <div className={styles.main_container}>
      <div className={styles.arrow} onClick={()=>router.back()}>
        <ClearRoundedIcon style={{fontSize:"30px"}} />
      </div>
      <Card />
      <Button style={{marginTop:"25px"}} size="large" onClick={()=>router.push("/card/benefits")}>더한다 멤버쉽 혜택 보러가기</Button>
    </div>
  )
}

export default CardCompo