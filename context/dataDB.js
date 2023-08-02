import { firestore as db } from "firebase/firebase";

export const DB = {
  //게제된지 1년내의 모든 프로그램 받아오기
  FETCH_DOCS_DATA: async (type, teamId) => {
    let date = new Date()
    date = date.setFullYear(date.getFullYear()-1)

    const query = await db.collection("team").doc(teamId).collection(type)
    .where("condition", "==", "confirm")
    .where("publishStartDate", ">=", new Date(date))
    .orderBy("publishStartDate", "desc")
    .get();
    const list = query.docs.map((doc) => {return {id: doc.id, ...doc.data()}})
    return list
  },

  FETCH_SECTION_DATA: async (teamId, type) => {
    const doc = await db.collection("team").doc(teamId).collection("section").doc(type).get()
    return doc?.data()?.data
  },

  FETCH_LOCATION_LIST: async () => {
    const doc = await db.collection("setting").doc("location").get()
    return doc?.data()?.data
  },
  FETCH_CENTER_LIST: async () => {
    const query = await db.collection("team").get();
    const list = query.docs.map((doc) => {
      return {...doc.data(), id: doc.id};
    });
    if(list)
      return list;
  },
}