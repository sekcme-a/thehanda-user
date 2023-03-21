import { useEffect, useState } from "react"
import useData from "context/data"
import { useRouter } from "next/router"
import Image from "next/image"
import styles from "src/family/styles/family.module.css"
import PageHeader from "src/public/components/PageHeader"
import { Button } from "@mui/material"
import { Dialog } from "@mui/material"
import { TextField } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { firestore as db } from "firebase/firebase"
import { CircularProgress } from "@mui/material"
const Family = () => {
  const {user} = useData()
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [inputText, setInputText] = useState("")
  const [list, setList] = useState([])

  const [isSearching, setIsSearching] = useState(false)

  useEffect(()=>{
    if(user){
       
    }else{
      alert("로그인 후 이용하실 수 있습니다.")
      router.push("/login")
    }

  },[])

  const onAddClick = () => {
    setOpenDialog(true)
  }
  const onDialogClose = () => {
    setIsSearching(false)
    setInputText("")
    setList([])
    setOpenDialog(false)
  }

  const onSearchClick = async() => {
    if(inputText==="" || inputText===" "){
      alert("검색할 내용을 입력해주세요")
      return;
    }
    setIsSearching(true)
    const query1 = await db.collection("user").where("displayName","==",inputText).get()
    const query2 = await db.collection("user").where("realName","==",inputText).get()
    const query3 = await db.collection("user").where("phoneNumber","==",inputText).get()
    const temp1 = query1.docs.map(doc=>doc.data())
    const temp2 = query2.docs.map(doc=>doc.data())
    const temp3 = query3.docs.map(doc=>doc.data())
    const temp4  = [...temp1, ...temp2, ...temp3]
    console.log(temp4)
    const result = temp4.reduce((acc, v) => {
      return acc.find(x => x.uid === v.uid) ? acc : [...acc, v];
    }, []);
    setList([...result])
    setIsSearching(false)
  }
  const handleOnKeyPress = e => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  const onItemClick = (index)=>{
    alert(list[index].uid)
  }

  return(
    <div className={styles.main_container}>
      <PageHeader text="가족 구성원 관리" />
      <div>
        <div className={styles.image_container}>
          <Image src="/family.png"  alt="다한다 로고"  layout="fill" objectFit="cover" objectPosition="center" />
        </div>
        <div className={styles.no_family_container}>
          <p>아직 가족 구성원이 없습니다. 구성원을 추가해주세요. </p>
          <Button variant="contained" size="small" onClick={onAddClick}>구성원 추가 +</Button>
        </div>
      </div>
      <Dialog open={openDialog} onClose={onDialogClose}>
        <div className={styles.dialog_container}>
          <h1>사용자 검색</h1>
          <p>가족 구성원으로 등록할 사용자를 닉네임, 실명, 전화번호를 통해 검색하세요.</p>
          <p>모든 글자를 정확히 입력해야 검색됩니다.</p>
          <div className={styles.search_container}>
            <SearchOutlinedIcon />
            <TextField
              placeholder="닉네임, 실명 혹은 전화번호를 입력해주세요."
              variant="standard" 
              onKeyDown={handleOnKeyPress}
              value={inputText}
              onChange={(e)=>setInputText(e.target.value)}
              fullWidth
            />
            <Button onClick={onSearchClick}>검색</Button>
          </div>
          {isSearching ? 
            <div className={styles.loader_container}>
              잠시만 기다려주세요.<CircularProgress style={{width:"20px", height:"20px"}}/>
            </div>
          :
            list.length===0 ? 
            <div className={styles.loader_container}>
              조회된 사용자가 없습니다.
            </div>
            :
            <ul className={styles.user_list_container}>
              <li className={styles.header}>
                <h2>닉네임</h2>
                <h3>실명</h3>
                <h4>전화번호</h4>
              </li>
              {list.map((item, index) => {
                return(
                  <li className={styles.item_container} key={index} onClick={()=>onItemClick(index)}>
                    <h2>{item.displayName}</h2>
                    <h3>{item.realName==="" ? "-":item.realName}</h3>
                    <h4>{item.phoneNumber==="" ? "-": item.phoneNumber}</h4>
                  </li>
                )
              })}
            </ul>
          }
        </div>
      </Dialog>
    </div>
  )
}
export default Family