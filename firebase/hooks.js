import { firestore as db, storage, auth } from "firebase/firebase"
import { resolve } from "styled-jsx/css"
// import { resolve } from "styled-jsx/css"
// import { handleProfileImage } from "xsrc/hooks/handleProfileImage"

export const FIREBASE = {
  UPDATE_USER_INFO: (uid, data) => {
    return db.collection("user").doc(uid).update({
      ...data
    });
  },
  FETCH_CENTER_LIST : async() => {
    const query = await db.collection("team").get();
    const list = query.docs.map((doc) => {
      return {...doc.data(), id: doc.id};
    });
    return list;
  },

  //어드민 팀이 아닌 해당 센터의 유저로 추가
  ADD_USER_TO_TEAM : async (teamId, uid) => {
    const teamDoc = await db.collection("team").doc(teamId).collection("users").doc(uid).get()
    if(!teamDoc.exists){
      //센터의 유저로 추가
      await db.collection("team").doc(teamId).collection("users").doc(uid).set({})

      //센터의 알람이 설정되있지 않을경우 자동으로 센터의 알람 true로 설정
      const userDoc = await db.collection("user").doc(uid).get()
      if(userDoc.exists){
        if(!userDoc.data().alarmSetting){
          await db.collection("user").doc(uid).update({
            alarmSetting: {[teamId]: true}
          })
        } else if (userDoc.data().alarmSetting[teamId]===undefined){
          await db.collection("user").doc(uid).update({
            alarmSetting: {...userDoc.data().alarmSetting, [teamId]: true}
          })
        }
      }
    }
  },
}