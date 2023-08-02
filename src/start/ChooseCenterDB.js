import { firestore as db } from "firebase/firebase";

export const DB = {

  FETCH_CENTER_LIST: async () => {
    const query = await db.collection("team").get();
    const list = query.docs.map((doc) => {
      return {...doc.data(), id: doc.id};
    });
    return list;
  },
  SET_SELECTED_TEAM: async (selectedTeamId, selectedTeamName, uid) => {
    await db.collection("user").doc(uid).update({
      selectedTeamId: selectedTeamId,
      selectedTeamName: selectedTeamName
    })
  },
  ADD_USER_TO_TEAM: async (teamId, uid) => {
    const teamDoc = await db.collection("team").doc(teamId).collection("users").doc(uid).get()
    //센터에 이미 등록된 유저인지 확인후 등록되지 않았다면
    if(!teamDoc.exists){
      //센터의 유저로 추가

      //센터의 알람이 설정되있지 않을경우 자동으로 센터의 알람 true로 설정
      //**구 버전 (삭제 필요) */
      await db.collection("team").doc(teamId).collection("users").doc(uid).set({})

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


      //**신 버전 */
      const alarmDoc = await db.collection("team").doc(teamId).get()

      //해당 team의 알림타입들을 모두 가져온다음 초기엔 모두 true로 모든 알림받기 적용
      const alarmType = alarmDoc.data().alarmType
      const alarmDetail = {}
      if(alarmType){
        for (const alarm of alarmType)
          alarmDetail[alarm.id] = true
        await db.collection("team").doc(teamId).collection("users").doc(uid).set({
          alarmDetail: alarmDetail
        })
      }
    }
  }
}