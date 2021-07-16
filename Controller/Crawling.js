const axios = require('axios')
const fs = require('fs')
const cheerio = require('cheerio')

let resultList = [];
let cnt = 0;

module.exports = async(req,res)=>{
  await axios.get('https://www.worldometers.info/world-population/')
  .then(html => {
      let ulList = [];
      let $ = cheerio.load(html.data)
      $bodyList = $("#maincounter-wrap > div > span > span.rts-nr-int.rts-nr-10e9")
      console.log($bodyList.text())
      })
      

      
  }
