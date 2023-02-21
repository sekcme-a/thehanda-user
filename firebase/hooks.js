import { firestore as db, storage } from "firebase/firebase"
import { resolve } from "styled-jsx/css"
import { handleProfileImage } from "src/hooks/handleProfileImage"

export const firebaseHooks = {
  is_team_admin: (uid, teamName) => {
    return new Promise((resolve, reject) => {
      try {
        db.collection("users").doc(uid).get().then((doc) => {
          if (doc.data().roles.includes(`admin_${teamName}`))
            resolve(true)
          else
            resolve(false)
        })
      } catch (e) {
        reject(e)
      }

    })
  },
  get_random_id_from_collection: (collection) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.collection(collection).doc().id
        resolve(result)
      } catch (e) {
        reject(e)
      }

    })
  },
  overWrite: (collectionName, docName, overWriteData) => {
    return new Promise(async (resolve, reject) => {
      try {
        db.collection(collectionName).doc(docName).get().then((doc) => {
          db.collection(collectionName).doc(docName).set({ ...doc.data(), ...overWriteData })
        })
        resolve("success")
      } catch (e) {
        console.log(e)
        resolve(e)
      }
    })

  },
  fetch_admin_uid_list_from_teamname: (teamname) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("here")
        let result = []
        db.collection("admin_group").doc(teamname).collection("members").get().then((query) => {
          query.docs.forEach((value, index, array) => {
            result.push(value.id)
            console.log(value.id)
            if (index === array.length - 1)
              resolve(result)
          })
        })
      } catch (e) {
        reject(e)
      }

    })
  },
  fetch_all_not_admin_users_uid_list: () => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("here")
        let result = []
        db.collection("users").get().then((query) => {
          query.docs.forEach((value, index, array) => {
            if(value.data().roles[0]==="user")
              result.push(value.id)
            if (index === array.length - 1)
              resolve(result)
          })
        })
      } catch (e) {
        reject(e)
      }

    })
  },
  fetch_user_data_list_from_user_uid_list: (idList) => {
    return new Promise((resolve, reject) => {
      if (idList.length === 0)
        reject("list length is 0")
      try {
        let result = []
        idList.forEach(async (value, index, array) => {
          const doc = await db.collection("users").doc(value).get()
          result.push(doc)
          if (index === array.length - 1)
            resolve(result)
        })
      } catch (e) {
        reject(e)
      }

    })
  },
  give_admin_role_with_user_uid: (uid, teamname) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(uid)
        const user = await db.collection("users").doc(uid).get()
        if (!user.exists)
          reject("없는 코드입니다.")
        else if (user.data().roles.includes(`admin_${teamname}`))
          reject("이미 팀의 구성원입니다.")
        else {
          const batch = db.batch()
          batch.update(db.collection("users").doc(uid), { roles: [`admin_${teamname}`] })
          batch.set(db.collection("admin_group").doc(teamname).collection("members").doc(uid), { role: "admin" })
          await batch.commit();
          resolve("성공적으로 추가되었습니다.")
        }
      } catch (e) {
        reject(e.message)
      }

    })
  },
  delete_admin_role_with_user_uid: (uid, teamname) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.collection("admin_group").doc(teamname).collection("members").doc(uid).get()
        console.log(teamname, uid)
        if (!user.exists)
          reject("팀의 구성원이 아닙니다.")
          // resolve("성공적으로 삭제되었습니다.")
        else {
          const batch = db.batch()
          batch.update(db.collection("users").doc(uid), { roles: ["user"] })
          batch.delete(db.collection("admin_group").doc(teamname).collection("members").doc(uid))
          await batch.commit();
          resolve("성공적으로 삭제되었습니다.")
        }
      } catch (e) {
        reject(e.message)
      }
    })
  },
  set_object_to_firestore_collection: (data, collection, doc) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (doc)
          await db.collection(collection).doc(doc).set(data)
        else
          await db.collection(collection).set(data)
        resolve("success")
      } catch (e) {
        console.log(e)
        reject(e.message)
      }
    })
  },
  get_data_from_collection: (collection, doc) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.collection(collection).doc(doc).get()
        resolve(result.data())
      } catch (e) {
        reject(e.message)
      }
    })
  },
  fetch_language_with_user_uid: (uid) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.collection("users").doc(uid).get()
        resolve(result.data().language)
      } catch (e) {
        reject(e.message)
      }
    })
  },
  fetch_profile_settings_object: (location, mainOrSub) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.collection("profileSettings").doc(location).get()
        if (!result.exists) {
          resolve([])
        }
        if (mainOrSub === "main")
          resolve(result.data().main)
        else
          resolve(result.data().sub)
      } catch (e) {
        reject(e.message)
      }
    })
  },
  upload_image_to_storage: (file, fileName) => {
    return new Promise(async function (resolve, reject) {
      try {
        const fileRef = storage.ref().child(fileName)
        await fileRef.put(file)
        const url = await fileRef.getDownloadURL()
        resolve(url)
      } catch (e) {
        reject(e.message)
      }
    })
  },
  
  fetch_user_profile: (uid) => {
    return new Promise(async function (resolve, reject) {
      try {
        const result = await db.collection("users").doc(uid).get()
        resolve(result.data())
      } catch (e) {
        reject(e.message)
      }
    })
  },
  add_form_item_to_profile_settings: (formData, teamName, id) => {
    return new Promise(async function (resolve, reject) {
      try {
        console.log(teamName)
        await db.collection("profileSettings").doc(teamName).collection("data").doc(id).set(formData)
        resolve("success")
      } catch (e) {
        reject(e.message)
      }
    })
  },
  delete_form_item_from_profile_settings: (teamName, id) => {
    return new Promise(async function (resolve, reject) {
      try {
        await db.collection("profileSettings").doc(teamName).collection("data").doc(id).delete()
        resolve("success")
      } catch (e) {
        reject(e.message)
      }
    })
  },
  fetch_team_list: () => {
    return new Promise(async function (resolve, reject) {
      try {
        let list = []
        const city = localStorage.getItem("city")
        db.collection("admin_group").get().then((query) => {
          query.docs.forEach((doc) => {
            if (doc.data().name) {
              if(doc.id===city)
                list = ([{name: doc.data().name, id: doc.id}, ...list])
              else
                list.push({ name: doc.data().name, id: doc.id })
            }
          })
          resolve(list)
        })
      } catch (e) {
        reject(e.message)
      }
    })
  },
  fetch_additional_profile_as_array: (uid) => {
    return new Promise(async function (resolve, reject) {
      try {
        db.collection("users").doc(uid).collection("additional_profile").get().then((query) => {
          if (query.docs.length === 0)
            resolve([])
          else {
            let result = []
            // query.docs.map((doc) => {
            
            //     console.log(doc.id)
            //   console.log(doc.data().value)
            //   result.push({ id: doc.id, value: doc.data().value })
            //   console.log(result)

            // })
            for (let i = 0; i < query.docs.length; i++){
              const value = query.docs[i].data().value
              result.push({ id: query.docs[i].id, value: value})
            }
            resolve(result)
          }
        })
      } catch (e) {
        reject(e.message)
      }
    })
  },
  set_array_to_form_data: (uid, formId, data) => {
    return new Promise(async function (resolve, reject) {
      try {
        const batch = db.batch()
        data.forEach(async (item) => {
          console.log(item.value)
          if (item.value[0]===undefined || item.value[0].name===undefined)
            batch.set(db.collection("users").doc(uid).collection(formId).doc(item.id), { id: item.id, value: item.value })
          else {
            try {
              const date = new Date()
              let urlList = []
              for (let i = 0; i < item.value.length; i++){
                if (item.value[i].url === undefined) {
                  const photoURL = await handleProfileImage(item.value[i], `users/${uid}/${item.value[i].name}date=${date.toUTCString()}`, 1)
                  console.log(photoURL)
                  urlList.push({ url: photoURL, name: item.value[i].name })
                } else {
                  urlList.push({url:item.value[i].url, name: item.value[i].name })
                }
              }
              db.collection("users").doc(uid).collection(formId).doc(item.id).set({ id: item.id, value: urlList })
            } catch (e) {
              console.log(e)
            }
          }
        })
        await batch.commit()
      } catch (e) {
        reject(e.message)
      }
    })
  },
  fetch_user_city: (uid) => {
    return new Promise(async function (resolve, reject) {
      try {
        const doc = await db.collection("users").doc(uid).get()
        resolve(doc.data().city)
      } catch (e) {
        reject(e.message)
      }
    })
  },
  save_content: (teamName, type, id, data) => {
    console.log("adsf")
    return new Promise(async function (resolve, reject) {
      console.log(data)
      try {
        console.log(data)
        db.collection("contents").doc(teamName).collection(type).doc(id).get().then((doc) => {
          if(doc.exists)
            db.collection("contents").doc(teamName).collection(type).doc(id).update(data)
          else
            db.collection("contents").doc(teamName).collection(type).doc(id).set(data)
        })
        
        resolve("success")
      } catch (e) {
        console.log(e)
        reject(e.message)
        
      }
    })
  },
  publish_content: (teamName, type, id, uid, isPublished, publishStartDate) => {
    return new Promise(async function (resolve, reject) {
      try {
        await db.collection("contents").doc(teamName).collection(type).doc(id).update({
          published: isPublished, publishedDate: publishStartDate, savedDate: new Date(), lastSaved: uid
        })
        resolve("success")
      } catch (e) {
        reject(e.message)
        console.log(e)
      }
    })
  },
  fetch_contents_list : (teamName, type, limit, admin) => {
    return new Promise(async function (resolve, reject) {
      try {
        let list = []
        let contents
        if(admin === true)
          contents = await db.collection("contents").doc(teamName).collection(type).orderBy("savedDate", "desc").limit(limit).get()
        else
          // contents = await db.collection("contents").doc(teamName).collection(type).where("published","==",true).orderBy("savedDate", "desc").limit(limit).get()
          contents = await db.collection("contents").doc(teamName).collection(type).where("published","==",true).orderBy("publishedDate", "desc").limit(limit).get()
        const groupData = await db.collection("admin_group").doc(teamName).get()
        contents.docs.map((doc) => {
          list.push({
            id: doc.id,
            title: doc.data().title,
            subtitle: doc.data().subtitle,
            thumbnailImg: doc.data().thumbnailImg,
            published: doc.data().published,
            publishedDate: doc.data().publishedDate,
            savedDate: doc.data().savedDate,
            lastSaved: doc.data().lastSaved,
            deadline: doc.data().deadline,
            hasSurvey: doc.data().hasSurvey,
            surveyId: doc.data().surveyId,
            groupName: groupData.data().name,
            keyword: doc.data().keyword,
            date: doc.data().date,
            teamName: teamName,
            thumbnailBackground: doc.data().thumbnailBackground,
            mainThumbnailImg: doc.data().mainThumbnailImg,
          })  
        })
        resolve(list)
      } catch (e) {
        reject(e.message)
        console.log(e)
      }
    })
  },

  fetch_content_from_id: (type, teamName, id) => {
    return new Promise(async function (resolve, reject) {
      try {
        await db.collection("contents").doc(teamName).collection(type).doc(id).get().then((doc) => {
          resolve(doc.data())
        })
      } catch (e) {
        reject(e.message)
        console.log(e)
      }
    })
  },
  // submit_form_input: (type, teamName, id, uid,data) => {
  //   return new Promise(async function (resolve, reject) {
  //     try {
  //       await db.collection("contents").doc(teamName).collection(type).doc(id).collection("result").doc(uid).set({
  //         data: data
  //       })
  //       resolve("success")
  //     } catch (e) {
  //       reject(e.message)
  //       console.log(e)
  //     }
  //   })
  // },
  submit_form_input: (uid, formId, type, teamName, data, submitCount) => {
    return new Promise(async function (resolve, reject) {
      try {
        const batch = db.batch()
        let dataList = []
        data.map(async (item, index) => {
          console.log(item.value)
          
          if (item.value[0]===undefined || item.value[0].name===undefined)
            dataList.push( { id: item.id, value: item.value })
          else {
            try {
              const date = new Date()
              let urlList = []
              for (let i = 0; i < item.value.length; i++){
                if (item.value[i].url === undefined) {
                  const photoURL = await handleProfileImage(item.value[i], `contents/${formId}/result/${item.value[i].name}date=${date.toUTCString()}`, 1)
                  console.log(photoURL)
                  urlList.push({ url: photoURL, name: item.value[i].name })
                } else {
                  urlList.push({url:item.value[i].url, name: item.value[i].name })
                }
              }
              dataList.push({ id: item.id, value: urlList })
              console.log(index, data.length-1)
              // if(index===data.length-1){
              //   await db.collection("contents").doc(teamName).collection(type).doc(formId).collection("result").doc(uid).set({data: dataList, createdAt: new Date()})
                // if(type==="programs" && submitCount)
                //   await db.collection("contents").doc(teamName).collection(type).doc(formId).update({submitCount: submitCount+1 })
                // else if(type==="programs")
                //   await db.collection("contents").doc(teamName).collection(type).doc(formId).update({submitCount: 1})
              // }
            } catch (e) {
              console.log(e)
            }
          }
        })
        if(type==="programSurvey"){
          await db.collection("programSurvey").doc(formId).collection("result").doc(uid).set({data: dataList})
          await db.collection("users").doc(uid).collection("programSurvey").doc(formId).update({hasSubmit: true})
        }
        else
          await db.collection("contents").doc(teamName).collection(type).doc(formId).collection("result").doc(uid).set({data: dataList, createdAt: new Date()})
        resolve("success")
      } catch (e) {
        reject(e.message)
      }
    })
  }, 

  add_timeline: (uid, type, createdAt, title, text, docId) => {
    return new Promise(async function (resolve, reject) {
      try {
        await db.collection("users").doc(uid).collection("timeline").doc().set({
          type: type,
          createdAt: createdAt,
          title: title,
          text: text,
          docId: docId,
        })
        resolve("success")
      } catch (e) {
        reject(e.message)
        console.log(e)
      }
    })
  },
}