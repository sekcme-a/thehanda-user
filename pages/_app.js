import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import "src/walkthrough/styles/login.css"
import "src/public/styles/FullScreenLoader.css"
import "src/public/styles/calendar.css"
import { DataProvider } from "context/data";
import AuthStateChanged from "src/public/hooks/AuthStateChanged";
import BottomNavigation from "src/public/components/BottomNavigation";
import BottomNavigation2 from "src/public/components/BottomNavigation2";
import { useEffect, useState, useRef } from "react";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from "next/head";
import PullToRefresh from 'react-simple-pull-to-refresh';
import 'react-chat-elements/dist/main.css'
import FullScreenLoader from "src/public/components/FullScreenLoader";

export default function App({ Component, pageProps }) {
  const [isSelectedTeamLoading, setIsSelectedTeamLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScrollTop, setIsScrollTop] = useState(true)
  const scrollRef = useRef(null)
  const router = useRouter()
  const theme = createTheme({
    palette: {
      primary: {
        main: '#814ad8'
      }
    }
  });


  useEffect(()=>{
    const fetchSelectedTeamId = async () => {
      let teamId = localStorage.getItem("selectedTeamId")
      if(teamId === null){
        // teamId="suwon"
        router.push("/walkthrough")
        setIsLoading(false)
      }
      else{
        const doc = await db.collection("team").doc(teamId).get()
        if(doc.exists){
          localStorage.setItem("selectedTeamId",doc.id)
          localStorage.setItem("selectedTeamName", doc.data().teamName)
        }
        setIsLoading(false)
        
      }
    }

    if(!(router.pathname.includes("/preview")||router.pathname.includes("/test")))
      fetchSelectedTeamId()
    else
      setIsLoading(false)
  },[])


  // useEffect((

  const handleRefresh = () => {
    // Perform refreshing of content here
    return new Promise((resolve) => {
      setIsRefreshing(false)
      router.reload()
      resolve();
    });
  };

  function handleScroll() {
    const position = scrollRef.current.scrollTop;
    if(position===0)
      setIsScrollTop(true)
    else if(isScrollTop && position>0)
      setIsScrollTop(false)
  }



  // if(isLoading)
  // return(
  //   <FullScreenLoader />
  // )

  return(
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href='https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css' rel='stylesheet'></link>
      </Head>
    <DataProvider>
      <AuthStateChanged>
        <ThemeProvider theme={theme}>
          {/* {router.pathname.includes("talk") ? 
            <>
              <Component {...pageProps} />
              {!router.pathname.includes("preview") && <BottomNavigation />}
            </>
            : */}
            <FullScreenLoader isLoading={isLoading} />
            <div onScroll={handleScroll}>
            <PullToRefresh 
              className="refresh_container"
              isPullable={!router.pathname.includes("talk")  || isScrollTop}
              onRefresh={handleRefresh} 
              refreshing={isRefreshing} 
              pullDownThreshold={90}
              resistance={2}
              maxPullDownDistance={150}
              pullingContent={<div style={{width:"100%", textAlign:"center", marginTop:"10px", fontSize:"13px"}}>끌어당겨서 새로고침</div>}
            >
                <Component {...pageProps} />
              
              
            </PullToRefresh>
            {!router.pathname.includes("preview") && !router.pathname.includes("walkthrough") && <BottomNavigation2 />}
            </div>
          {/* } */}
        </ThemeProvider>
      </AuthStateChanged>
    </DataProvider>
    </>
  )
}
