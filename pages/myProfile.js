import { useEffect, useState } from "react"
import styles from "src/myProfile/MyProfile.module.css"
import { useRouter } from "next/router"
import Image from "next/image"

import useData from "context/data"
import useUserData from "context/userData"
// import { handleProfileImage } from "src/public/hooks/handleProfileImage"
import { firestore as db } from "firebase/firebase"
import DaumPostcode from "react-daum-postcode";

import PageHeader from "src/public/components/PageHeader"
import Form from "src/public/form/Form.js"
import DateTime from "src/public/form/items/DateTime"

import CircularProgress from '@mui/material/CircularProgress'
import Skeleton from '@mui/material/Skeleton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box' 
import { TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
// import { TimePicker } from '@mui/x-date-pickers'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import CustomAlert from "src/public/components/CustomAlert";
import { Button, Checkbox, FormHelperText, TextField } from "@mui/material";
import { MyProfileDB } from "src/myProfile/MyProfileDB"

const MyProfile = () => {
  const router = useRouter()
  const { user, userData, setUserData,} = useUserData()
  const {centerList, setCenterList, centerProfileSettingsList, setCenterProfileSettingsList} = useData()

  const [team, setTeam] = useState(userData?.selectedTeamId)

  // const [image, setImage] = useState(user.photoURL)
  const [isImageURLLoading, setIsImageURLLoading] = useState(false)
  const [mainData, setMainData] = useState()
  const [subData, setSubData] = useState()
  const [profileData, setProfileData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProfileFormLoading, setIsProfileFormLoading] = useState(false)
  const [values, setValues] = useState({
    displayName: "",
    phoneNumber: "",
    birth: new Date().getDate(),
    gender: "",
    postNumber:"",
    address:"",
    detailAddress:"",
    allowTermsOfUse: false,
    allowPrivatePolicy: false,
    isMulticulture: ""
  })
  const [error, setError] = useState({
    type: "",
    text:""
  })
  const [customAlert, setCustomAlert] = useState({
    title:"",
    content:"",
    open: false,
    type:"",
    result: true,
  })
  const [isPostcodeVisible, setIsPostcodeVisible] = useState(false);

  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const onBirthChange = (e) => {setValues({...values, ["birth"]: e})}

  const onPhoneNumberChange = (event) => {
    // Remove non-numeric characters from the input value
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    // You can handle the numeric value as needed
    setValues({...values, phoneNumber: numericValue})
  }

  const handleAddress = (data) => {
    const { zonecode, roadAddress } = data;
    setValues({
      ...values,
      address: roadAddress,
      postNumber: zonecode,
    });
    setIsPostcodeVisible(false);
  };

  const validateValues = () => {
    setError({
      type: "",
      text:""
    })
    if(values.displayName.trim()===""){
      setError({ type: "displayName", text: `닉네임은 필수항목입니다.` });
      setCustomAlert({
        title:"닉네임 미입력",
        id:"displayName",
        content:"필수항목들을 모두 입력해주세요.",
        open: true,
        type:"alert"
      })
      return false
    } else if(values.realName.trim()===""){
      setError({ type: "realName", text: `실명은 필수항목입니다.` });
      setCustomAlert({
        title:"실명 미입력",
        id:"realName",
        content:"필수항목들을 모두 입력해주세요.",
        open: true,
        type:"alert"
      })
      return false
    } else if (values.gender===""){
      setError({ type: "gender", text: `성별은 필수항목입니다.` });
      setCustomAlert({
        title:"성별 미입력",
        id:"gender",
        content:"필수항목들을 모두 입력해주세요.",
        open: true,
        type:"alert"
      })
      return false
    } else if (values.isMulticulture===""){
      setError({ type: "isMulticulture", text: `다문화가족 여부는 필수항목입니다.` });
      setCustomAlert({
        title:"다문화가족 여부 미입력",
        id:"isMulticulture",
        content:"필수항목들을 모두 입력해주세요.",
        open: true,
        type:"alert"
      })
      return false
    } else if(values.birth.toDateString()===new Date().toDateString()){
      setError({type: "birth", text:"생년월일은 오늘이 될 수 없습니다."})
      setCustomAlert({
        title:"생년월일 형식 오류",
        content:"생년월일은 오늘이 될 수 없습니다.",
        open: true,
        type:"alert"
      })
      return false
    } else if(values.birth.getTime()>new Date().getTime()){
      setError({type:"birth", text:"생년월일은 미래의 시간이 될 수 없습니다."})
      setCustomAlert({
        title:"생년월일 형식 오류",
        content:"생년월일은 미래의 시간이 될 수 없습니다.",
        open: true,
        type:"alert"
      })
      return false
    } else if(!values.allowTermsOfUse){
      setCustomAlert({
        title:"이용약관 동의가 필요합니다.",
        content:"회원 이용 약관 동의는 필수입니다.",
        open: true,
        type:"alert"
      })
      return false
    } else if(!values.allowPrivatePolicy){
      setCustomAlert({
        title:"이용약관 동의가 필요합니다.",
        content:"개인정보 수집/이용에 관한 사항 이용 약관 동의는 필수입니다.",
        open: true,
        type:"alert"
      })
      return false
    } else
      return true;
  }


  
  const handleChange = async (event) => {
    setTeam(event.target.value);
    fetch_center_profile_settings(event.target.value)
  };
  
  // const handleProfileDataChange = (data) => {
  //   setProfileData([...data])
  // }

  const fetch_center_profile_settings = async (teamId) => {
    setIsProfileFormLoading(true)
    if(!centerProfileSettingsList[teamId]){
      const profileSettings = await MyProfileDB.FETCH_PROFILE_SETTINGS(teamId)
      setCenterProfileSettingsList({...centerProfileSettingsList, [teamId]: profileSettings})
      const profileDoc = await db.collection("team").doc(teamId).collection("users").doc(user.uid).get()
      if(profileDoc.exists && profileDoc.data().additionalData){
        setProfileData([...profileDoc.data().additionalData])
      }
    }
    setIsProfileFormLoading(false)
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userDoc = await db.collection("user").doc(user.uid).get()
        if(!centerList){
          const team_temp = await MyProfileDB.FETCH_CENTER_LIST()
          setCenterList(team_temp)
        }
        if(user)
          fetch_center_profile_settings(team)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
      }
    }
    setValues({...userData, birth: userData?.birth?.toDate()})
    console.log(userData)
    fetchData()
  }, [])


  // const onImgChange = async (e) => {
  //   try {
  //     setIsImageURLLoading(true)
  //     alert("asdf")
  //     const photoURL = await handleProfileImage(e.target.files[0], `profile/${user.uid}`,1)
  //     setValues({...values, photoUrl:photoURL})
  //     // setUserData({...userData, photoUrl: photoURL})
  //     setIsImageURLLoading(false)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }



  const onSubmitClick = async() => {
    try {
      if(validateValues()===true){
        //send info to db
        try{
          setIsSubmitting(true)
          await MyProfileDB.UPDATE_USER_INFO(user.uid, values, profileData, team)
          setIsSubmitting(false)
          setUserData({...values})
          onNext()
        }catch(e){
          setIsSubmitting(false)
        }
      } else return;

      setCustomAlert({
        title:"적용 성공",
        content:"성공적으로 적용되었습니다.",
        open: true,
        type:"alert",
      })
      
    } catch (e) {
      console.log(e)
    }
  }

  const handleProfileDataChange = (data) => {
    setProfileData([...data])
  }




  if (isLoading)
    return (
      // <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
   <div className={styles.main_container}>
      <div className={styles.title_container}>
          <Skeleton animation="wave" variant="text" width="100%" height={50} />
      </div>
      {/* <div className={styles.img_container}>
       <Skeleton animation="wave" variant="circular" width="100%" height="100%"/>
      </div>
      <Skeleton animation="wave" variant="text" width="80%" height={50} /> */}
      <div className={styles.input_container}>
        <Skeleton animation="wave" variant="text" width="100%" height={50} />
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
        <p style={{marginBottom:"10px"}}><Skeleton animation="wave" variant="text" width="100%" height={50} /></p>
      </div>
    </div>
    )


  return (
    <div className={styles.main_container}>
      <PageHeader text="프로필 편집" />


      {/* <div className={styles.img_container}>
        {!isImageURLLoading ?
          <Image priority src={values.photoUrl==="default_avatar.png"? `/${values.photoUrl}` : values.photoUrl} quality={75} alt={"유저 프로필 사진"} 
            layout="fill" objectFit="cover" objectPosition="center" priority={true} />
          :
          <CircularProgress />
        }
      </div>
      <label htmlFor="input_file" className={styles.img_button} >사진 편집</label>
      <input onChange={onImgChange} type="file" id="input_file"  className={styles.hide_input} />

      <div className={styles.border} /> */}
      <div className={styles.form_container}>
      <TextField
          fullWidth value={values.displayName} onChange={onValuesChange("displayName")} variant="standard" label="닉네임*" placeholder="닉네임을 입력해주세요." sx={{mt:"10px"}}
          error={error.type==="displayName"} helperText={error.type==="displayName" && error.text}
        />
        <TextField
          fullWidth value={values.realName} onChange={onValuesChange("realName")} variant="standard" label="실명*" placeholder="실명을 입력해주세요."sx={{mt:"10px"}}
          error={error.type==="realName"} helperText={error.type==="realName" && error.text}
        />
        <div style={{display:"flex", alignItems:"center"}}>
          <TextField
            fullWidth value={values.phoneNumber} onChange={onPhoneNumberChange} variant="standard" label="핸드폰 번호"sx={{mt:"10px"}}
            error={error.type==="phoneNumber"} helperText={error.type==="phoneNumber" && error.text} disabled={false}
            inputProps={{
              inputMode: 'numeric',
            }}
          />
          {/* <Button variant="text" style={{width:"140px"}} onClick={()=>router.push("/phoneVerification")}>번호 변경</Button> */}
        </div>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: "20px" }} className='demo-space-x'>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileDatePicker
              label="생년월일*"
              value={values.birth}
              onChange={onBirthChange}
              renderInput={params => <TextField {...params} sx={{ width: "100%" }} variant="standard"/>}
              error={error.type==="birth"}
              helperText={error.type==="birth" && error.text}
            />
          </LocalizationProvider>
        </Box>


        <FormControl fullWidth variant="standard" error={error.type==="gender"} helperText={error.type==="gender" && error.text} sx={{mt:"10px"}}>
          <InputLabel id="simple-select-label">성별*</InputLabel>
          <Select
            fullWidth
            value={values.gender}
            label="성별"
            onChange={onValuesChange("gender")}
            variant="standard"
          >
            <MenuItem value="남성">남성</MenuItem>
            <MenuItem value="여성">여성</MenuItem>
            <MenuItem value="기타">기타</MenuItem>
          </Select>
          <FormHelperText>{error.type==="gender" && error.text}</FormHelperText>
        </FormControl>

        <FormControl fullWidth variant="standard" error={error.type==="isMulticulture"}
          helperText="'다문화가족'은 [재한외국인 처우 기본법] 제2조제3호의 결혼이민자와 [국적법] 제2조부터 제4조까지의 규정에 따라 대한민국 국적을 취득한 자로 이루어진 가족 또는 [국적법] 제3조 및 제4조에 따라 대한민국 국적을 취득한 자와 같은 법 제2조부터 제4조까지의 규정에 따라 대한민국 국적을 취득한 자로 이루어진 가족을 의미합니다."
          sx={{mt:"10px"}}
        >
          <InputLabel id="simple-select-label">다문화가족 여부*</InputLabel>
          <Select
            fullWidth
            value={values.isMulticulture}
            label="다문화가족 여부*"
            onChange={onValuesChange("isMulticulture")}
            variant="standard"
          >
            <MenuItem value={true}>예</MenuItem>
            <MenuItem value={false}>아니요</MenuItem>
          </Select>
          <FormHelperText>{"다문화가족은 [재한외국인 처우 기본법] 제2조제3호의 결혼이민자와 [국적법] 제2조부터 제4조까지의 규정에 따라 대한민국 국적을 취득한 자로 이루어진 가족 또는 [국적법] 제3조 및 제4조에 따라 대한민국 국적을 취득한 자와 같은 법 제2조부터 제4조까지의 규정에 따라 대한민국 국적을 취득한 자로 이루어진 가족을 의미합니다."}</FormHelperText>
        </FormControl>

        <div className={styles.address_container}>
          <TextField type='number' id='form-props-number' placeholder="우편번호를 입력해주세요" label="우편번호" variant="standard" style={{width: "55%"}}
            value={values.postNumber} onChange={onValuesChange("postNumber")} InputLabelProps={{ shrink: true }}
          />
          <Button variant="text" onClick={()=>setIsPostcodeVisible(true)}>우편번호 찾기</Button>
        </div>
          {isPostcodeVisible && (
            <div>
              <DaumPostcode
                onComplete={handleAddress}
                autoClose
                animation
                height={500}
              />
            </div>
          )}
        <TextField multiline id='textarea-outlined' placeholder='주소' label='주소'variant="standard"
          style={{ width: "100%", marginTop: "5px" }} value={values.address} onChange={onValuesChange("address")} maxRows={2} />
        <TextField multiline id='textarea-outlined' placeholder='상세주소' label='상세주소'variant="standard"
          style={{ width: "100%", marginTop: "5px" }} value={values.detailAddress} onChange={onValuesChange("detailAddress")} maxRows={2} />


        <div className={styles.team_select}>
          <TextField
            id="standard-select-currency"
            select
            label="센터 선택"
            value={team}
            onChange={handleChange}
            helperText="관심있는 센터를 선택해 그에 맞는 프로필을 작성하세요!"
            variant="standard"
            style={{width: "100%"}}
          >
            {centerList.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.teamName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div style={{height:"10px"}} />
        {isProfileFormLoading ? <CircularProgress sx={{ mt: 3 }} /> :
          centerProfileSettingsList[team] && <Form formDatas={centerProfileSettingsList[team]} data={profileData} handleData={handleProfileDataChange} noBorder={true}/>
        }
      </div>
      {/* <Form formDatas={mainData} data={profileData} setData={setProfileData} /> */}
      {/* <Form datas={subForm} /> */}
      <Button variant="text" sx={{ fontSize: "17px", height:"fit-content" }} onClick={onSubmitClick} disabled={isSubmitting}>{isSubmitting ? "제출 중": "저 장"}</Button>
      <div style={{marginBottom:"130px"}} />
      <CustomAlert alert={customAlert} setAlert={setCustomAlert}/>
    </div>
  )
}

export default MyProfile