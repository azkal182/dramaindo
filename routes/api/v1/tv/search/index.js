'use strict'
const Dramaindo = require('../../../../../lib/dramaindo.js')
module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    const tv  = new Dramaindo()
    const query = request.query.q
    // console.log(page)
    
    const tmdb = request.query.tmdb
    //console.log(request.query)
    const data = await tv.search(query, tmdb ? tmdb : false)
    //console.log(data)
    return data
  })
}
