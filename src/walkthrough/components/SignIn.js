import { useState, useEffect } from "react";
import useData from "context/data";
import { useRouter } from "next/router";
import styles from "../styles/SignIn.module.css"
import { firestore as db, auth } from "firebase/firebase";
import Link from "next/link";

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
import { Button, Input } from "@mui/material";

import ChevronLeft from 'mdi-material-ui/ChevronLeft'

const InputUserData = ({setMode, onNext}) => {
  const [isLoading, setIsLoading] = useState(true)
  const {user} = useData()
  const router = useRouter()
  const [isDataInfo, setIsDataInfo] = useState(false)
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const [isSigningIn, setIsSigningIn] = useState(false)
  
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

  const onSignInClick = async() => {
    setError("")
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
    try{
      await createUserWithEmailAndPassword(values.email, values.password)
      onNext()
    }catch(e){
      alert(e.message)
    }
    
  }

	const createUserWithEmailAndPassword = async (email, password) => {
    setIsSigningIn(true)
		if (email && password) {
			try{
        sessionStorage.setItem("ps", password)
        const userCred = await auth.createUserWithEmailAndPassword(email,password)
        setIsSigningIn(false)

        // setUser(user??null)
        // if(userCred.user){
        //   router.push("/")
        // }
      } catch(e){
        console.log(e.message)
        setIsSigningIn(false)
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


  useEffect(()=>{

  },[])

  return(
    <>
      <div className={styles.main_container}>
       <h1>SignIn</h1>
       <TextField
        fullWidth
        variant="standard"
        label="이메일"
        value={values.email}
        helperText={error ==="이메일 주소를 입력해주세요." || error ==="이미 등록된 이메일 주소입니다." ? error : "비밀번호 찾기 시 해당 이메일로 메세지가 전송됩니다."? error : "유효하지 않은 이메일 입니다."}
        error={error ==="이메일 주소를 입력해주세요." || error==="이미 등록된 이메일 주소입니다." || error==="유효하지 않은 이메일 입니다."}
        size="small"
        margin="normal"
        onChange={onValuesChange("email")}
        style={{ width: "100%", marginTop: "18px" }}
      />
      <p>*실제 사용중인 이메일을 입력해주세요. 비밀번호 찾기 시 해당 이메일로 비밀번호 변경 메세지가 전송됩니다.</p>
      <FormControl sx={{mb:1, width: '100%'}} variant="standard">
        <InputLabel htmlFor="outlined-adornment-password" >비밀번호</InputLabel>
        <Input
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

      <FormControl sx={{mb:5, width: '100%'}} variant="standard">
        <InputLabel htmlFor="outlined-adornment-password" style={{backgroundColor:"white", paddingRight:"2px"}} >비밀번호 재확인</InputLabel>
        <Input
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


      <Button onClick={onSignInClick} fullWidth variant="contained" disabled={isSigningIn}>{isSigningIn ? "확인 중":"회원가입"}</Button>
      
      <Button onClick={()=>setMode("login")} style={{marginTop:"20px"}} fullWidth>{"< 로그인으로 돌아가기"}</Button>
      </div>
    </>
  )
}

export default InputUserData