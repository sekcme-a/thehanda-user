import { useState } from "react";

import PhoneNumber from "src/public/components/PhoneNumber";
import PhoneVerificate from "src/public/components/PhoneVerificate";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative } from "swiper";
import styles from 'src/walkthrough/styles/Walkthrough.module.css';

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";

const PhoneVerification = () => {
  const [swiper, setSwiper] = useState()
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  const onSwiperLoad = (swiper) => {
    setSwiper(swiper);
    setIsSwiperLoaded(true)
  };
  const onNextClick = () => {
    console.log(swiper)
    swiper.slideNext();
  };
  const onPrevClick = () => {
    swiper.slidePrev()
  }

 
  return(
    <>
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
      className={ "mySwiper"}
      onSwiper={(swiper) => onSwiperLoad(swiper)}
      speed={700}
      allowTouchMove={false}
      style={{width:'100%', height:'100vh', position:'relative', backgroundColor:'#9a30ae'}}
      >
        {isSwiperLoaded &&
        <>
          <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
            <div className={styles.item_container}>
              <h1 className={styles.title}>전화번호 변경</h1>
              <div className={styles.title_border}></div>
              <h2 className={styles.subtitle}>전화번호를 입력해주세요.</h2>
              <PhoneNumber onNext={onNextClick} onPrev={onPrevClick} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} routerBackWhenPrevClick={true}/>
            </div>
          </SwiperSlide>

          <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
            <div className={styles.item_container}>
              <h1 className={styles.title}>Step 2/3</h1>
              <div className={styles.title_border}></div>
              <h2 className={styles.subtitle}>전화번호 인증번호 확인.</h2>
              <PhoneVerificate onNext={onNextClick} onPrev={onPrevClick} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} routeWhenVerificated="/myProfile"/>
            </div>
          </SwiperSlide>
        </>
        }
      </Swiper>
    </>
  )
}

export default PhoneVerification