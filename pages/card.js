"use client"

import { useState, useEffect } from "react"
import useData from "context/data"
import { useRouter } from "next/navigation"
import { firebaseHooks } from "firebase/hooks"
import styles from "src/card/styles/Card.module.css"
// import Loader from "src/public/components/Loader"
import Card from "src/card/components/Card"
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';

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
    </div>
  )
}

export default CardCompo