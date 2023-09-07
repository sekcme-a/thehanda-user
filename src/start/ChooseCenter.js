import { useState, useEffect } from "react";
import useData from "context/data";
import useUserData from "context/userData";
import { useRouter } from "next/router";
import styles from "./ChooseCenter.module.css"
import { DB } from "./ChooseCenterDB";
import { CircularProgress } from "@mui/material";
import Image from "next/image";


const PROFILE_SIZE=40
const ChooseCenter = () => {
  const [isLoading, setIsLoading] = useState(true)
  // const {user, centerList, setCenterList, setUserData, userData} = useData()
  const {centerList, setCenterList} = useData()
  const {user, setUserData, userData} = useUserData()
  const router = useRouter()
  // const [list, setList] = useState([])

  useEffect(()=>{
    const fetchData = async () => {
      const list = await DB.FETCH_CENTER_LIST()
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
    await DB.SET_SELECTED_TEAM(teamId, teamName, user.uid)
    await DB.ADD_USER_TO_TEAM(teamId, user.uid)
    setUserData({...userData, selectedTeamId: teamId, selectedTeamName: teamName})
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
              <Image priority src={item.profile} alt={item.name} width={PROFILE_SIZE} height={PROFILE_SIZE} style={{borderRadius:"5px"}}/>
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