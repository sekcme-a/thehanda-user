import { useState, useEffect } from "react";
import useData from "context/data";
import { useRouter } from "next/router";
import styles from "../styles/ChooseCenter.module.css"
import { FIREBASE } from "firebase/hooks";
import { CircularProgress } from "@mui/material";
import Image from "next/image";


const PROFILE_SIZE=40
const ChooseCenter = () => {
  const [isLoading, setIsLoading] = useState(true)
  const {user, centerList, setCenterList} = useData()
  const router = useRouter()
  // const [list, setList] = useState([])

  useEffect(()=>{
    const fetchData = async () => {
      const list = await FIREBASE.FETCH_CENTER_LIST()
      setCenterList([...list])
      setIsLoading(false)
    }
    if(!centerList)
      fetchData()
    else
      setIsLoading(false)
  },[])

  const onClick = async(teamId, teamName)=> {
    // alert(teamId)
    localStorage.setItem("selectedTeamId",teamId)
    localStorage.setItem("selectedTeamName", teamName)
    await FIREBASE.ADD_USER_TO_TEAM(teamId, user.uid)
    router.push("/")
  }

  if(isLoading)
    return(
      <div>
        <CircularProgress />
      </div>
    )

  return(
    <>
      <div className={styles.main_container}>
        {centerList.map((item, index)=>{
          return(
            <>
            <div className={styles.item_container} key={index} onClick={()=>onClick(item.id, item.teamName)}>
              <Image src={item.profile} alt={item.name} width={PROFILE_SIZE} height={PROFILE_SIZE} style={{borderRadius:"5px"}}/>
              <p>{item.teamName}</p>
            </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default ChooseCenter