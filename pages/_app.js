import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import "src/public/styles/login.css"
import "src/public/styles/FullScreenLoader.css"
import "src/public/styles/calendar.css"
import { DataProvider } from "context/data";
import { UserDataProvider } from "context/userData"
import AuthStateChanged from "src/public/hooks/AuthStateChanged";
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
  const [isLoading, setIsLoading] = useState(false)
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
    return <>로딩중</>


  return(
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link href='https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css' rel='stylesheet'></link>
      </Head>
    <UserDataProvider>
      <AuthStateChanged setIsLoading={setIsLoading}>
        <DataProvider setIsLoading={setIsLoading}>
          <ThemeProvider theme={theme}>
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
              {!router.pathname.includes("preview") && !router.pathname.includes("start") && <BottomNavigation2 />}
              </div>
            {/* } */}
          </ThemeProvider>
        </DataProvider>
      </AuthStateChanged>
    </UserDataProvider>
    </>
  )
}
