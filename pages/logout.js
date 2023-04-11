import { useEffect, useState } from "react"
import useData from "context/data"
import { auth } from "firebase/firebase"

const Logout = () => {
  const {user} = useData()
  useEffect(()=>{
    if(user){
      alert(user.uid)
      auth.signOut()
    } else {
      alert("not logined")
    }
  },[])
  return(
    <>
      <h1>logout</h1>
    </>
  )
}
export default Logout