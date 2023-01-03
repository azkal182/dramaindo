'use strict'
const Movie = require('../../../../../lib/movie.js')
module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const movie  = new Movie()
    const query = request.query.q
    // console.log(page)
    
    const tmdb = request.query.tmdb
    //console.log(request.query)
    const data = await movie.search(query, tmdb ? tmdb : false)
    //console.log(data)
    return data
  })
}
