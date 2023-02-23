import { useEffect, useState } from "react"
import styles from "src/article/styles/index.module.css"
import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase"

import Article from "src/article/components/Article"
import { CircularProgress } from "@mui/material"

const Contents = () => {
  const router = useRouter()
  const { team_id, id } = router.query;
  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState()
  const [selectedItem, setSelectedItem] = useState(0)
  const handleChange = (event, newValue) => {
    setSelectedItem(newValue);
    console.log(newValue)
    // fetchProgramData(groups[newValue].id)
  };

  // const contentData = [
  //   { title: "공모주제", text: `<p class="ql-align-center"><strong style="font-size: 14px; color: rgb(0, 102, 204);">다문화가정 프로그램이 연기되었습니다.</strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="font-size: 14px;">이러이러한 이유로, </span></p><p class="ql-align-center"><span style="font-size: 14px;">다문화가정 프로그램이 1달간 연기되었습니다.</span></p>` },
  //   { title: "공모주제", text: `<p class="ql-align-center"><strong style="font-size: 14px; color: rgb(0, 102, 204);">다문화가정 프로그램이 연기되었습니다.</strong></p><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="font-size: 14px;">이러이러한 이유로, </span></p><p class="ql-align-center"><span style="font-size: 14px;">다문화가정 프로그램이 1달간 연기되었습니다.</span></p>` }
  // ]


  // const infoData = [
  //   { title: "접수기간", text: "2022년 6월 15일(수) ~ 7월 12일(화), 4주간" },
  //   { title: "결과발표", text: "2022년 8월 초 예정, 한국건강가정진흥원 홈페이지 및 기관SNS(인스타그램)을 통해 발표." },
  //   { title: "주최", text: "한국건강가정진흥원" },
  //   { type: "button", url: "https://www.naver.com" }
  // ]

  // const scheduleData = [
  //   { date: "2022.06.15", title: "응모/접수 시작일", text: "응모를 시작하는 일자입니다." },
  //   { date: "2022.07.12", title: "응모/접수 마감일" },
  // ]


  useEffect(() => {
    const fetchData = async () => {
      let doc = await db.collection("team").doc(team_id).collection("programs").doc(id).get()
      if(doc.exists)
        setType("programs")
      else{
        doc = await db.collection("team").doc(team_id).collection("surveys").doc(id).get()
        setType('surveys')
      }
      if(doc.exists){
        setData({...doc.data(), groupName: localStorage.getItem("selectedTeamName")})
        setIsLoading(false)
      } else{
        alert("존재하지 않거나 삭제된 게시물입니다.")
        router.push("/")
      }
    }
    if(localStorage.getItem("selectedTeamId")===null){
      localStorage.setItem("selectedTeamId", team_id)
      db.collection("team").doc(team_id).get().then((doc) => {
        localStorage.setItem("selectedTeamName", doc.data().teamName)
      })
    }
    fetchData()
  }, [])


  if (isLoading)
    return (
      <div className={styles.loader}>
        <CircularProgress />
      </div>
    )
  

  return (
    <Article data={data} teamName={team_id} id={id} type={type} />
  )
}

export default Contents