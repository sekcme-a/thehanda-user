import { useEffect, useState } from "react"
import styles from "src/myProfile/styles/index.module.css"
import { useRouter } from "next/router"
import Image from "next/image"

import useData from "context/data"
import { handleProfileImage } from "src/public/hooks/handleProfileImage"
import { firestore as db } from "firebase/firebase"

import PageHeader from "src/public/components/PageHeader"
import Form from "src/public/form/Form.js"

import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';


const MyProfile = () => {
  const router = useRouter()
  const { user, userData, setUserData} = useData()

  // const [image, setImage] = useState(user.photoURL)
  const [isImageURLLoading, setIsImageURLLoading] = useState(false)
  const [mainData, setMainData] = useState()
  const [subData, setSubData] = useState()
  const [profileData, setProfileData] = useState([])
  const [teamList, setTeamList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isProfileFormLoading, setIsProfileFormLoading] = useState(false)

  const [city, setCity] = useState("");

  const [values, setValues] = useState({
  })
  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  // const fetchFormData = async(value) => {
  //     try {
  //       setIsProfileFormLoading(true)
  //       const result_main = await firebaseHooks.fetch_profile_settings_object(value, "main")
  //       const result_sub = await firebaseHooks.fetch_profile_settings_object(value, "sub")
  //       setMainData(result_main)
  //       setSubData(result_sub)
  //       setIsProfileFormLoading(false)
  //     } catch (e) {
  //       setMainData("")
  //       setSubData("")
  //       setIsProfileFormLoading(false)
  //       console.log(e)
  //     }
  // }


  const handleChange = async (event) => {
    setCity(event.target.value);
    if (event.target.value !== undefined) {
      setIsProfileFormLoading(true)
      const doc = await db.collection("team").doc(event.target.value).collection("profileSettings").doc("main").get()
      setMainData([...doc.data().data])
      const profileDoc = await db.collection("team").doc(event.target.value).collection("users").doc(user.uid).get()
      if(profileDoc.exists && profileDoc.data().additionalData){
        setProfileData([...profileDoc.data().additionalData])
        console.log(profileDoc.data().additionalData)
      }
      setIsProfileFormLoading(false)
    }
  };
  
  const handleProfileDataChange = (data) => {
    setProfileData([...data])
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await db.collection("user").doc(user.uid).get()
        setValues({...userDoc.data()})
        const teamQuery = await db.collection("team").get()
        const temp = teamQuery.docs.map((doc) =>{
          return {...doc.data()}
        })
        setTeamList(temp)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    fetchData()
  }, [])


  const onImgChange = async (e) => {
    try {
      setIsImageURLLoading(true)
      const photoURL = await handleProfileImage(e.target.files[0], `profile/${user.uid}`,1)
      setValues({...values, photoUrl:photoURL})
      // setUserData({...userData, photoUrl: photoURL})
      setIsImageURLLoading(false)
    } catch (e) {
      console.log(e)
    }
  }


  if (isLoading)
    return (
      // <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
   <div className={styles.main_container}>
      <div className={styles.title_container}>
          <Skeleton animation="wave" variant="text" width="100%" height={50} />
      </div>
      <div className={styles.img_container}>
       <Skeleton animation="wave" variant="circular" width="100%" height="100%"/>
      </div>
      <Skeleton animation="wave" variant="text" width="80%" height={50} />
      <div className={styles.input_container}>
        <Skeleton animation="wave" variant="text" width="100%" height={50} />
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
      </div>
    </div>
    )

  const onSubmitClick = async() => {
    try {
      if(city!==""){
        await db.collection("team").doc(city).collection("users").doc(user.uid).set({
          additionalData: profileData
        })
        await db.collection("team_admin").doc(city).collection("users").doc(user.uid).set({})
      }
      setUserData({...values})
      console.log(values)
      await db.collection("user").doc(user.uid).set({
        ...values
      })
      alert("적용되었습니다.")
      
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className={styles.main_container}>
      <PageHeader text="프로필 편집" />


      <div className={styles.img_container}>
        {!isImageURLLoading ?
          <Image src={values.photoUrl==="default_avatar.png"? `/${values.photoUrl}` : values.photoUrl} quality={75} alt={"유저 프로필 사진"} 
            layout="fill" objectFit="cover" objectPosition="center" priority={true} />
          :
          <CircularProgress />
        }
      </div>
      <label htmlFor="input_file" className={styles.img_button} >사진 편집</label><input onChange={onImgChange} type="file" id="input_file" accept="image/*" className={styles.hide_input} />

      <div className={styles.border} />
      <div className={styles.form_container}>


        <div className={styles.single_checkbox_container} >
          <TextField multiline id='textarea-outlined' placeholder='' label="닉네임" variant="standard"
            style={{ width: "100%", marginTop: "12px" }} value={values.displayName} onChange={onValuesChange("displayName")} />
        </div> 
        <div className={styles.single_checkbox_container}>
          <TextField multiline id='textarea-outlined' label="실명" variant="standard" placeholder="실명을 작성해주세요."
            style={{ width: "100%", marginTop: "12px" }} value={values.realName} onChange={onValuesChange("realName")} />
        </div> 
        <div className={styles.single_checkbox_container}>
          <TextField multiline id='textarea-outlined' label="전화번호" variant="standard" placeholder="010-xxxx-xxxx"
            style={{ width: "100%", marginTop: "12px" }} value={values.phoneNumber} onChange={onValuesChange("phoneNumber")} />
        </div> 


        <div className={styles.team_select}>
          <TextField
            id="standard-select-currency"
            select
            label="센터 선택"
            value={city}
            onChange={handleChange}
            helperText="관심있는 센터를 선택해 그에 맞는 프로필을 작성하세요!"
            variant="standard"
            style={{width: "100%"}}
          >
            {teamList.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.teamName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {isProfileFormLoading ? <CircularProgress sx={{ mt: 3 }} /> :
          mainData && <Form formDatas={mainData} data={profileData} handleData={handleProfileDataChange}/>
        }
      </div>
      {/* <Form formDatas={mainData} data={profileData} setData={setProfileData} /> */}
      {/* <Form datas={subForm} /> */}
      <Button variant="text" sx={{ fontSize: "17px", height:"fit-content" }} onClick={onSubmitClick}>저 장</Button>
      <div style={{marginBottom:"130px"}} />
    </div>
  )
}

export default MyProfile