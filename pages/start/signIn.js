import SignInCompo from "src/start/SignIn"

const SignIn = () => {
  return(
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
        <SignInCompo />
      </div>
    </div>
  )
}

export default SignIn