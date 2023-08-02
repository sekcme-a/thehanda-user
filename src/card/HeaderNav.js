import { Tabs, Tab } from "@mui/material"
import { useState, useEffect } from "react"

const HeaderNav = ({selectedType, handleChange}) => {
  return(
    <Tabs
    value={selectedType}
    onChange={handleChange}
    variant="fullWidth"
    scrollButtons="auto"
    textColor='secondary'
    indicatorColor='secondary'
    centered
  >
    <Tab label="카페" value="카페" style={{fontSize:"15px"}} />
    <Tab label="음식점" value="음식점" style={{fontSize:"15px"}}/>
    <Tab label="서비스" value="서비스" style={{fontSize:"15px"}} />
    <Tab label="기타" value="기타" style={{fontSize:"14px"}}/>
  </Tabs>
  )
}

export default HeaderNav