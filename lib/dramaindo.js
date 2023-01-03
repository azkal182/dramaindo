const axios = require('axios')
const cheerio = require('cheerio')
// import axios from  'axios'
// import cheerio  from 'cheerio';
const url = 'https://drama.nontondrama.lol/'
 class Dramaindo {
    async index(mode, page=1) {
        let output;
        if (mode === "latest") {
            output = "latest";
        } else if (mode === "popular") {
            output = "populer";
        } else if (mode === "rating") {
            output = "rating";
        } else if (mode === "top-today") {
            output = "top-movie-today";
        } else if (mode === "rating") {
            output = "rating";
        } else if (mode === "action") {
            output = "genre/action";
        } else if (mode === "comedy") {
            output = "genre/comedy";
        } else if (mode === "horror") {
            output = "genre/horror";
        } else if (mode === "sci-fi") {
            output = "genre/sci-fi";
        } else if (mode === "mandarin") {
            output = "country/china";
        } else if (mode === "korea") {
            output = "country/south-korea";
        } else if (mode === "asian") {
            output = "series/asian";
        } else if (mode === "west") {
            output = "series/west";
        } else if (mode === "west") {
            output = "series/west";
        } else if (mode === "ongoing") {
            output = "series/ongoing";
        } else if (mode === "complete") {
            output = "series/complete";
        } else if (mode === "2021") {
            output = "year/2021";
        } else if (mode === "2022") {
            output = "year/2022";
        } else {
            output = "latest";
        }
        console.log((url + output + '/page/' + page ))
        try {
            const { data: html } = await axios(url + output +  '/page/' + page)
            const index = []
            const $ = cheerio.load(html)
            const list = $('#grid-wrapper > div')
            list.each(function () {
                const script = $(this).find('script').text().replace(/\\n|\\'|\\"|\\&|\\r|\\t|\\b|\\f|[\u0000-\u0019]+|@/g, "")
                const json = JSON.parse(script)
                const title = json.name.toLowerCase().replace(/\s*\(\d+\)/, '')
                const link = json.url
                const type = json.type
                const id = json.id.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/)[5].replaceAll('/', '').trim();
                const poster = "https:"+json.image
                const datePublished = json.datePublished
                const genres = json.genre
                const dateCreated = json.dateCreated
                const rating = json.aggregateRating ? json.aggregateRating : null
                const trailer = json.hasPart.potentialAction.target[0].urlTemplate
                index.push({ title, type, id, link, poster, datePublished, dateCreated, genres, rating, trailer })
            })

            const currentPage = $('#pagination > nav > ul > li.active > span').text()
            const totalPage = $('#pagination > nav > ul > li:nth-child(5) > a').text()
            return ({ totalPage, currentPage, count: index.length, results: index })
        } catch (error) {
            console.log(error)
        }

    }
    
    
    async search(q, tmdb = false) {
  try {
   const { data: html } = await axios(url + "?s=" + q);

   const index = [];
   const $ = cheerio.load(html);
   const list = $(".search-item");

   list.each(function () {
    const script = $(this)
     .find("script")
     .text()
     .replace(/\\n|\\'|\\"|\\&|\\r|\\t|\\b|\\f|[\u0000-\u0019]+|@/g, "");
    const json = JSON.parse(script);
    const title = $(this)
     .find("figure >a")
     .attr("title")
     .replace(/\s*\(\d+\)/, "");
    const link = $(this).find("figure >a").attr("href");

    const id = link
     .match(
      /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
     )[5]
     .replaceAll("/", "")
     .trim();
    const poster = "https:" + json.image;
    const datePublished = json.datePublished;
    const genres = json.genre;
    const dateCreated = json.dateCreated;
    const rating = json.aggregateRating ? json.aggregateRating : null;
    const trailer = json.hasPart.potentialAction.target[0].urlTemplate;
    // this filter only series
    const exclude = $(this).find(".cat-links > a:nth-child(1)").attr("href");
    // console.log(exclude)
    if (exclude.match(/series/)) {
     index.push({
      title,
      id,
      link,
      genres,
      rating,
      datePublished,
      dateCreated,
      poster,
      trailer,
      TMDB: [],
     });
    }
   });
   if (tmdb) {
    for (let i = 0; i < index.length; i++) {
     const query = index[i].title;
     let { data } = await axios.get(
      "https://api.themoviedb.org:443/3/search/tv?api_key=243bd781b4261e4fade9058a64105c28&query=" +
       query
     );

     index[i]["TMDB"] = data.results[0];
    }
   }

   return { length: index.length, results: index };
  } catch (error) {
   console.log(error);
  }
 }
}


// const drama = new Dramaindo()

// drama.index('action', 2)
module.exports = Dramaindo
