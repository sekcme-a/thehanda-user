import ForgotPasswordCompo from "src/start/ForgotPassword"

const ForgotPassword = () => {
  return(
    <>
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
          <ForgotPasswordCompo/>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword