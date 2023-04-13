import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from 'src/walkthrough/styles/Walkthrough.module.css';
import Image from "next/image";
import useData from "context/data";
import { useRouter } from "next/router";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";

import { EffectCreative } from "swiper";
import { Button } from "@mui/material";


import Login from "src/walkthrough/components/Login"
import InputUserData from "src/walkthrough/components/InputUserData"
import PhoneNumber from "src/public/components/PhoneNumber";
import PhoneVerificate from "src/public/components/PhoneVerificate";
import ChooseCenter from "src/walkthrough/components/ChooseCenter"
import { auth } from "firebase/firebase";

//for control bgcolor
const LOGIN_PAGE = 4;

const Walkthrough = () => {
  const [swiper, setSwiper] = useState(null);
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
  const [page, setPage] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const {user, userData} = useData()
  const router = useRouter()

  useEffect(()=>{
    //use isSwiperLoaded to prevent errors from swiper.slideTo is null
    //if user but has no information, set information
    // alert(user)


    console.log(user)
    if(user && isSwiperLoaded===true){
      console.log(userData)
      // if(!sessionStorage.getItem("ps")||!user.email)
        swiper.slideTo(LOGIN_PAGE)
      // if(!userData ||!userData.realName || !userData.displayName|| !userData.gender || userData.isMulticulture===undefined)
      //   swiper.slideTo(LOGIN_PAGE)
      // else if( (!userData.phoneNumber||userData.phoneVerified!==true) && phoneNumber===""){
      //   swiper.slideTo(LOGIN_PAGE+1)
      // } 
      // else
      //   swiper.slideTo(LOGIN_PAGE+3)
    }
  },[user,isSwiperLoaded])
  
  const onNextClick = () => {
    swiper.slideNext();
    setPage(page+1)
  };
  const onPrevClick = () => {
    swiper.slidePrev()
  }

  const onSwiperLoad = (swiper) => {
    setSwiper(swiper);
    setIsSwiperLoaded(true)
  };

  return (
    <Swiper
    grabCursor={true}
    effect={"creative"}
    creativeEffect={{
      prev: {
        // shadow: true,
        translate: [0, 0, -400],
      },
      next: {
        translate: ["100%", 0, 0],
      },
      ease: "easeInOut",
    }}
    modules={[EffectCreative]}
    className={page===LOGIN_PAGE ? "loginSwiper" : "mySwiper"}
    onSwiper={(swiper) => onSwiperLoad(swiper)}
    speed={700}
    allowTouchMove={false}
    style={{width:'100%', height:'100vh', position:'relative', backgroundColor:'#9a30ae'}}
    >
      {isSwiperLoaded && 
      <>
      <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
        <div className={styles.main_container}>
          <Image src="/walkthrough/001.png" alt="walkthrough" width={280} height={280} />
          <h1>
            센터의 프로그램들을 확인하고 <p>쉽고 간편하게 신청</p>하세요.
          </h1>
          <h2>
            어서오세요! 센터에서 제공하는 다양한 프로그램들을 살펴보고, 단 몇 번의 클릭으로 쉽고 간편하게 프로그램을 신청해 보세요.
          </h2>
          <div className={styles.button_container}>
            <Button className={styles.next} variant="contained" onClick={onNextClick}>
              {"다음 >"}
            </Button>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
        <div className={styles.main_container}>
          <Image src="/walkthrough/002.png" alt="walkthrough" width={280} height={280} />
          <h1>
            신청한 프로그램들의 알림을 받고, <p>센터의 여러 정보</p>들을 확인하세요.
          </h1>
          <h2>
            프로그램 알림과 센터 정보들을 확인하고, 신청한 프로그램들을 한 눈에 확인하고 관리하세요.
          </h2>
          <div className={styles.button_container2}>
            <Button className={styles.prev} onClick={onPrevClick}>
              {"이전"}
            </Button>
            <Button className={styles.next} variant="contained" onClick={onNextClick}>
              {"다음 >"}
            </Button>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
        <div className={styles.main_container}>
          <Image src="/walkthrough/003.png" alt="walkthrough" width={280} height={280} />
          <h1>
            궁금하신 내용에 대해 <p>센터와 쉽게 소통</p>하세요.
          </h1>
          <h2>
            프로그램 신청 도중 궁금한 사항이 있으면, 해당 프로그램의 센터를 통해 쉽게 프로그램에 대해 소통할 수 있습니다.
          </h2>
          <div className={styles.button_container2}>
            <Button className={styles.prev} onClick={onPrevClick}>
              {"이전"}
            </Button>
            <Button className={styles.next} variant="contained" onClick={onNextClick}>
              {"다음 >"}
            </Button>
          </div>
        </div>
      </SwiperSlide>


      <SwiperSlide >
        <Login onNext={onNextClick}/>
      </SwiperSlide>

      {!userData || (userData && (!userData.realName || !userData.displayName|| !userData.gender || userData.isMulticulture===undefined)) &&
        <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
          <InputUserData onNext={onNextClick} onPrev={onPrevClick}/>
        </SwiperSlide>
      }

      {!userData || (userData && (!userData.phoneNumber || !userData.phoneVerified)) &&
        <>
          <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
            <div className={styles.item_container}>
              <h1 className={styles.title}>Step 2/3</h1>
              <div className={styles.title_border}></div>
              <h2 className={styles.subtitle}>전화번호를 입력해주세요.</h2>
              <PhoneNumber onNext={onNextClick} onPrev={onPrevClick} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>
            </div>
          </SwiperSlide>

          <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
            <div className={styles.item_container}>
              <h1 className={styles.title}>Step 2/3</h1>
              <div className={styles.title_border}></div>
              <h2 className={styles.subtitle}>전화번호 인증번호 확인.</h2>
              <PhoneVerificate onNext={onNextClick} onPrev={onPrevClick} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}/>
            </div>
          </SwiperSlide>
        </>
      }
      <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
        <div className={styles.item_container}>
          <h1 className={styles.title}>Step 3/3</h1>
          <div className={styles.title_border}></div>
          <h2 className={styles.subtitle}>관심있는 센터를 선택해주세요.</h2>
          <h3 className={styles.info_text}>센터 선택은 언제든지 상단 메뉴를 통해 바꾸실 수 있습니다.</h3>
          <ChooseCenter />
        </div>

        {/* <Button onClick={()=>auth.signOut()}>로그아웃</Button> */}
      </SwiperSlide>
      </>
      }
    </Swiper>
  );
};

export default Walkthrough;
