import { useEffect, useState } from "react"
// import styles from "styles/components/myPage/myPageProfile.module.css"
import { useRouter } from "next/router"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const HomeHeader = ({ selectedItem, handleChange }) => {
  const lang = "ko"
  if(lang==="ko" || lang==="zh" || lang==="ja")
  return (
    // <div style={{width:"100%", position: "fixed", top:0, left: 0, zIndex:"99999999", backgroundColor:"white"}}>
      <Tabs
        value={selectedItem}
        onChange={handleChange}
        variant="fullWidth"
        scrollButtons="auto"
        textColor='secondary'
        indicatorColor='secondary'
        centered
      >
        <Tab label="프로그램" style={{fontSize:"15px"}} />
        <Tab label="설문조사" style={{fontSize:"15px"}}/>
        <Tab label="공지사항"style={{fontSize:"15px"}} />
        <Tab label="소식" style={{fontSize:"14px"}}/>
      </Tabs>
    // </div>
    )
  // if(lang==="en")
  // return (
  //   // <div style={{width:"100%", position: "fixed", top:0, left: 0, zIndex:"99999999", backgroundColor:"white"}}>
  //     <Tabs
  //       value={selectedItem}
  //       onChange={handleChange}
  //       variant="fullWidth"
  //       scrollButtons="auto"
  //       textColor='secondary'
  //       indicatorColor='secondary'
  //       centered
  //     >
  //       <Tab label={text.program} style={{ fontSize: "14px" }} />
  //       <Tab label={text.survey} style={{ fontSize: "14px" }} />
  //       <Tab label={text.anouncement} style={{ fontSize: "11px" }}  />
  //       <Tab label={text.multicultural_news} style={{ fontSize: "10px" }} />
  //     </Tabs>
  //   // </div>
  //   )
  // if( lang==="th")
  // return (
  //   // <div style={{width:"100%", position: "fixed", top:0, left: 0, zIndex:"99999999", backgroundColor:"white"}}>
  //     <Tabs
  //       value={selectedItem}
  //       onChange={handleChange}
  //       variant="fullWidth"
  //       scrollButtons="auto"
  //       textColor='secondary'
  //       indicatorColor='secondary'
  //       centered
  //     >
  //       <Tab label={text.program} style={{ fontSize: "14px" }} />
  //       <Tab label={text.survey} style={{ fontSize: "14px" }} />
  //       <Tab label={text.anouncement} style={{ fontSize: "14px" }}  />
  //       <Tab label={text.multicultural_news} style={{ fontSize: "10px" }} />
  //     </Tabs>
  //   // </div>
  //   )
  // if (lang === "vi")
  // return (
  //   // <div style={{width:"100%", position: "fixed", top:0, left: 0, zIndex:"99999999", backgroundColor:"white"}}>
  //     <Tabs
  //       value={selectedItem}
  //       onChange={handleChange}
  //       variant="fullWidth"
  //       scrollButtons="auto"
  //       textColor='secondary'
  //       indicatorColor='secondary'
  //       centered
  //     >
  //       <Tab label={text.program} style={{ fontSize: "12px" }} />
  //       <Tab label={text.survey} style={{ fontSize: "12px" }} />
  //       <Tab label={text.anouncement} style={{ fontSize: "14px" }}  />
  //       <Tab label={text.multicultural_news} style={{ fontSize: "10px" }} />
  //     </Tabs>
  //   // </div>
  //   )
}

export default HomeHeader