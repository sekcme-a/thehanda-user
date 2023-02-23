import { useEffect, useState } from "react"
// import styles from "styles/components/myPage/myPageProfile.module.css"
import { useRouter } from "next/router"

import useAuth from "src/hooks/auth/auth"
import useUserData from "src/context/useUserData"
import { translate } from "src/hooks/translate"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { firebaseHooks } from "firebase/hooks"

const GroupsHeader = ({ selectedItem, handleChange, groups }) => {
  const { language, fetchText } = useUserData()
  const [lang, setLang] = useState("")

  
  return (
    <div className="news_container">
      <Tabs
        value={selectedItem}
        onChange={handleChange}
        variant={groups.length < 5 ? "fullWidth" : "scrollable"}
        // variant="scrollable"
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary"
        style={{ backgroundColor: "#fff8f9", height:"35px", minHeight:"35px"}}
        sx={{
          "& .MuiButtonBase-root": { color: "black", padding:"4px", height:"35px", minHeight:"35px" },
          "& .MuiTabs-indicator": { display: "none" },
          "& .Mui-selected": { color: "#f44336 !important" },
          "& .MuiTabs-flexContainer": {height:"35px"}
        }}
        centered={groups.length<5}
      >
        {groups.map((group, index) => {
            return (
              <Tab label={group.name} id={group.id} key={group.id} style={{ fontSize: "13px"}} />
            )
          })}

        </Tabs>
      </div>
    )
}

export default GroupsHeader