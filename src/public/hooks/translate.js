
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export const translate = async (text, fromLang, toLang) => {
  let url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
  url += '&q=' + encodeURI(text);
  url += `&source=${fromLang}`;
  if(toLang==="")
    return (text)
  else
    url += `&target=${toLang}`;
  return new Promise(async function (resolve, reject) {
    if (fromLang === toLang)
      resolve(text)
    else {
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        })
          .then(res => res.json())
          .then((response) => {
            if (response.data) {
              let translatedText = response.data.translations[0].translatedText.replace(/&#39;/g, "'");
              translatedText = translatedText.replace(/&quot;/g, `"`);
              resolve(translatedText)
            }
            else {
              reject(response.error.message)
            }
          })
      } catch (e) {
        reject(new Error(e.message))
      }
    }
  })
}
