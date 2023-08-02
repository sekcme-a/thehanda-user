import { useEffect, useState, useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";

import SwiperPage from "src/start/SwiperPage";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-creative";
import { EffectCreative } from "swiper";


import { Button } from "@mui/material";

const Walkthrough = () => {
  const router = useRouter()
  const [swiper, setSwiper] = useState(null);
  const [isSwiperLoaded, setIsSwiperLoaded] = useState(false)
  const [page, setPage] = useState(1)

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
        className={"mySwiper"}
        onSwiper={(swiper) => onSwiperLoad(swiper)}
        speed={700}
        allowTouchMove={false}
        style={{width:'100%', height:'100vh', position:'relative', backgroundColor:'#9a30ae'}}
      >

        <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
          <SwiperPage page={1} onNextClick={onNextClick}/>
        </SwiperSlide>

        <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
          <SwiperPage page={2} onNextClick={onNextClick} onPrevClick={onPrevClick}/>
        </SwiperSlide>

        <SwiperSlide style={{backgroundColor:'rgb(255,254,255)'}}>
          <SwiperPage page={3} onNextClick={()=>router.push("/start/login")} onPrevClick={onPrevClick}/>
        </SwiperSlide>

      </Swiper>
    </>
  )
}

export default Walkthrough