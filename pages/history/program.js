import { useEffect, useState } from "react"
// import styles from "styles/components/history/program.module.css"
import { useRouter } from "next/router"

import { firestore as db } from "firebase/firebase"

import PageHeader from "src/public/components/PageHeader"
import Thumbnail from "src/public/components/Thumbnail"

import CircularProgress from '@mui/material/CircularProgress';
import useData from "context/data"


const MyPageProfile = () => {
  const router = useRouter()
  const {user} = useData()
  const [isLoading, setIsLoading] = useState(true)
  const [list, setList] = useState([])
  const [page, setPage] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      // localStorage.removeItem("history_program")
      setIsLoading(true)
      const doc = await db.collection("user").doc(user.uid).collection("history").doc("programs").get()
      if(doc.exists){
        const idList = doc.data().data
        setItemCount(idList.length)
        let resultList = list
        for(let i = 10*(page+1-1); i<(page+1)*10-1;i++){
            if(idList[i]===undefined)
              break;
            const doc = await db.collection("team").doc(idList[i].team).collection("programs").doc(idList[i].id).get()
            resultList.push({id: doc.id, teamId: idList[i].team, ...doc.data()})
        }
        setList([...resultList])
      }
        setIsLoading(false)
    }
    fetchData()
  }, [page])




  const onMoreClick = async () => {
    setPage(page+1)
    // setIsLoading(true)
    // setPage(page + 1)
    
    // const history = localStorage.getItem("history_program")
    // if (history !== null) {
    //   const tempList = history.split("_SEP_")
    //   let resultList = list
    //   setItemCount(tempList.length)
    //   for (let i = 10 * (page + 1 - 1); i < (page + 1) * 10 - 1; i++) {
    //     if (tempList[i] === undefined)
    //       break;
    //     const items = tempList[i].split("/:/")
    //     const doc = await db.collection("contents").doc(items[0]).collection("programs").doc(items[1]).get()
    //     const groupData = await db.collection("admin_group").doc(items[0]).get()
    //     resultList.push({
    //       id: items[1],
    //       teamName: items[0],
    //       title: doc.data().title,
    //       subtitle: doc.data().subtitle,
    //       thumbnailBackground: doc.data().thumbnailBackground,
    //       groupName: groupData.data().name,
    //       date: doc.data().date,
    //       deadline: doc.data().deadline,
    //       surveyId: doc.data().surveyId,
    //     })
    //   }
    //   setList([...resultList])
    // }
    // setIsLoading(false)
  }


  
  
  return (
    <div style={{ paddingBottom: "100px" }}>
      <PageHeader text="프로그램 참여 기록" />
      {list.length === 0 ?
        !isLoading &&
          <div style={{ width: "100%", height: "250px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <p>아직 참여한 프로그램이 없습니다.</p>
          </div>
        :
        list.map((item, index) => {
          return (
            <div key={index} >
              <Thumbnail data={item} smallMargin={true} path={`/article/${item.teamId}/${item.id}`} />
            </div>
          )
        })
      }
      {itemCount - (page+1) * 10 > 0 && !isLoading &&
        <div style={{display:"flex", justifyContent:"center",marginTop:"10px",color:"blue"}} onClick={onMoreClick}>
          더보기
        </div>
      }
      {isLoading &&
        <div style={{display:"flex", justifyContent:"center", marginTop:"50px"}}>
          <CircularProgress />
        </div>
      }
    </div>
  )
}

export default MyPageProfile