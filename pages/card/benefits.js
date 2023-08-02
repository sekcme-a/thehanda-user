import { useState, useEffect } from "react"
import useData from "context/data"
import useUserData from "context/userData"
import { useRouter } from "next/navigation"
import styles from "src/card/Benefits.module.css"
import Image from "next/image"

import TopNavbar from "src/index/TopNavbar"
import Menu from "src/public/components/header/Menu"
import FullScreenLoader from "src/public/components/FullScreenLoader"
import HeaderNav from "src/card/HeaderNav"
import { Grid, Dialog, FormControl, InputLabel, Select, MenuItem } from "@mui/material"


const Benefits = () => {
  const {locationList, SET_LOCATION_LIST, benefitList, SET_BENEFIT_LIST, centerList, SET_CENTER_LIST} = useData()
  const {userData} = useUserData()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const onDialogClose = () => {setIsDialogOpen(false)}

  const [list, setList] = useState([])

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const handleIsMenuOpen = (bool) => setIsMenuOpen(bool)
  const onMenuClick = () => {
    setIsMenuOpen(true)
    setTimeout(() => {
      setIsHide(true)
    }, 400)
  }
  const [isHide, setIsHide] = useState(false)

  const [selectedLocation, setSelectedLocation] = useState("")

  const [selectedType, setSelectedType] = useState("카페")
  const handleTypeChange = (e, newValue) => {
    setSelectedType(newValue)
    if(benefitList)
      sort_list_by_type(benefitList[selectedLocation],newValue)
  }

  useEffect(()=>{
    const fetchData = async () => {
      let currentSelectedLocation = selectedLocation
      let currentCenterList = centerList
      let currentBenefitList = benefitList
      if(!locationList)
        await SET_LOCATION_LIST()
      if(!centerList){
        currentCenterList = await SET_CENTER_LIST()
      }
      if(currentSelectedLocation===""){
        const selectedTeamData = currentCenterList.filter(center => center.id === userData.selectedTeamId)
        if(selectedTeamData){
          setSelectedLocation(selectedTeamData[0].location)
          currentSelectedLocation = selectedTeamData[0].location
        }
      }
      if(!benefitList || !benefitList[currentSelectedLocation]){
        currentBenefitList = await SET_BENEFIT_LIST(currentSelectedLocation)
      }
      sort_list_by_type(currentBenefitList[currentSelectedLocation],selectedType)
        
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  },[selectedLocation])

  const sort_list_by_type = (list,type) => {
    const sorted_list = list.filter(item => item.type===type)
    setList(sorted_list)
  }

  const onLocationClick = () => {
    setIsDialogOpen(true)
  }

  if(isLoading) 
    <FullScreenLoader />
  
  return(
    <div className={styles.main_container}>
      <TopNavbar scrollY={1} onMenuClick={onMenuClick} teamName="Basic" hideArrow/>
      <Menu isMenuOpen={isMenuOpen} handleIsMenuOpen={handleIsMenuOpen}  setIsHide={setIsHide} /> 

      <div className={styles.header_container}>
        <div className={styles.location_select_container}>
          <h1><strong>{selectedLocation}</strong> 혜택 현황</h1>
          <p onClick={onLocationClick}>지역선택</p>
        </div>
        <HeaderNav {...{selectedType, setSelectedType}} handleChange={handleTypeChange}/>
      </div>

      {list.length==0 && <h1 className={styles.no_benefit}>아직 혜택이 없습니다.</h1>}

      <ul className={styles.list_container}>
        {list.map((item, index) => {
          return(
            <Grid container className={styles.item_container} key={`${item.id}_${index}`} onClick={()=>router.push(`/card/benefit/${item.id}`)}>
              <Grid item xs={2.8}>
                <Image width={75} height={75} src={item.logoURL} alt="로고" style={{borderRadius:"10px", overflow:'hidden'}}/>
              </Grid>
              <Grid item xs={9.2} className={styles.content}>
                <h1>{item.companyName}</h1>
                <h2>{item.benefitSummary}</h2>
                <h3>{item.infoSummary}</h3>
              </Grid>
            </Grid>
          )
        })}
      </ul>

      <Dialog
        onClose={onDialogClose}
        open={isDialogOpen}
      >
        <div className={styles.dialog_container}>
          <h1>지역을 선택해주세요.</h1>
          <FormControl fullWidth size="small">
            <InputLabel id="simple-select-label">지역</InputLabel>
            <Select
              value={selectedLocation}
              label="지역"
              onChange={(e)=>{setSelectedLocation(e.target.value); setIsDialogOpen(false)}}
            >
              {locationList?.map((item, index) => (
                <MenuItem value={item} key={index}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
        </div>
      </Dialog>
    </div>
  )
}

export default Benefits