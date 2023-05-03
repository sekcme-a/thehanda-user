import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { auth, facebookAuthProvider, firestore, googleAuthProvider, appleAuthProvider, firestore as db, } from "firebase/firebase"
import firebase from "firebase/firebase";
import useData from "context/data";

import ForgotPassword from "src/forgotpassword/component/ForgotPassword";
import SignIn from "./SignIn"

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

const Login = ({onNext}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [logingIn, setLogingin] = useState(false)
  const {user, setUser, setEm, setPs} = useData()

  const [values, setValues] = useState({
    password: '',
    showPassword: false,
    error: ""
  });

  useEffect(() => {
    setError("")
  }, [])


  //handle input
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

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onLoginClick()
    }
  }


  const [mode, setMode] = useState("login")

  const router = useRouter()

  const onForgotPasswordClick = () => {
    setMode("forgotPassword")
  }

  const onLoginClick = async() => {
  // check if email and password are entered
  setLogingin(true)
    if (email && values.password) {
      let userCred;
      let error;

      // attempt to sign in with the provided email and password
      try {
        userCred = await auth.signInWithEmailAndPassword(email, values.password);
        setEm(email)
        localStorage.setItem("ps",values.password)
      } catch (e) {
        // if there's an error, set the error message and log it to the console
        setError(e.message);
        error = e.message;
        console.log(e.message);
      }

      // handle different error cases based on the error message
      if (error) {
        switch (error) {
          case "The email address is badly formatted.":
            setError("유효하지 않은 이메일 입니다.");
            break;
          case "There is no user record corresponding to this identifier. The user may have been deleted.":
          case "The password is invalid or the user does not have a password.":
            setError("이메일이나 비밀번호가 틀렸습니다.");
            break;
          case "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.":
            setError("로그인 시도가 여러 번 실패하여 이 계정에 대한 액세스가 일시적으로 해제되었습니다. 암호를 재설정하여 즉시 복원하거나 나중에 다시 시도할 수 있습니다.");
            break;
          default:
            console.log(error);
            break;
        }
        setLogingin(false)
        return;
      } else{

      // if there's no error, set the user based on the user credential object
      setUser(userCred.user ?? null);
      onNext()
      console.log(userCred.user);
      }
      // redirect to the hallway page using the router
      // router.push("/hallway");

    // handle cases where only email or password is missing
    } else if (values.password) {
      setError("이메일을 입력해주세요.");
    } else if (email) {
      setError("비밀번호를 입력해주세요.");
    }
    setLogingin(false)
  }

  const onSignInClick = () => {
    setMode("signIn")
  }

  // const loginWithApple = async() => {
  //   const provider = appleAuthProvider
  //   try{
  //     const userCred = await auth.signInWithRedirect(provider)
  //     setUser(userCred.user ?? null)
  //   }catch(e){
  //     setError(e.message)
  //   }
  // }

  const loginWithGoogle = async() => {
    const provider = googleAuthProvider
    try{
      const userCred = await auth.signInWithPopup(provider)
      setUser(userCred.user ?? null)
    } catch(e){
      setError(e.message)
    }
      // try {
      //   const provider = new firebase.auth.GoogleAuthProvider();
      //   const result = await firebase.auth().signInWithRedirect(provider);
      //   const { credential } = result;
      //   const { accessToken, idToken } = credential;
      //   const googleCredential = firebase.auth.GoogleAuthProvider.credential(
      //     idToken,
      //     accessToken
      //   );
      //   const userCredential = await firebase.auth().signInWithCredential(googleCredential);
      //   console.log(userCredential.user);
      // } catch (error) {
      //   console.log(error);
      // }

  }

  const loginWithFacebook = async() => {
    const provider = facebookAuthProvider
    try{
      const userCred = await auth.signInWithRedirect(provider)
      setUser(userCred.user ?? null)
    } catch(e){
      setError(e.message)
    }
  }
  

  return(
    <>
      <div class="l-form">
        <div class="shape1"></div>
        <div class="shape2"></div>
        {mode==="login" ? 
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
                />

                <FormControl sx={{mt:"0"}} variant="standard" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-password" >비밀번호</InputLabel>
                  <Input
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    style={{paddingTop:0, paddingBottom:0}}
                    onChange={handleChange('password')}
                    error={error!==""}
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
                  {error !== "" && <FormHelperText id="component-error-text" error={error!==""}>{error}</FormHelperText>}
                </FormControl>



                
                <div class="form__forgot"><Button onClick={onForgotPasswordClick} sx={{mt:"12px"}}>비밀번호를 잊으셨나요?</Button></div>

                
                <Button variant="contained" fullWidth onClick={onLoginClick} disabled={logingIn}>{logingIn ? "확인 중" : "로그인"}</Button>
                <Button variant="contained" fullWidth onClick={onSignInClick} sx={{mt:"20px", backgroundColor:"#b699e8"}}>회원가입</Button>
                      
                <div class="form__social">
                  {/* <span class="form__social-text">Our login with</span> */}

                  {/* <div class="form__social-icon" onClick={loginWithGoogle}>
                    <GoogleIcon sx={{color:"white"}}/>
                  </div> */}
                  {/* <div class="form__social-icon" onClick={loginWithFacebook}>
                    <FacebookIcon sx={{color:"white"}}/>
                  </div> */}

                  {/* <div class="form__social-icon" onClick={loginWithApple}>
                    <AppleIcon sx={{color:"white"}}/>
                  </div> */}
                </div>
            </form>
          </div>

          :
          mode==="signIn" ? 
          <div class="l-form">
            <div class="shape1"></div>
            <div class="shape2"></div>
            <div style={{
              width:"100%",
              display: "flex",
              justifyContent:"center",
              alignItems:"center",
              height:"100vh",
              flexWrap:"wrap"
            }}>
              <SignIn setMode={setMode} onNext={onNext}/>
            </div>
          </div>
          :
          <div class="l-form">
            <div class="shape1"></div>
            <div class="shape2"></div>
            <div style={{
              width:"100%",
              display: "flex",
              justifyContent:"center",
              alignItems:"center",
              height:"100vh"
            }}>
              <ForgotPassword setMode={setMode}/>
            </div>
          </div>
        } 
      </div>
    </>
  )
}
export default Login