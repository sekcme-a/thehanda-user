import Image from "next/image"
import ForgotPasswordComponent from 'src/forgotpassword/component/ForgotPassword'

import logo_img from "public/logo_2zsoft_no_text.png"
import background_img from "public/admin_forgot_password_background.png"
import tree_img from "public/admin_login_tree.png"
import PageHeader from "src/public/components/PageHeader"


const STYLE={
  width:"100%",
  display: "flex",
  justifyContent:"center",
  marginTop: "35px"
}
const ForgotPassword = () => {


  return (
    <>
    <PageHeader text="비밀번호 찾기" />
    <div style={STYLE}>
      
      <ForgotPasswordComponent/>
    </div>
    </>
  )
}

export default ForgotPassword