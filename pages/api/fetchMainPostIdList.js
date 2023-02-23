const cheerio = require('cheerio')
const axios = require('axios')

export default async (req, res) => {
  if (req.method === 'POST') {
    const address = req.body.address
    let list = []
    try {
      res.statusCode = 200

      const fetchedHTML = await axios.get(address)
      const $ = cheerio.load(fetchedHTML.data)
      console.log(address)
      $("#artSlide2630.photo_box > li").find('a').each((index, element) => {
        console.log($(element))
        const id = parseInt($(element).attr("href").replace("/news/article.html?no=", ""))
        const thumbnailImg = $(element).children("span").children("img").attr("src")
        const category = $(element).children("div").children("b").text()
        const title = $(element).children("div").children("h3").text()
        const subtitle = $(element).children("div").children("p").text().substring(0,60)+"..."
        list.push({ id: id, thumbnailImg: thumbnailImg, category: category, title: title, subtitle: subtitle})
      })
      return res.json({
        idList: list
      })

      
    } catch (e) {
      res.statusCode = 404
      return res.json({
        fetchedHTML: "error",
        error: e.message
      })
    }
  }
}

// const cheerio = require('cheerio')
// const axios = require('axios')

// export default async (req, res) => {
//   if (req.method === 'POST') {
//     // const 
//     let address = "https://xn--vk1by6xrzecngs4l6obxj.com/"
//     let list = []
//     try {
//       res.statusCode = 200
//       for (let i = 0; i < 90; i++){
//         if (i < 10) {
//           const fetchedHTML = await axios.get(`${address}`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("1")
          
//         }
//         else if (i < 20) {
//           const fetchedHTML = await axios.get(`${address}/info/greet`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("2")
          
//         }
//         else if (i < 30) {
//           const fetchedHTML = await axios.get(`${address}/group/nation`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("3")
          
//         }
//         else if (i < 40) {
//           const fetchedHTML = await axios.get(`${address}/notice/schedule/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("4")
          
//         }
//         else if (i < 50) {
//           const fetchedHTML = await axios.get(`${address}/notice/anouncement/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("5")
          
//         }
//         else if (i < 60) {
//           const fetchedHTML = await axios.get(`${address}/notice/media/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("6")
          
//         }
//         else if (i < 70) {
//           const fetchedHTML = await axios.get(`${address}/notice/photo/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("7")
          
//         }
//         else if (i < 80) {
//           const fetchedHTML = await axios.get(`${address}/info/purpose`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("8")
          
//         }
//         else if (i < 90) {
//           const fetchedHTML = await axios.get(`${address}/info/status`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("9")
//         }
//       }
//       address = "https://xn--vk1by6x29i.com/"
//       for (let i = 0; i < 90; i++){
//         if (i < 10) {
//           const fetchedHTML = await axios.get(`${address}`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("1")
          
//         }
//         else if (i < 20) {
//           const fetchedHTML = await axios.get(`${address}/info/greet`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("2")
          
//         }
//         else if (i < 30) {
//           const fetchedHTML = await axios.get(`${address}/group/nation`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("3")
          
//         }
//         else if (i < 40) {
//           const fetchedHTML = await axios.get(`${address}/notice/schedule/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("4")
          
//         }
//         else if (i < 50) {
//           const fetchedHTML = await axios.get(`${address}/notice/anouncement/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("5")
          
//         }
//         else if (i < 60) {
//           const fetchedHTML = await axios.get(`${address}/notice/media/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("6")
          
//         }
//         else if (i < 70) {
//           const fetchedHTML = await axios.get(`${address}/notice/photo/1`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("7")
          
//         }
//         else if (i < 80) {
//           const fetchedHTML = await axios.get(`${address}/info/purpose`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("8")
          
//         }
//         else if (i < 90) {
//           const fetchedHTML = await axios.get(`${address}/info/status`)
//           const $ = cheerio.load(fetchedHTML.data)
//           console.log("9")
//         }
//       }
//       const fetchedHTML = await axios.get("https://xn--vk1by6xrzecngs4l6obxj.com/")
//       const $ = cheerio.load(fetchedHTML.data)
//       console.log("here")
      
//       $("#artSlide2630.photo_box > li").find('a').each((index, element) => {
//         console.log($(element))
//         const id = parseInt($(element).attr("href").replace("/news/article.html?no=", ""))
//         const thumbnailImg = $(element).children("span").children("img").attr("src")
//         const category = $(element).children("div").children("b").text()
//         const title = $(element).children("div").children("h3").text()
//         const subtitle = $(element).children("div").children("p").text().substring(0,60)+"..."
//         list.push({ id: id, thumbnailImg: thumbnailImg, category: category, title: title, subtitle: subtitle})
//       })
//       return res.json({
//         idList: list
//       })

      
//     } catch (e) {
//       res.statusCode = 404
//       return res.json({
//         fetchedHTML: "error",
//         error: e.message
//       })
//     }
//   }
// }