import styles from "src/start/selectTeam.module.css"
import ChooseCenter from "src/start/ChooseCenter"
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useRouter } from "next/router";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useState } from "react";

const SelectTeam = () => {
  const router = useRouter()
  const [type, setType] = useState("center")
  return(
    <>
    <div className={styles.item_container}>
      <CloseRoundedIcon className={styles.close} onClick={()=>router.back()} />
      <h2 className={styles.subtitle}>
        단체를 선택해주세요.
      </h2>
      <h3 className={styles.info_text}>단체 선택은 언제든지 상단 메뉴를 통해 바꾸실 수 있습니다.</h3>
      <ChooseCenter />
    </div>
    </>
  )
}

export default SelectTeam