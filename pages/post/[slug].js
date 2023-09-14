import React, {useCallback, useEffect, useState} from "react"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router";
import styles from "src/post/styles/post.module.css"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import Image from "next/image";
import dynamic from "next/dynamic";
import Skeleton from '@mui/material/Skeleton';
import { motion, useAnimation } from "framer-motion";
import { sendRequest } from "pages/api/sendRequest";
const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>로딩중 ...</p>,
})


const Post = (props) => {
  const router = useRouter();
  const { slug } = router.query
  const [hasData, setHasData] = useState(false)
  const [data, setData] = useState({})
  const [randomNumber, setRandomNumber] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const handleIsShow = (bool) => { setIsShow(bool) }
  const [alarmText, setAlarmText] = useState("")
  const handleAlarmText = (text) => { setAlarmText(text) }
  const [alarmMode, setAlarmMode] = useState("success")
  const handleAlarmMode = (mode) => { setAlarmMode(mode) }
  const handleIsBookmark = (bool) => { setIsBookmark(bool) }
  const [isBookmark, setIsBookmark] = useState(false)
  // useEffect(() => {
  //   //Random number from 0~8 (int)

  // }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await sendRequest.fetchPostDataFromId(slug, true)
      setData(res)
      setIsLoading(false)
    }
    fetchData()
    setRandomNumber(Math.floor(Math.random() * 9))
  }, [])

  // const getDate = (d) => {
  //   const date = new Date(d.toMillis())
  //   if(date.getMonth()+1<10 && date.getDate()<10)
  //     return date.getFullYear() + ".0" + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  //   else if(date.getMonth()+1<10 && date.getDate()>=10)
  //     return date.getFullYear() + ".0" + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  //   else if(date.getMonth()+1>=10 && date.getDate()<10)
  //     return date.getFullYear() + "." + (date.getMonth() + 1) + ".0" + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  //   else if(date.getMonth()+1>=10 && date.getDate()>=10)
  //     return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() +" "+date.getHours()+":"+date.getMinutes()
  // }

  const onArrowBackIconClick = () => {
    router.back()
  }
  const onShareIconClick = () => {
    if (navigator.share) {
      navigator.share({
        title: "한국다문화뉴스",
        text: data.title,
        url: `https://multicultural-news.netlify.app/post/${history[history.length-1]}`,
      })
    } else {
      setShowBackdrop(true)
    }
  }
  const handleShowBackdrop = (bool) => {
    setShowBackdrop(bool)
  }
  const handleCloseBackDrop = () => {
    setShowBackdrop(false)
  }
  const handleCopy = () => {
    setIsShow(true)
    setAlarmText("Url이 복사되었습니다!")
    setAlarmMode("success")
    setTimeout(() => {
      setIsShow(false)
    },2000)
  }
  const onTouchStart = (e) => {
    // props.handleTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchEnd = (e) => {
    // props.handleTouchEnd(e.changedTouches[0].clientX)
  }
  // useEffect(() => {
  //   if (props.isSwipeToLeft) {
  //     router.back()
  //     props.handleSwipeToLeft(false)
  //   }
  // }, [props.isSwipeToLeft])
  
  // const onMoreCommentClick = () => {
  //   router.push(`/comments/${slug}`)
  // }

  if (isLoading) {
    return (
      <>
        <Skeleton animation="wave" variant="rectangular" width="100%" height={250} />
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
        <div className={styles.skeleton_text_container}>
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
          <Skeleton animation="wave" variant="text" width="90%" height={20} />
        </div>
      </>
    )
  }
  if (data.title==="") {
    return <div className={styles.warning}>존재하지 않거나 삭제된 게시물입니다.</div>
  }
  return (
    <div className={styles.main_container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} >
      <div className={styles.header_container}>
        <div className={styles.overlay}>
          <motion.div initial={{ opacity: 0}} animate={{ opacity: 1, transition: { duration: 1 } }} className={styles.icons}>
            <ArrowBackIcon className={styles.icon} onClick={onArrowBackIconClick} />
          </motion.div>
          <div className={styles.info_container}>
            <motion.h2 initial={{ opacity: 0, x:-15 }} animate={{ opacity: 1, x:0, transition: { duration: 1.0, delay:0.3} }}>{data.title}</motion.h2>
            {/* <motion.h3 initial={{ opacity: 0, x:-15}} animate={{ opacity: 1, x:0, transition: { duration: 1.0, delay:0.6 } }}>{data.category}</motion.h3> */}
            <motion.p initial={{ opacity: 0, x:-15}} animate={{ opacity: 1, x:0, transition: { duration: 1.0, delay:0.7 } }}>{`${data.createdAt} | ${data.author}`}</motion.p>
          </div>
        </div>
        <Image src={data.thumbnailImg.includes("https:") ? data.thumbnailImg : `https:${data.thumbnailImg}`} alt={data.title} placeholder="blur" blurDataURL="/public/placeholder.png" layout="fill" objectFit="cover" objectPosition="center"  priority={true}/>
        <motion.p className={ showBackdrop ? styles.hide : (randomNumber === 0 ? `${styles.category} ${styles.color1}` : randomNumber === 1 ? `${styles.category} ${styles.color2}` :
          randomNumber === 2 ? `${styles.category} ${styles.color3}` : randomNumber === 3 ? `${styles.category} ${styles.color4}` :
            randomNumber === 4 ? `${styles.category} ${styles.color5}` : randomNumber === 5 ? `${styles.category} ${styles.color6}` :
              randomNumber === 6 ? `${styles.category} ${styles.color7}` : randomNumber === 7 ? `${styles.category} ${styles.color8}` : `${styles.category} ${styles.color6}`)
        }
          initial={{ opacity: 0 }} animate={{ opacity: 1, x: 0, transition: { duration: 1.0, delay: 1.2} }}
        >
          {data.category}
        </motion.p>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1.0, delay: 1.2 } }}
        className={styles.content_container} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {    console.log(data.content)}
        <QuillNoSSRWrapper value={data.content||""} readOnly={true} theme="bubble" />
      </motion.div>
      <div style={{marginBottom: "100px", width:"100%"}}>_</div>
    </div>
  )
}
export default Post