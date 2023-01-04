const axios = require("axios");
const cheerio = require("cheerio");
// import axios from  'axios'
// import cheerio  from 'cheerio';
const url = "https://lk21official.info/";
class Movie {
    async index(mode, page = 1, tmdb = false) {
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
        // console.log((url + output + '/page/' + page ))
        try {
            const { data: html } = await axios(url + output + "/page/" + page);
            const index = [];
            const $ = cheerio.load(html);
            const list = $("#grid-wrapper > div");
            list.each(function () {
                const script = $(this)
                    .find("script")
                    .text()
                    .replace(/\\n|\\'|\\"|\\&|\\r|\\t|\\b|\\f|[\u0000-\u0019]+|@/g, "");
                const json = JSON.parse(script);
                const title = json.name.toLowerCase().replace(/\s*\(\d+\)/, "");
                const link = json.url;
                const type = json.type;
                const id = json.id
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
                index.push({
                    title,
                    type,
                    id,
                    link,
                    poster,
                    datePublished,
                    dateCreated,
                    genres,
                    rating,
                    trailer,
                });
            });

            if (tmdb) {
                for (let i = 0; i < index.length; i++) {
                    const query = index[i].title;
                    let { data } = await axios.get(
                        "https://api.themoviedb.org:443/3/search/movie?api_key=243bd781b4261e4fade9058a64105c28&query=" +
                        query
                    );

                    index[i]["TMDB"] = data.results[0];
                }
            }

            const currentPage = $("#pagination > nav > ul > li.active > span").text();

            const totalPage = $("#pagination > span ").text().match(/\d+/g)[1];
            return { totalPage, currentPage, count: index.length, results: index };
        } catch (error) {
            console.log(error);
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
                if (!exclude.match(/series/)) {
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
                        "https://api.themoviedb.org:443/3/search/movie?api_key=243bd781b4261e4fade9058a64105c28&query=" +
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

    async showData(query) {
        const config = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Encoding': 'application/json'
            }
        };

        let result = await axios.get(url + query,
            config).then((res) => {
                let html = res.data
                let $ = cheerio.load(html)
                let server_list = {}
                let data = {}
                let get_meta = $('.col-xs-9.content')
                data.title = $('body > main > section.breadcrumb > div > ol > li.last > span').text()
                data.quality = get_meta.find('div:nth-child(1) > h3').text()
                data.country = get_meta.find('div:nth-child(2) > h3').text()
                data.cast = []
                get_meta.find('div:nth-child(3) > h3').each(function () {
                    data['cast'].push($(this).text())
                })
                data.director = get_meta.find('div:nth-child(4) > h3').text()
                data.genre = []
                get_meta.find('div:nth-child(5) > h3').each(function () {
                    data['genre'].push($(this).text())
                })
                data.imdb = get_meta.find('div:nth-child(6) > h3:nth-child(2)').text()
                data.release = get_meta.find('div:nth-child(7) > h3').text()
                data.translator = get_meta.find('div:nth-child(8) > h3').text()
                data.uploaded = get_meta.find('div:nth-child(11) > h3').text()
                data.duration = get_meta.find('div:nth-child(12) > h3').text()
                data.overview = get_meta.find('blockquote').html().match(/<br>(.*?)<br>/m)[1].trim()
                data.trailer = $('#player-default > div > div.action-player > ul > li:nth-child(3) > a').attr('href')

                // this for find server embed
                let list = $('section').find('ul#loadProviders')
                list.children().each(function () {
                    const server = $(this).find('a').text()
                    const link = $(this).find('a').attr('href')

                    server_list[server] = {}

                    server_list[server]['link'] = link
                    server_list[server]['quality'] = []

                    $(this).find('span').each(function (v, i) {
                        server_list[server]['quality'].push($(this).text())
                    })
                })
                return {
                    ...data,
                    'server_embed': server_list
                }
            })


        const cookie = await this.getCookie(query)
        let get_download = await axios({
            method: 'post',
            url: "https://dl.indexmovies.xyz/verifying.php",
            data: {
                slug: query
            },
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 12; CPH2043) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Encoding': 'application/json',
                'cookie': cookie
            }
        }).then((res) => {
            let data = res.data
            const $ = cheerio.load(data)
            let list = $("tbody > tr");
            let index = {
                'link_download': []
            }
            list.each(function (v, i) {
                let item = $(this).find("strong").text()
                let link = $(this).find("a").attr('href')
                let quality = $(this).find("a").attr('class').substring(9, 13)
                index['link_download'].push({
                    item, link, quality
                })
            });

            return index
        })



        let employee = {
            ...result,
            ...get_download
        };

        return {
            message: 'success',
            results:
                employee

        }
    }

    async getCookie(id) {
        const config = {
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 12; CPH2043) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36',
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept-Encoding': 'application/json'
            }
        };

        let result = await axios.get("https://dl.indexmovies.xyz/get/" + id,
            config).then((res) => {
                let data = res.data
                const search = "setCookie('validate'"
                let idx = data.indexOf(search)
                let hasil = data.substring(idx + 23, idx + 63)
                return "validate=" + hasil
            });
        return result
    }



}

module.exports = Movie;
