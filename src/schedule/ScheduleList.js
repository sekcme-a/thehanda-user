import { useEffect, useState } from "react";
import useUserData from "context/userData"
import { useRouter } from "next/router";
import styles from "./ScheduleList.module.css"
import Image from "next/image";
const ScheduleList = ({schedule, colorValues}) => {
  const {user, userData} = useUserData()
  const router = useRouter()
  const [list, setList] = useState([])

  useEffect(()=>{
    if(schedule){
      const sortedSchedule = sortByStartDate(schedule)
      console.log(sortedSchedule)
      setList(sortedSchedule)
    }
  },[schedule])

  function sortByStartDate(events) {
    events.sort((a, b) => {
      const startDateA = a.start.seconds;
      const startDateB = b.start.seconds;
  
      if (startDateA < startDateB) {
        return -1; // a가 더 빠른 경우
      }
      if (startDateA > startDateB) {
        return 1; // b가 더 빠른 경우
      }
      return 0; // 날짜가 같은 경우
    });
  
    return events;
  }
  
  return(
    <div className={styles.main_container}>
      {list?.map((item, index)=>{
        return(
          <div key={`${item.extendedProps.id}_${index}`} className={styles.item_container} onClick={()=>router.push(`/article/${userData.selectedTeamId}/${item.id}`)}>
            {/* <Image priority src={item.imgUrl} alt={item.programTitle} width={100}height={50}/> */}
            <div>
              <h3 style={{color: item.color}}>{`[${colorValues[item.color]}]`}</h3>
              <h1>{item.programTitle}</h1>
              <h2>{item.title}</h2>
              <p className={styles.start}>시작일: {item.start.toDate().toLocaleString()}</p>
              <p className={styles.end}>종료일: {item.end.toDate().toLocaleString()}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ScheduleList