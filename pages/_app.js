import "src/public/styles/reset.css"
import "src/public/styles/quill.css"
import { DataProvider } from "context/data";
import AuthStateChanged from "src/public/hooks/AuthStateChanged";
import BottomNavigation from "src/public/components/BottomNavigation";

export default function App({ Component, pageProps }) {
  return(
    <DataProvider>
      <AuthStateChanged>
        <Component {...pageProps} />
        <BottomNavigation />
      </AuthStateChanged>
    </DataProvider>
  )
}
