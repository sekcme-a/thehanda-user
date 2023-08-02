import { firestore as db } from "firebase/firebase"

export const DB = {
  FETCH_REQUESTED_DATA : async (uid) => {
    const doc = await db.collection("benefitRequest").doc(uid).get()
    if (doc.exists)
      return doc.data()
    else
      return false
  },
  SUBMIT_REQUEST : async (uid, data) => {
    const doc = await db.collection("benefitRequest").doc(uid).set(data).then(()=> {
      return true
    })
  },
  DELETE_REQUEST : async (uid) => {
    const doc = await db.collection("benefitRequest").doc(uid).delete().then(()=> {
      return true
    })
  }
}