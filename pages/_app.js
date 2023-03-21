import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import { DataProvider } from "context/data";
import AuthStateChanged from "src/public/hooks/AuthStateChanged";
import BottomNavigation from "src/public/components/BottomNavigation";
import { useEffect, useState } from "react";
import { firestore as db } from "firebase/firebase";
import { useRouter } from "next/router";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head from "next/head";

export default function App({ Component, pageProps }) {
  const [isSelectedTeamLoading, setIsSelectedTeamLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [scrollY, setScrollY] = useState()
  const router = useRouter()
  const theme = createTheme({
    palette: {
      primary: {
        main: '#814ad8'
      }
    }
  });

  useEffect(()=>{
    const fetchData = async () => {
      let teamId = localStorage.getItem("selectedTeamId")
      if(teamId===null){
        teamId="suwon"
      }
      const doc = await db.collection("team").doc(teamId).get()
      if(doc.exists){
        localStorage.setItem("selectedTeamId",doc.id)
        localStorage.setItem("selectedTeamName", doc.data().teamName)
      }
      setIsSelectedTeamLoading(false)
    }
    fetchData()
  },[])
  
  useEffect(() => {
    const handleRouteChange = () => {
      // Reset scroll position on page change
      window.scrollTo(0, 0)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // if(isLoading||isSelectedTeamLoading)
  //   return(
  //     <div>loading</div>
  //   )
  if(!isSelectedTeamLoading)
  return(
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
    <DataProvider>
      <AuthStateChanged>
        <ThemeProvider theme={theme}>
          <div className="safearea">
            <Component {...pageProps} />
            {!router.pathname.includes("preview") && <BottomNavigation />}
          </div>
        </ThemeProvider>
      </AuthStateChanged>
    </DataProvider>
    </>
  )
}
