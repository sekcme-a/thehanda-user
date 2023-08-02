import Link from "next/link"
import styles from "./itemContainer.module.css"

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

const ItemContainer = ({ index, title, subtitle, icon, onClick}) => {
  if(subtitle)
    return (
      <div className={styles.item_container} key={index} onClick={onClick}>
        <div className={styles.icon_container}>
          {icon}
        </div>
        <div className={styles.text_container}>
          <p className={styles.name}>{title}</p>
          <p className={styles.info}>{subtitle}</p>
        </div>
        <div className={styles.arrow_container}>
          <KeyboardArrowRightRoundedIcon />
        </div>
      </div>
    )
  else
    return (
      <p className={styles.item_container2} onClick={onClick}>
        {title}
      </p>
    )
}

export default ItemContainer