import { firestore as db } from "firebase/firebase";

export const DB = {
  UPDATE_USER_INFO: (uid, data) => {
    return db.collection("user").doc(uid).update({
      ...data,
      level: "normal"
    });
  },
}