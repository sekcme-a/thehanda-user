import { useEffect, useState } from "react";
import { auth } from "firebase/firebase";
import { useRouter } from "next/router";
import { Button, Input, TextField } from "@mui/material"
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import PasswordIcon from '@mui/icons-material/Password';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState({
    email: "",
    pw: ""
  })
  const [logingIn, setLogingIn] = useState(false)
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    error: ""
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onForgotPasswordClick = () => {
    router.push("/start/forgotPassword")
  }
  const onSignInClick = () => {
    router.push("/start/signIn")
  }
  
  const onLoginClick = async() => {
    setLogingIn(true)
    if(!email)
      setError({...error, email:"이메일을 입력해주세요."})
    else if (!values.password)
      setError({...error, pw: "비밀번호를 입력해주세요."})
    else{
      try {
        await auth.signInWithEmailAndPassword(email, values.password);
        router.push("/start/selectTeam")
      } catch (e) {
        switch (e.message) {
          case "The email address is badly formatted.":
            setError({...error, email: "유효하지 않은 이메일 입니다."});
            break;
          case "There is no user record corresponding to this identifier. The user may have been deleted.":
          case "The password is invalid or the user does not have a password.":
            setError({email: "이메일이나 비밀번호가 틀렸습니다.", pw: "이메일이나 비밀번호가 틀렸습니다."});
            break;
          case "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.":
            setError({pw:"로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 해제되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다."});
            break;
          default:
            console.log(error);
            break;
        }
      }
    }
    setLogingIn(false)
  }
  
  return(
    <div class="l-form">
      <div class="shape1"></div>
      <div class="shape2"></div>
      <div class="form">
        <img src="assets/img/authentication.svg" alt="" class="form__img" />

        <form action="" class="form__content">
            <h1 class="form__title">Login</h1>
  
            <TextField  variant="standard" placeholder="이메일"        
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MarkunreadIcon />
                  </InputAdornment>
                ),
              }}
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              sx={{mb:"10px"}}
              fullWidth
              error={error.email!==""}
              helperText={error.email!=="" && error.email}
            />

            <FormControl sx={{mt:"0"}} variant="standard" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password" >비밀번호</InputLabel>
              <Input
                id="outlined-adornment-password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                style={{paddingTop:0, paddingBottom:0}}
                onChange={handleChange('password')}
                error={error.pw!==""}
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
              {error.pw !== "" && <FormHelperText id="component-error-text" error={error.pw!==""}>{error.pw}</FormHelperText>}
            </FormControl>



            
            <div class="form__forgot"><Button onClick={onForgotPasswordClick} sx={{mt:"12px"}}>비밀번호를 잊으셨나요?</Button></div>

            
            <Button variant="contained" fullWidth onClick={onLoginClick} disabled={logingIn}>{logingIn ? "확인 중" : "로그인"}</Button>
            <Button variant="contained" fullWidth onClick={onSignInClick} sx={{mt:"20px", backgroundColor:"#b699e8"}}>회원가입</Button>
                  
            <div class="form__social">
            </div>
        </form>
      </div>
    </div>
  )
}

export default Login