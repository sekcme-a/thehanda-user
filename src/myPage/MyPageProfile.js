import { useEffect, useState } from "react"
import styles from "./myPageProfile.module.css"
import { useRouter } from "next/router"

import useData from "context/data"

import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import CameraEnhanceOutlinedIcon from '@mui/icons-material/CameraEnhanceOutlined';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
  color: "#814ad8",
  background
}));

const MyPageProfile = () => {
  const router = useRouter()
  const { userData } = useData()


  useEffect(() => {
    const fetchData = async () => {
    }
    fetchData()
  }, [])
  if(userData)
  return (
    <div className={styles.main_container}>
      {/* <div className={styles.avatar_container}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <CameraEnhanceOutlinedIcon style={{color: "white", backgroundColor:"#814ad8", borderRadius:"50%", padding: "2px", fontSize: "18px"}} />
        }
      >
        <Avatar alt={userData.displayName} src={userData.photoUrl} style={{width: "70px", height: "70px"}} />
      </Badge>
      </div> */}
      <div className={styles.text_container} style={{marginLeft:"20px"}}>
        <h2>Welcome</h2>
        <h3>{userData.displayName}님</h3>
        <h4>회원정보를 등록하면 맞춤 서비스를 받을 수 있습니다.</h4>
        <p>{`회원정보 보러가기 >`}</p>
      </div>
    </div>
  )
}

export default MyPageProfile