import { useEffect, useState } from "react"
import useData from "context/data"
import useUserData from "context/userData"
import { useRouter } from "next/router"
import Link from "next/link"
import { firestore as db, auth } from "firebase/firebase"

import HeaderRightClose from "src/public/components/HeaderRIghtClose"
import MyPageProfile from "src/myPage/MyPageProfile"
// import HorizontalBanner from "src/myPage/components/HorizontalBanner"
import ItemContainer from "src/myPage/ItemContainer"
import CustomAlert from "src/public/components/CustomAlert"

import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import AodOutlinedIcon from '@mui/icons-material/AodOutlined';
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined';
import DeviceUnknownOutlinedIcon from '@mui/icons-material/DeviceUnknownOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';

//내 정보 관리, 내게 온 알림, 신청한 프로그램, 설문조사 기록, 공지사항, 센터 문의
//소식(한다뉴), 서비스 이용약관, 개인정보 처리방침, FAQ, 로그아웃
const MyPage = () => {
  // const { logout, deleteAccount, user } = useAuth()
  const {user, userData} = useUserData()
  const router = useRouter()
  const [customAlert, setCustomAlert] = useState({
    title:"",
    content:"",
    open: false,
    type:"",
    result: false,  
  })
  const iconStyle = { color: "#814ad8" }
  const onLogoutClick = () => {
    auth.signOut()
  }
  const onSignOutClick = async() => {
    alert("서버 점검중으로 회원탈퇴가 일시적으로 불가능합니다, 잠시 후 다시 시도해주세요.")
    // setCustomAlert({
    //   title:"회원탈퇴 확인",
    //   content:"정말로 회원탈퇴하시겠습니까?\n(해당 계정에 대한 정보가 모두 사라집니다.)",
    //   open: true,
    //   type:"confirm",
    //   result: "",  //confirm()기능 결과
    // })
  }


  //** 주의! ITEM_DATA[1]와 [2]의 위치는 변경되면 안됩니다. */
  const ITEM_DATA = [
  {
    title: "내 정보 관리", 
    subtitle: "어플에 입력할 정보를 관리할 수 있습니다.",
    icon: <AccountBoxOutlinedIcon style={iconStyle} />,
    onClick: ()=>{router.push("/myProfile")}
  },
  {
    title: "제휴 신청", 
    subtitle: "제휴 신청을 통해 혜택을 제공할 수 있습니다.",
    icon: <HandshakeIcon style={iconStyle} />,
    onClick: ()=>{router.push("/card/benefitRequest")}
  },
  {
    title: "제휴 게시물 관리", 
    subtitle: "제휴 게시물을 편집할 수 있습니다.",
    icon: <ModeEditOutlineOutlinedIcon style={iconStyle} />,
    onClick: ()=>{router.push("/card/editBenefit")}
  },
  {
    title: "가족 구성원 관리", 
    subtitle: "가족 구성원을 편집할 수 있습니다.",
    icon: <FamilyRestroomIcon style={iconStyle} />,
    onClick: ()=>{router.push("/family")}
  },
  {
    title: "내게 온 메세지", 
    subtitle: "자신에게 필요한 맞춤 알림을 확인하세요.",
    icon: <EmailOutlinedIcon style={iconStyle} />,
    onClick: () => {router.push("/message")}
  },
  {
    title: "신청한 프로그램 기록", 
    subtitle: "신청했던 프로그램 목록들을 확인하세요.",
    icon: <Diversity2OutlinedIcon style={iconStyle} />,
    onClick: () => {router.push("/history/program")}
  },
  {
    title: "공지사항", 
    subtitle: "센터와 어플에서 보낸 공지사항입니다.",
    icon: <CampaignOutlinedIcon style={iconStyle} />,
    onClick: () => {router.push(`home/anouncement/1`)}
  },
  {
    title: "센터 문의", 
    subtitle: "센터에 직접 궁금한 사항을 물어보세요.",
    icon: <SupportAgentOutlinedIcon style={iconStyle} />,
    onClick: () => {router.push("contact/center")}
  },
  {
    title: " 어플 문의", 
    subtitle: "어플에 직접 궁금한 사항을 물어보세요.",
    icon: <PhoneIphoneIcon style={iconStyle} />,
    onClick: () => {router.push("contact/app")}
  },
  {
    title: "다문화 소식", 
    subtitle: "한국다문화뉴스의 다문화 소식을 확인하세요.",
    icon: <NewspaperOutlinedIcon style={iconStyle} />,
    onClick: () => {router.push("home/multiculturlaNews/main")}
  },
  {
    title: "서비스 이용약관", 
    onClick: () => {router.push("info/service")}
  },
  {
    title: "개인정보 처리방침", 
    onClick: () => {router.push("info/private")}
  },
  {
    title: "도움말", 
    onClick: ()=> {router.push("info/faq")}
  },
  {
    title: "로그아웃", 
    onClick: onLogoutClick
  },
  {
    title: "회원탈퇴", 
    onClick: onSignOutClick
  },
  ]

  useEffect(()=>{
    if(!user)
      router.push("/start/walkthrough")
  },[user])
  

  //회원탈퇴를 눌렀다면
  useEffect(()=>{
    const askDelete = async () => {
      if(customAlert.result===true){
        try{
          await db.collection("user").doc(user.uid).update({
            deleted: true
          })
          await auth.currentUser.delete()
          // await db.collection("user").doc(currentUserUid).delete()
          router.push("/")
        } catch (e) {
          if(e.code==="auth/requires-recent-login"){
            await db.collection("user").doc(user.uid).update({
              deleted: false
            })
            setCustomAlert({
              title:"최신 인증 필요",
              content:"이 작업은 민감하며 최신 인증이 필요합니다. 다시 로그인하여 이 요청을 다시 시도해주세요.",
              open: true,
              result: "false"
            })
          }
        }
        
        // router.push("/")
      }
    }
    askDelete()
  },[customAlert])

  return (
    <>
      <HeaderRightClose title="마이 페이지" />
      <Link href="/myProfile" legacyBehavior>
        <a>
          <MyPageProfile />
        </a>
      </Link>
      {/* <HorizontalBanner src="/banner_ad.png" /> */}
      {
        ITEM_DATA.map((item, index) => {
          if(!(userData?.hasBenefitPost && index === 1) && !(!userData?.hasBenefitPost && index===2))
            return(
              <ItemContainer key={index} title={item.title} subtitle={item.subtitle} icon={item.icon} onClick={item.onClick} />
            )
        })
      }
      <div style={{width:"100%", height:"60px"}} />
      <CustomAlert alert={customAlert} setAlert={setCustomAlert} />
    </>
  )
}

export default MyPage