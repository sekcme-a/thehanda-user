import styles from "./menuItemsContainer.module.css"
import { useRouter } from "next/router"
import useData from "context/data"

//items = [{icon: <></>, text: ""},]
const MenuItemsContainer = ({ items }) => {
  // const { user, logout } =   ()
  const router = useRouter()
  const onLogoutClick = () => {
    logout()
  }
  const onClick = (path) => {
    console.log(path)
    if(path)
      router.push(path)
  }
  return (
    <div className={styles.main_container}>
      {items?.map((item, index) => {
        return (
          <div className={styles.item_container} key={index}>
            <h1>{item.title}</h1>
            {item?.data?.map((content, index) => {
              console.log(content)
              return(
                <div key={index} className={styles.content_container} onClick={() => onClick(content.path)}>
                  {content.icon}
                  <p>{content.text}</p>
                </div>
              )
            })}
          </div>
        )
      })}
      <div style={{height: "300px", width:"100%", backgroundColor: "rgb(235,235,235)"}} ></div>
    </div>
  )
}

export default MenuItemsContainer