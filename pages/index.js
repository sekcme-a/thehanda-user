import useData from "context/data"

const Home = () => {
  const {user, userData} = useData()

  return(
    <>
    <p>{user.uid}</p>
    <p>{userData.displayName}</p>
    </>
  )
}

export default Home