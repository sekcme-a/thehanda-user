import { useState, useEffect } from "react";
import styles from "./Header.module.css"
import useData from "context/data";
import {FUNCTION} from "./HeaderFunction"


import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css";
import "swiper/css/pagination";
import SwiperCore, { Pagination, Navigation, Autoplay} from "swiper";

import Image from "next/image";

import SwiperItem from "./SwiperItem"
import DefaultSwiperItem from "./DefaultSwiperItem"
import { auth } from "firebase/firebase";

const Header = () => {
  SwiperCore.use([Autoplay])
  const {programList} = useData()
  const [dataList, setDataList] = useState()
  const [isLoading, setIsLoading] = useState(true)


  useEffect(()=>{
      setIsLoading(true)
      const list = FUNCTION.get_main_data_list(programList)
      setDataList(list)
      setIsLoading(false)
  },[programList])

  if(isLoading){
    return(
      <>loading</>
    )
  }

  // if(dataList.length===0)
  //   return(
  //     <div className={styles.main_container}>
  //       <DefaultSwiperItem />
  //     </div>
  //   )

  return(
    <>
      <div className={styles.main_container}>
        <Swiper
          grabCursor={true}
          pagination={{
            dynamicBullets: true,
          }}
          modules={[Pagination]}
          className={styles.swiper}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
        >
          {dataList.length!==0 ? 
            dataList?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <SwiperItem data={item} />
              </SwiperSlide>
            )
          })
          :
          <div className={styles.main_container}>
            <DefaultSwiperItem />
          </div>
        }

        </Swiper>
      </div>
    </>
  )
}

export default Header