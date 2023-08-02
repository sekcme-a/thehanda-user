import { auth } from "firebase/firebase";
import { useEffect, useState } from "react";
import useUserData from "context/userData";
import useData from "context/data";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";

import FullScreenLoader from "../components/FullScreenLoader";


export default function AuthStateChanged({ children, setIsLoading }) {
    const {setUser, setUserData} = useUserData()
    // const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
  
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
        //로그인시
        if (user !== null ) {
          if(user.providerData[0].providerId!=="phone"){
            setUser(user)
            db.collection("user").doc(user.uid).get().then((doc) => {
              if (doc.exists)
                setUserData(doc.data())
              else{
                const newUserData = {
                  photoUrl : user.photoURL ? user.photoURL : "/default_avatar.png",
                  displayName : "",
                  roles: ["user"],
                  realName:"",
                  phoneNumber: sessionStorage.getItem("phoneNumber"),
                  phoneVerified: sessionStorage.getItem("isPhoneVerificated"),
                  email: user.email,
                  emailVerified: user.emailVerified,
                  providerId: user.providerData[0].providerId,
                  isAlarmOn: true,
                  uid: user.uid,
                  createdAt: new Date()
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
          if(!router.pathname.includes("/preview") && !router.pathname.includes("/test/article") && !router.pathname.includes("/test/programs") && !router.pathname.includes("/test/surveys"))
          {
            router.push("/start/walkthrough")
          }
            
        }
    })
  }, []);

  // if(isLoading)return <FullScreenLoader isLoading={isLoading} />

  return children;
}