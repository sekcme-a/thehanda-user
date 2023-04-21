import { useEffect, useState, useRef } from "react"
import useData from "context/data"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import styles from "src/talk/talk.module.css"
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import HeaderLeftClose from "src/public/components/HeaderLeftClose"


function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

const Talk = () => {
  const router = useRouter()
  const {id} = router.query
  const {user, userData, unread} = useData()
  const [dates, setDates] = useState([])
  const messagesRef = useRef(null);
  const [input, setInput] = useState("")
  const [isShiftPress, setIsShiftPress] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [profile, setProfile] = useState("")
	const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(()=>{
    const fetchData = async () => { 
      const dbRef = db.collection("team").doc(id).collection("message").doc(user.uid).collection("date").orderBy("date", "desc").limit(30)
      const unsubscribe = dbRef.onSnapshot(async(querySnapshot) => {
        if(!querySnapshot.empty){
          const data = querySnapshot.docs.map((doc)=>{
            return({
              ...doc.data(),
              timeline: doc.id
            })
          })
          setDates([...data.reverse()])
						setTimeout(()=>{
							scrollToBottom()
						},300)
        }
      })

      const teamDoc = await db.collection("team").doc(id).get()
      if(teamDoc.exists){
        setTeamName(teamDoc.data().teamName)
        setProfile(teamDoc.data().profile)
      }

      const doc = await db.collection("user").doc(user.uid).collection("message").doc(id).get()
      if(doc.exists && doc.data().unread!==0){
        if(unread-doc.data().unread>=0){
          await db.collection("user").doc(user.uid).collection("message").doc("status").set({
            unread: unread-doc.data().unread
          })
        } else{
          await db.collection("user").doc(user.uid).collection("message").doc("status").set({
            unread: 0
          })
        }
        await db.collection("user").doc(user.uid).collection("message").doc(id).update({
          unread: 0
        })
      }
    
  
      return () => {
        unsubscribe()
      }
    }
    if(user)
      fetchData()
    else 
      router.push("/login")


  },[])

  useEffect(()=>{
    const fetchData = async () => {
      const doc = await db.collection("user").doc(user.uid).collection("message").doc(id).get()
      if(doc.exists && doc.data().unread!==0){
        if(unread-doc.data().unread>=0){
          await db.collection("user").doc(user.uid).collection("message").doc("status").set({
            unread: unread-doc.data().unread
          })
        } else{
          await db.collection("user").doc(user.uid).collection("message").doc("status").set({
            unread: 0
          })
        }
        await db.collection("user").doc(user.uid).collection("message").doc(id).update({
          unread: 0
        })
      }
    }
    fetchData()
  },[dates])

	// useEffect(()=>{
	// 	setTimeout(()=>{
	// 		scrollToBottom()
	// 	},300)
	
	// },[dates])

  const getYYYYMMDD = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed, so we add 1
    const day = today.getDate();

    const formattedDate = `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
    return formattedDate
  }

  const getHHMM = () => {
    const now = new Date();
    let hours = now.getHours();
    console.log(hours)
    const amOrPm = hours >= 12 ? 'pm' : 'am'; // 오전/오후 구분
    hours = hours % 12 || 12; // 12시간제로 변환
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 분을 가져와서 두 자리로 맞추고 앞에 0을 채움
    const time = `${amOrPm} ${hours}:${minutes}`; // 시간과 분을 결합하여 am/pm HH:MM 형태의 문자열 생성
    return time; // 예시 출력: "pm 03:30"
  }

  const onSubmit = async () => {
    const batch = db.batch()
		// scrollToBottom()
    const YYYYMMDD = getYYYYMMDD()
    const HHMM = getHHMM()
    setIsSending(true)
    if(input.length>1000){
      alert("1000글자 이내이야 합니다.")
      return;
    }
    if(isSending)
      return

      if(dates[0]===undefined){
        batch.set(db.collection("team").doc(id).collection("message").doc(user.uid).collection("date").doc(YYYYMMDD), {
          date: new Date(),
          chats: [{text:input, type:"user", createdAt: HHMM}]
        })
      }
      else{
        //만약 같은 날짜가 아니라면 = 최근 톡 날짜 이후의 날짜가 된다면
        console.log(dates[dates.length-1])
        if(YYYYMMDD!==dates[dates.length-1]?.timeline){
          batch.set(db.collection("team").doc(id).collection("message").doc(user.uid).collection("date").doc(YYYYMMDD), {
            date: new Date(),
            chats: [{text:input, type:"user", createdAt: HHMM}]
          })
        } else{
          batch.set(db.collection("team").doc(id).collection("message").doc(user.uid).collection("date").doc(YYYYMMDD), {
            date: new Date(),
            chats: [...dates[dates.length-1].chats,{text:input, type:"user", createdAt: HHMM}]
          })
        }
      }


      batch.set(db.collection("user").doc(user.uid).collection("message").doc(id),{
        repliedAt: new Date(),
        mode:"talk",
        title: teamName,
        content: input,
        unread: 0,
        teamProfile: profile
      })

      //admin한테 안읽음 보내기
      const messageDoc = await db.collection("team").doc(id).collection("message").doc(user.uid).get()
      if(messageDoc.exists){
        batch.set(db.collection("team").doc(id).collection("message").doc(user.uid), {
          repliedAt: new Date(),
          mode: "talk",
          title: userData.realName,
          content: input,
          unread: messageDoc.data().unread+1,
        })
      } else {
        batch.set(db.collection("team").doc(id).collection("message").doc(user.uid), {
          repliedAt: new Date(),
          mode: "talk",
          title: userData.realName,
          content: input,
          unread: 1,
        })
      }


      batch.commit().then( async()=>{
        try{
          // const userDoc = await db.collection("user").doc(user.uid).get()
          // const result = await sendNotification(userDoc.data().pushToken,teamName,input);
          setIsSending(false)
          // scrollToBottom()
          setInput("")
        }catch(e){
          setIsSending(false)
          console.log(e.message)
        }
      })





  }



if(teamName!=="")
  return(
    <>
    
    <div className={styles.main_container}>
    <div className={styles.header_container}><HeaderLeftClose title={teamName}/></div>
      <div className={styles.chat_container}>
        
        {dates.length===0 && <p className={styles.no_chat}>아직 채팅 내역이 없습니다.</p>}
        {dates.map((date, index1)=>{
          return(
            <ul key={index1}>
              <h1>{date.timeline}</h1>

              
                {date.chats.map((chat, index)=>{
                  console.log(chat)
                  if(chat.type!=="center")
                    return(
                      <div key={index} className={`${styles.text_container} ${styles.my_text}`}>
                        {date.chats[index+1]?.createdAt!==chat.createdAt &&
                          <div className={styles.createdAt}>{chat.createdAt}</div>
                        }
                        <li >
                          <h4>{chat.text}</h4>
                        </li>
                      </div>
                    )
                  else if(index===0 ||date.chats[index-1]?.type==="user")
                    return(
                      <div className={`${styles.more_text_container} ${styles.other_text}`}  key={index}>
                        <div className={styles.profile_container}><Image src={profile} height={40} width={40} alt="프로필"/></div>
                        <div className={styles.content_container}>
                          <div className={styles.teamName}>{teamName}</div>
                          <div className={styles.text_container}>
                            <div className={styles.text}>{chat.text}</div>
                            {date.chats[index+1]?.createdAt!==chat.createdAt &&
                              <div className={styles.createdAt}>{chat.createdAt}</div>
                            }
                          </div>
                        </div>
                        
                      </div>
                    )
                    else
                      return(
                        <div key={index} className={`${styles.text_container} ${styles.other_text}`}>
                          
                          <li style={{marginLeft:"46px"}}>
                            
                            <h4>{chat.text}</h4>
                          </li>
                          {date.chats[index+1]?.createdAt!==chat.createdAt &&
                            <div className={styles.createdAt}>{chat.createdAt}</div>
                          }
                        </div>
                      )
                })}
             
            </ul>
          )
        })}

      <div className={styles.input_container}>
        
        <TextField sx={{minHeight:"20px"}} multiline
          value={input} onChange={e=>{console.log(e.target.value);setInput(e.target.value);}}
          fullWidth size="small" maxRows={2}
          disabled={isSending}
        />
        <Button variant="contained" sx={{ minWidth:"40px", ml:"10px"}} onClick={onSubmit}>
          {isSending ?
            <CircularProgress size={20} sx={{color:"white"}}/>
          : 
            <ArrowUpwardOutlinedIcon sx={{fontSize:"20px"}}/>
          }
        </Button>
      </div>
      </div>

      <div style={{height:"130px", width:"100%"}} />
    </div>
    </>
  )
}
export default Talk
