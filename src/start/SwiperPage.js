import styles from './SwiperPage.module.css'
import Image from "next/image";

import { Button } from "@mui/material";

const SwiperPage = ({page, onNextClick, onPrevClick}) => {
  if(page===1)
    return(
      <div className={styles.main_container}>
        <Image src="/image/walkthrough/001.png" alt="walkthrough" width={280} height={280} />
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
    )
  else if (page===2)
    return(
      <div className={styles.main_container}>
        <Image src="/image/walkthrough/002.png" alt="walkthrough" width={280} height={280} />
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
    )
  else if (page===3)
    return(
      <div className={styles.main_container}>
        <Image src="/image/walkthrough/003.png" alt="walkthrough" width={280} height={280} />
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
    )
}

export default SwiperPage