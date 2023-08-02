import { storage } from "./firebase"

export const STORAGE = {
  /**이미지 storage에 업로드 후 url 반환 */
  UPLOAD_IMAGE_TO_STORAGE: (file, filePath)=>{
    return new Promise(async(resolve, reject) => {
      try{
        const fileRef = storage.ref().child(filePath)
        await fileRef.put(file)
        const url = await fileRef.getDownloadURL()
        resolve(url)
      } catch(e){
        reject(e.message)
      }
    })
  },
}