import { useState, useEffect } from "react";
import useData from "context/data";
import useUserData from "context/userData";
import { useRouter } from "next/router";
import styles from "./InputUserData.module.css"
import { auth } from "firebase/firebase";
import DaumPostcode from "react-daum-postcode";

import {termsOfUse, privatePolicy} from "./termsOfUse"

import { Button, Checkbox, FormHelperText, TextField } from "@mui/material";
import Box from '@mui/material/Box' 
import { TimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers'
import { MobileDateTimePicker } from '@mui/x-date-pickers'
// import { TimePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import CustomAlert from "src/public/components/CustomAlert";

import { DB } from "./InputUserDataDB";


const InputUserData = ({onNext, onPrev}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({
    displayName: "",
    displayName: "",
    birth: new Date(),
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
  const {user, userData} = useUserData()
  const router = useRouter()

  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  useEffect(()=>{
    console.log(userData)
  },[])

  const onBirthChange = (e) => {
    setValues({...values, ["birth"]: e})
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

  const onSubmitClick = async () => {
    if(validateValues()===true){
      //send info to db
      try{
        setIsLoading(true)
        await DB.UPDATE_USER_INFO(user.uid, values)
        setIsLoading(false)
        router.push("/start/selectTeam")
      }catch(e){
        setIsLoading(false)
        console.log(e.message)
      }
    }
  }

  const validateValues = () => {
    // if(value.displayName.trim()==="")
    //   setError("displayName")
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
  
  const onPrevClick = () => {
    auth.signOut()
    onPrev()
  }

  return(
    <>
      <div className={styles.main_container}>
        {/* <h1 className={styles.title}>Step 1/3</h1>
        <div className={styles.title_border}></div> */}
        <h2 className={styles.subtitle}>사용자 정보를 입력해주세요.</h2>
        <TextField
          fullWidth value={values.displayName} onChange={onValuesChange("displayName")} variant="standard" label="닉네임*" placeholder="닉네임을 입력해주세요." sx={{mt:"10px"}}
          error={error.type==="displayName"} helperText={error.type==="displayName" && error.text}
        />
        <TextField
          fullWidth value={values.realName} onChange={onValuesChange("realName")} variant="standard" label="실명*" placeholder="실명을 입력해주세요."sx={{mt:"10px"}}
          error={error.type==="realName"} helperText={error.type==="realName" && error.text}
        />


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

        {/* <div className={styles.address_container}>
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
       */}

        <div className={styles.termsOfUse_container}>
          <h1 className={styles.terms_title}>회원 이용 약관*</h1>
          <div className={styles.info_container}>
            {termsOfUse.map((item, index) => {
              return(
                <div key={index} className={styles.item_container}>
                  <h1 className={styles.item_title}>{item.title}</h1>
                  <p className={styles.item_content}>{item.content}</p>
                </div>
              )
            })}
          </div>
          <div className={styles.confirm_container}>
            <Checkbox
              checked={values.allowTermsOfUse}
              onChange={(e)=>{setValues({...values, ["allowTermsOfUse"]: e.target.checked})}}
            />
            <p>본인은 상기 내용을 확인하였으며 위와 같이 회원 이용 약관에 동의합니다.</p>
          </div>
        </div>


        <div className={styles.termsOfUse_container}>
          <h1 className={styles.terms_title}>개인정보 수집/이용에 관한 사항*</h1>
          <div className={styles.info_container}>
            {privatePolicy.map((item, index) => {
              return(
                <div key={index} className={styles.item_container}>
                  <h1 className={styles.item_title}>{item.title}</h1>
                  <p className={styles.item_content}>{item.content}</p>
                </div>
              )
            })}
          </div>
          <div className={styles.confirm_container}>
            <Checkbox
              checked={values.allowPrivatePolicy}
              onChange={(e)=>{setValues({...values, ["allowPrivatePolicy"]: e.target.checked})}}
            />
            <p>본인은 상기 내용을 확인하였으며 위와 같이 회원 이용 약관에 동의합니다.</p>
          </div>
        </div>

        <Button onClick={onSubmitClick} variant="contained" fullWidth sx={{mt:"30px", mb:"40px"}} disabled={isLoading}>{isLoading ? "제출 중":"다음"}</Button>
        <Button onClick={onPrevClick}>이전으로</Button>
        {/* <Button onClick={()=>{auth.signOut(); router.push("/")}}>로그아웃</Button> */}
        <CustomAlert alert={customAlert} setAlert={setCustomAlert}/>
      </div>
    </>
  )
}

export default InputUserData