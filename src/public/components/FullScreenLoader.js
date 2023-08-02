import styles from "./FullScreenLoader.module.css"


const FullScreenLoader = ({isLoading}) => {
  return(
    <div className={isLoading ? "loader" : "loader hide"}>
      <div class="word">
        <span>더</span>
        <span>한</span>
        <span>다</span>
        <span>+</span>
      </div>
      <div class="bar"></div>
      <p>Multicultural Plus+</p>
    </div>

  )
}

export default FullScreenLoader