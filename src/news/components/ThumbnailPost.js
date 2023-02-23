import React, { useState, useEffect } from "react"
import styles from "../styles/thumbnailPost.module.css"
// import Image from "next/image";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

import Typography from '@mui/material/Typography';

import { useRouter } from "next/router"
import { firestore as db } from "firebase/firebase";
import { Skeleton } from "@mui/material";
const ThumbnailPost = (props) => {
  const [randomNumber, setRandomNumber] = useState()
  const [id, setId] = useState("")
  // const [isOpenThisPost, setIsOpenThisPost] = useState()
  const [isTimeOut, setIsTimeOut] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [alarmText, setAlarmText] = useState("")
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [alarmMode, setAlarmMode] = useState("success")
  const router = useRouter()


  
  if(props.data===undefined)
    return (
    <></>
  )

  return (
    <div className={styles.main_container}>
      <Card sx={{ width: "100%", maxWidth: 500, marginTop: "20px", marginLeft:'10px', marginRight:"10px" }}>
        <CardHeader
          title={props.isLoading ? <Skeleton animation="wave" height={25} width="80%" /> : <h1 style={{fontSize:"21px"}}>{props.data?.title}</h1>}
          subheader={props.isLoading ? <Skeleton animation="wave" height={15} width="100%" /> : `${props.data?.info}`}
          onClick={()=>props.onPostClick(id)}
        />
        {props.isLoading ?
          <Skeleton sx={{ height: 190 }} animation="wave" variant="rectangular" />
          :
          <CardMedia
            component="img"
            height="194"
            image={props.data?.thumbnailImg.replace("http://", "https://")}
            alt={props.data.title}
            onClick={()=>props.onPostClick(id)}
          />
        }
        {props.isLoading ? 
          <CardContent style={{ padding: "8px" }}>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </CardContent>
          :
          <CardContent style={{ padding: "8px" }} onClick={()=>props.onPostClick(id)}>
            <Typography variant="body2" color="#3f729b">
              {props.data.tag}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${props.data.subtitle ==="..." ? props.data.title : props.data.subtitle}`}
            </Typography>
          </CardContent>
        }

        {/* <CardActions disableSpacing>
          <IconButton aria-label="bookmark" onClick={onBookmarkClick}>
            {
              props.isLoading ? 
                <Skeleton animation="wave" height={32} width="20px" />
              :
                isBookmarked(id) ?
                  <BookmarkBorderIcon style={{ color: "rgb(255, 134, 154)" }} />
                :
                  <BookmarkBorderIcon />
            }
          </IconButton>
          <IconButton aria-label="like" onClick={onLikeClick}>
            {
              props.isLoading ? 
                <Skeleton animation="wave" height={32} width="20px" />
              :
                isLiked(id) ?
                  <ThumbUpOffAltIcon style={{ color: "rgb(255, 134, 154)" }} />
                :
                  <ThumbUpOffAltIcon />
            }
          </IconButton>
          {props.isLoading ? 
            <Skeleton animation="wave" height={32} width="20px" style={{ marginLeft: "8px" }} />
            :
            <IconButton aria-label="share" onClick={onShareClick}>
              <ShareIcon />
            </IconButton>
          }
        </CardActions> */}
      </Card>
      {/* <Alert mode={alarmMode} isShow={isShow} text={alarmText} /> */}
      {/* <Backdrop open={showBackdrop} onClick={handleCloseBackDrop} sx={{ color: '#fff', zIndex: 1000, }}>
        <ShareLink url={`https://multicultural-news.netlify.app/post/${id}`} handleCopy={handleCopy} />
      </Backdrop> */}
    </div>
  )
}
export default ThumbnailPost
