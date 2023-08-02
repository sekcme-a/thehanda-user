import { firestore as db } from "firebase/firebase";

export const MyProfileDB = {
  FETCH_CENTER_LIST: async () => {
    const query = await db.collection("team").get();
    const list = query.docs.map((doc) => {
      return {...doc.data(), id: doc.id};
    });
    return list;
  },
  FETCH_PROFILE_SETTINGS: async (teamId) => {
    const doc = await db.collection("team").doc(teamId).collection("profileSettings").doc("main").get()
    return doc.data()?.data
  },
  UPDATE_USER_INFO: async (uid, values, profileData, team) => {
    await db.collection("user").doc(uid).update({
      ...values
    });
    if(team!==""){
      await db.collection("team").doc(team).collection("users").doc(uid).set({
        additionalData: profileData
      })
      await db.collection("team_admin").doc(team).collection("users").doc(user.uid).set({})
    }
  }
}