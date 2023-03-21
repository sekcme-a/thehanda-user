import react, { useState, useEffect } from "react"
import Link from "next/link";
import styles from "../styles/signIn.module.css"
import useData from "context/data";
import { useRouter } from "next/router";
import logo from "public/logo.png"
import Image from "next/image"
import { firestore as db, auth } from "firebase/firebase";
import dynamic from "next/dynamic";
// const QuillNoSSRWrapper = dynamic(import('react-quill'), {
//   ssr: false,
//   loading: () => <p>로딩중 ...</p>,
// })
import PhoneVerification from "src/public/components/PhoneVerification"

import ReactHtmlParser from "react-html-parser";

import { styled, useTheme } from '@mui/material/styles'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography'

import ChevronLeft from 'mdi-material-ui/ChevronLeft'

const SignIn = () => {
  const { user, setUser} = useData()
  const [isDataInfo, setIsDataInfo] = useState(false)
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
    comfirmPassword: '',
    showConfirmPassword: false,
    userName: "",
    verification: "",
    checked: false,
    phoneNumber: "",
    error: "",
    isPhoneVerificated: false,
  });
  const LinkStyled = styled('a')(({ theme }) => ({
  display: 'flex',
  fontSize: '0.875rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
  }))

  const onCheckboxChange = (e) => {
    setValues({...values, "checked":e.target.checked})
  }

  useEffect(() => {
    setError("")
    const fetchData = async () => {
      const data = await db.collection("setting").doc("private").get()
      if (data.exists) {
        setText(data.data().text)
        console.log(data.data().text)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [])

  useEffect(()=>{
    if(user)
      router.push("/")
  },[user])
  
  const onValuesChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handlePhoneNumber = (value) => {
    setValues({...values, phoneNumber: value})
  }
  const handleIsPhoneVerificated = (value) => {
    setValues({...values, isPhoneVerificated: value})
  }

    const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

    const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const onBackToSignInClick = () => {
    setIsDataInfo(false)
  }

  const onSignInClick = () => {
    if (values.email===undefined || values.email==="") {
      setError("이메일 주소를 입력해주세요.")
      return;
    }
    if (values.password === undefined || values.password === "") {
      setError("비밀번호를 입력해주세요.")
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError("재확인 비밀번호가 다릅니다.")
      return;
    }
    //here
    // if(!values.isPhoneVerificated){
    //   alert("핸드폰번호를 인증해주세요.")
    //   return;
    // }
    if (!values.checked) {
      setError("개인정보처리방침 동의는 필수입니다.")
      return;
    }
    //here
    // setTimeout(()=>{
    //   sessionStorage.setItem("phoneNumber", values.phoneNumber)
    //   sessionStorage.setItem("isPhoneVerificated", "true")
    // },100) 
    createUserWithEmailAndPassword(values.email, values.password)
  }

	const createUserWithEmailAndPassword = async (email, password) => {
		if (email && password) {
			try{
        const userCred = await auth.createUserWithEmailAndPassword(email,password)
        // setUser(user??null)
        if(userCred.user){
          router.push("/")
        }
      } catch(e){
        console.log(e.message)
        if (e.message==="The email address is badly formatted.") {
          setError("유효하지 않은 이메일 입니다.");
          return;
        }
        if (e.message === "Password should be at least 6 characters") {
          setError("비밀번호는 최소 6자리 이상이여야합니다.");
          return;
        }
        if (e.message === "The email address is already in use by another account.") {
          setError("이미 등록된 이메일 주소입니다.");
          return;
        }
        if (e.message) {
          setError(e.message);
          return;
        }
      }
	
		} else {
			setError("이메일와 비밀번호는 빈칸일 수 없습니다.");
		}
	};


  if(isDataInfo && !isLoading)
    return (
    <div className={styles.main_container}>
      <div className={styles.title_container} onClick={onBackToSignInClick}>
        <ArrowBackIosNewIcon style={{fontSize: "15px"}} />
        <p>개인정보 처리방침</p>
      </div>
      <div className={styles.content_container}>
        <div>{ReactHtmlParser(text)}</div>
      </div>
    </div>
  )

  return (
    <>
        <div className={styles.logo_container}>
          <Image src={logo} alt={"한국다문화뉴스 로고"} layout="fill" objectFit="cover" objectPosition="center"/>
        </div>
      <TextField
        fullWidth
        id="outlined-helperText"
        label="이메일"
        value={values.email}
        helperText={error ==="이메일 주소를 입력해주세요." || error ==="이미 등록된 이메일 주소입니다." ? error : "비밀번호 찾기 시 해당 이메일로 메세지가 전송됩니다."}
        error={error ==="이메일 주소를 입력해주세요." || error==="이미 등록된 이메일 주소입니다."}
        size="small"
        margin="normal"
        onChange={onValuesChange("email")}
        style={{ width: "70%", marginTop: "18px" }}
      />
      
      <FormControl sx={{m:1, width: '70%'}} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password" >비밀번호</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          style={{paddingTop:0, paddingBottom:0}}
          onChange={onValuesChange('password')}
          error={error==="비밀번호를 입력해주세요." || error==="비밀번호는 최소 6자리 이상이여야합니다."}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {(error === "비밀번호를 입력해주세요." ||
          error === "비밀번호는 최소 6자리 이상이여야합니다.")
          && <FormHelperText id="component-error-text" error={true} >{error}</FormHelperText>}
      </FormControl>

      <FormControl sx={{m:1, width: '70%'}} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password" style={{backgroundColor:"white", paddingRight:"2px"}} >비밀번호 재확인</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={values.showConfirmPassword ? 'text' : 'password'}
          value={values.confirmPassword}
          style={{paddingTop:0, paddingBottom:0}}
          onChange={onValuesChange('confirmPassword')}
          error={error ==="재확인 비밀번호가 다릅니다."}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownConfirmPassword}
                edge="end"
              >
                {values.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
        {error ==="재확인 비밀번호가 다릅니다." && <FormHelperText id="component-error-text" error={true}>{error}</FormHelperText>}
      </FormControl>

{/* here */}
      {/* <PhoneVerification phoneNumber={values.phoneNumber} handlePhoneNumber={handlePhoneNumber} handleIsPhoneVerificated={handleIsPhoneVerificated}/> */}

      <div className={styles.checkbox_container}>
        <Checkbox
          checked={values.checked}
          onChange={onCheckboxChange}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <p>개인정보처리방침에 동의합니다.</p>
        {error==="개인정보처리방침 동의는 필수입니다." && <p style={{color: "red", marginBottom: '5px'}}>{error}</p>}
      </div>
      <div className={styles.dataInfo_container}>
        <div>{ReactHtmlParser(text)}</div>
      </div>
      <div className={styles.signIn_button} onClick={onSignInClick}>
        회원가입
      </div>
        <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width:"100%", mt: 3 }}>
        <Link passHref href='/login'>
            <LinkStyled>
              <ChevronLeft />
              <span>Back to login</span>
            </LinkStyled>
          </Link>
        </Typography>
      <div style={{margin: "50px"}}/>
    </>
  )
}
export default SignIn