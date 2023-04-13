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
  }
}