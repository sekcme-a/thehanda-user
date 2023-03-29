import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";


export default function AuthStateChanged({ children }) {
    const {setUser, setUserData} = useData()
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
        // console.log(user)
        //로그인시
        console.log(user)
        if (user !== null ) {
          if(user.providerData[0].providerId!=="phone"){
            setUser(user)
            db.collection("user").doc(user.uid).get().then((doc) => {
              if (doc.exists)
                setUserData(doc.data())
              else{
                const newUserData = {
                  photoUrl : user.photoURL ? user.photoURL : "/default_avatar.png",
                  displayName : user.displayName ? user.displayName : `User${user.uid.substr(1,5)}`,
                  roles: ["user"],
                  realName: user.displayName ? user.displayName : `User${user.uid.substr(1,5)}`,
                  phoneNumber: sessionStorage.getItem("phoneNumber"),
                  phoneVerified: sessionStorage.getItem("isPhoneVerificated"),
                  email: user.email,
                  emailVerified: user.emailVerified,
                  providerId: user.providerData[0].providerId,
                  isAlarmOn: true,
                  uid: user.uid
                }
                setUserData(newUserData)
                db.collection("user").doc(user.uid).set(newUserData)
              }
              setIsLoading(false)
            })
          } else{
            setIsLoading(false)
          }
        } else{
          //로그아웃시
          setUser(null)
          setUserData(null)
          setIsLoading(false)
          sessionStorage.setItem("phoneNumber", "")
          sessionStorage.setItem("isPhoneVerificated","false")
          // setPhoneNumber("")
          // setIsPhoneVerificated(false)
          // router.replace("/")
        }
    })
    //eslint-disable-next-line
  }, []);
  if(isLoading)return <></>

  return children;
}