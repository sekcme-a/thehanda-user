import styles from "src/card/editBenefit.module.css"
import { useEffect, useState } from "react"
import useUserData from "context/userData"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"
import PageHeader from "src/public/components/PageHeader"

import { TextField, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from "@mui/material"

import { handleProfileImage } from "src/public/hooks/handleProfileImage"
import Image from "next/image"
import useData from "context/data"

const typeList = [
  "음식점",
  "카페",
  "서비스",
  "기타"
]

const EditBenefit = () => {
  const {user, userData} = useUserData()
  const {locationList, SET_LOCATION_LIST} = useData()
  const router = useRouter()
  const [isImageURLLoading, setIsImageURLLoading] = useState(false)

  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  //*****for inputs
  const [values, setValues] = useState({
    location: "",
    logoURL:"",
    companyName: "",
    benefitSummary:"",
    benefit:"",
    locationDetail:"",
    info:"",
    workTime:"",
    phone:"",
    facilities:"",
    infoSummary: "",
    isPublished: false,
    type:""
  })
  const onValuesChange = (prop) => (event) => {
      setValues(prevValues => ({...prevValues, [prop]: event.target.value}))
  }
  const handleValues = (type, value) => {
    setValues(prevValues => ({ ...prevValues, [type]: value }))
  }
  const [error, setError] = useState({
    type:"",
    message:""
  })
  const handleError = (type, message) => { setError({type: type, message: message})}
  //for inputs*****



  useEffect(()=> {
    const fetchData = async () => {
      if(userData){
        if(userData.hasBenefitPost){
          if(!locationList)
            await SET_LOCATION_LIST()
          const doc = await db.collection("benefit").doc(user.uid).get()
          if(doc.exists)
            setValues({...values, ...doc.data()})
          
        } else {
          alert("제휴 신청을 하셔야 게시물을 등록하실 수 있습니다.")
          router.push('/card/benefitRequest')
        }
      }
    }
    fetchData()
      
  },[])

  const onImgChange = async (e) => {
    try {
      setIsImageURLLoading(true)
      const logoURL = await handleProfileImage(e.target.files[0], `benefit/${user.uid}/logo`,1)
      setValues({...values, logoURL:logoURL})
      // setUserData({...userData, photoUrl: photoURL})
      setIsImageURLLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  const isValid = () => {
    console.log(values.info)
    if(!values.location){setError({type:"location", message:"위치는 필수항목입니다."}); return false}
    else if(!values.type){setError({type:"type", message:"종류는 필수항목입니다."}); return false}
    else if(!values.logoURL){setError({type:"logoURL", message:"로고는 필수항목입니다."}); return false}
    else if(!values.companyName){setError({type:"companyName", message:"업체명은 필수항목입니다."}); return false}
    else if(!values.benefitSummary){setError({type:"benefitSummary", message:"혜택요약은 필수항목입니다."}); return false}
    else if(!values.infoSummary){setError({type:"infoSummary", message:"소개 요약은 필수항목입니다."}); return false}
    else if(!values.info){setError({type:"info", message:"업체 소개는 필수항목입니다."}); return false}
    else if(!values.benefit){setError({type:"benefit", message:"세부혜택은 필수항목입니다."}); return false}
    else return true
  }


  const onSaveClick = async () => {
    setIsSaving(true)
    const valid = isValid()
    if(valid){
      await db.collection("benefit").doc(user.uid).set({...values, savedAt: new Date()})
      setError({type:"",message:""})
      alert("성공적으로 저장되었습니다.")
    }
    setIsSaving(false)
  }

  const onPublishClick = async () => {
    const doc = await db.collection("benefit").doc(user.uid).get()
    if(doc.exists){
      if(!values.isPublished){
        await db.collection("benefit").doc(user.uid).update({isPublished: true})
        setValues({...values, isPublished:true})
        alert("성공적으로 게재되었습니다.")
      }
      else {
        await db.collection("benefit").doc(user.uid).update({isPublished: false})
        setValues({...values, isPublished:false})
        alert("성공적으로 게재취소되었습니다.") 
      }
    } else {
      alert("먼저 게시물을 저장해주세요.")
    }
  }

  return(
    <div className={styles.main_container}>
      <PageHeader text="제휴 게시물 편집" />
      <div className={styles.content_container}>
        <h1>섹션 선택</h1>
        <FormControl fullWidth size="small">
          <InputLabel id="simple-select-label">위치*</InputLabel>
          <Select
            value={values.location}
            label="위치*"
            onChange={onValuesChange("location")}
            error={error.type==="location"}
            helperText={error.type==="location" ? error.message: ""}
          >
          {locationList?.map((loc, index) => (
            <MenuItem value={loc} key={`${loc}_${index}`}>{loc}</MenuItem>
          ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" sx={{mt:"20px"}}>
          <InputLabel id="simple-select-label">종류*</InputLabel>
          <Select
            value={values.type}
            label="종류*"
            onChange={onValuesChange("type")}
            error={error.type==="type"}
            helperText={error.type==="type" ? error.message: ""}
          >
          {typeList?.map((loc, index) => (
            <MenuItem value={loc} key={`${loc}_${index}`}>{loc}</MenuItem>
          ))}
          </Select>
        </FormControl>
        

        <div className={styles.border}/>
        <h1>썸네일 작성</h1>
        {/* <p>*기준에 부합하지 않은 내용이 </p> */}
        <h2>업체 로고</h2>
        <p>*정사각형 사이즈의 로고 이미지</p>
        <div className={styles.logo_container}>
          {values.logoURL && <Image priority width={100} height={100} src={values.logoURL} alt="로고"/>}
          {isImageURLLoading && <CircularProgress />}
          <label htmlFor="input_file" className={styles.img_button} >사진 선택</label>
          <input onChange={onImgChange} type="file" id="input_file"  className={styles.hide_input} />
        </div>
        
        <TextField
          label="업체명*"
          variant="outlined"
          error={error.type==="companyName"}
          helperText={error.type!=="companyName" ? "" : error.message}
          value={values.companyName}
          onChange={onValuesChange("companyName")}
          size="small"
          fullWidth
        />
        <TextField
          label="혜택 요약*"
          variant="outlined"
          error={error.type==="benefitSummary"}
          helperText={error.type!=="benefitSummary" ? "혜택을 요약해서 작성해주세요." : error.message}
          value={values.benefitSummary}
          onChange={onValuesChange("benefitSummary")}
          size="small"
          fullWidth
          sx={{mt:"10px"}}
        />
        <TextField
          label="업체 소개 요약*"
          variant="outlined"
          error={error.type==="infoSummary"}
          helperText={error.type!=="infoSummary" ? "업체 소개를 요약해서 작성해주세요." : error.message}
          value={values.infoSummary}
          onChange={onValuesChange("infoSummary")}
          size="small"
          fullWidth
          sx={{mt:"10px"}}
        />

        <div className={styles.border}/>

        <h1>업체 정보 작성</h1>
          <TextField
            label="업체 소개*"
            variant="outlined"
            error={error.type==="info"}
            helperText={error.type!=="info" ? "" : error.message}
            value={values.info}
            onChange={onValuesChange("info")}
            size="small"
            multiline
            maxRows={5}
            fullWidth
            sx={{mt:"10px"}}
          />
          <TextField
            label="운영시간"
            variant="outlined"
            value={values.workTime}
            onChange={onValuesChange("workTime")}
            size="small"
            multiline
            maxRows={5}
            fullWidth
            sx={{mt:"10px"}}
          />
          <TextField
            label="세부 위치"
            variant="outlined"
            value={values.locationDetail}
            onChange={onValuesChange("locationDetail")}
            size="small"
            multiline
            maxRows={5}
            fullWidth
            sx={{mt:"10px"}}
          />
          <TextField
            label="전화번호"
            variant="outlined"
            value={values.phone}
            onChange={onValuesChange("phone")}
            size="small"
            fullWidth
            sx={{mt:"10px"}}
          />
          <TextField
            label="편의시설"
            variant="outlined"
            value={values.facilities}
            onChange={onValuesChange("facilities")}
            size="small"
            multiline
            maxRows={5}
            fullWidth
            sx={{mt:"10px"}}
          />


        <div className={styles.border}/>

        <h1>세부 혜택 작성</h1>


          <TextField
            label="세부혜택*"
            variant="outlined"
            error={error.type==="benefit"}
            helperText={error.type!=="benefit" ? "" : error.message}
            value={values.benefit}
            onChange={onValuesChange("benefit")}
            size="small"
            fullWidth
            multiline
            maxRows={5}
            sx={{mt:"10px"}}
          />

          <div style={{height:"50px"}} />

          <Button onClick ={onSaveClick} fullWidth variant="contained" color="info"
            disabled={isImageURLLoading || isSaving}>{isSaving ? "적용중..." : "적 용"}</Button>

          <p style={{marginTop:"10px", textAlign:"center"}}>
            {values.isPublished ? "현재 게재중입니다." : "현재 미게재중입니다."}</p>
          <Button onClick ={onPublishClick} fullWidth variant="contained" color={values.isPublished ? "error" : "primary"}
            disabled={isImageURLLoading || isSubmitting}>{values.isPublished ? "게재취소" : "게 재"}</Button>

      
      </div>

    </div>
  )
}

export default EditBenefit