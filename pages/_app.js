import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import "src/walkthrough/styles/login.css"
import { DataProvider } from "context/data";
import AuthStateChanged from "src/public/hooks/AuthStateChanged";
import BottomNavigation from "src/public/components/BottomNavigation";
import { useEffect, useState, useRef } from "react";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from "next/head";
import PullToRefresh from 'react-simple-pull-to-refresh';
import 'react-chat-elements/dist/main.css'

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
      if(teamId === null)
        teamId="suwon"

      const doc = await db.collection("team").doc(teamId).get()
      if(doc.exists){
        localStorage.setItem("selectedTeamId",doc.id)
        localStorage.setItem("selectedTeamName", doc.data().teamName)
      }
      setIsLoading(false)
    }

    fetchSelectedTeamId()
  },[])

  // useEffect(()=>{
  //   const fetchData2 = async () => {
  //     let teamId = localStorage.getItem("selectedTeamId")
  //     console.log(teamId)
  //     if(teamId===null){
  //       teamId="suwon"
  //     }
  //     const doc = await db.collection("team").doc(teamId).get()
  //     if(doc.exists){
  //       localStorage.setItem("selectedTeamId",doc.id)
  //       localStorage.setItem("selectedTeamName", doc.data().teamName)
  //     }
  //     setIsSelectedTeamLoading(false)
  //     setIsLoading(false)
  //   }
  //   fetchData2()
  // },[])
  
  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     // Reset scroll position on page change
  //     window.scrollTo(0, 0)
  //   }

  //   router.events.on('routeChangeComplete', handleRouteChange)

  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange)
  //   }
  // }, [router.events])

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollY(window.scrollY);
  //     console.log(window.scrollY)
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);


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



  if(isLoading)
  return(
    <>loadingapp</>
  )

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
            <div onScroll={handleScroll}>
            <PullToRefresh 
              className="refresh_container"
              isPullable={!router.pathname.includes("talk") || isScrollTop}
              onRefresh={handleRefresh} 
              refreshing={isRefreshing} 
              pullDownThreshold={90}
              resistance={2}
              maxPullDownDistance={150}
              pullingContent={<div style={{width:"100%", textAlign:"center", marginTop:"10px", fontSize:"13px"}}>끌어당겨서 새로고침</div>}
            >
                <Component {...pageProps} />
              
              
            </PullToRefresh>
            {!router.pathname.includes("preview") && !router.pathname.includes("walkthrough") && <BottomNavigation />}
            </div>
          {/* } */}
        </ThemeProvider>
      </AuthStateChanged>
    </DataProvider>
    </>
  )
}
