import { createContext, useState, useEffect, useContext } from "react";
import { firestore as db } from "firebase/firebase";
const dataContext = createContext()

export default function useData(){
    return useContext(dataContext)
}

export function DataProvider(props){
    const [user, setUser] = useState(null) //I'm
    const [userData, setUserData] = useState(null) //user data from db, uid 를 제외한 모든 user data는 이걸 활용
    const [error, setError] = useState("")
    const [teamName, setTeamName] = useState("") //어드민 팀명
    const [teamId, setTeamId] = useState("") //어드민 팀 id

    const [sectionData, setSectionData] = useState([])
    const [language, setLanguage] = useState("ko")
    const [unread, setUnread] = useState(0)

    useEffect(() => {
      if(user){
        const dbRef = db.collection("user").doc(user.uid).collection("message").doc("status");

        const unsubscribe = dbRef.onSnapshot((doc) => {
          if (doc.exists) {
            setUnread(doc.data().unread);
          }
        });

        return() => {
          unsubscribe()
        }
        
      }
          

      },[user])

    const value = {
        user,
        userData,
        error,
        teamName,
        teamId,
        unread,
        setUnread,
        setTeamId,
        setTeamName,
        setError,
        setUser,
        setUserData,
        sectionData,
        setSectionData,
        language,
        setLanguage
    }

    return <dataContext.Provider value={value} {...props} />
}