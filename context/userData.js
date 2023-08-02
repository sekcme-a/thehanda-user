import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";
import { DB } from "./dataDB";
import FullScreenLoader from "src/public/components/FullScreenLoader";
const dataContext = createContext()

export default function useUserData(){
    return useContext(dataContext)
}

export function UserDataProvider(props){
  const [user, setUser] = useState(null) //I'm
  const [userData, setUserData] = useState(null) //user data from db, uid 를 제외한 모든 user data는 이걸 활용

  const value = {
    user, setUser,
    userData, setUserData,
  }
  

  return <dataContext.Provider value={value} {...props} />
}