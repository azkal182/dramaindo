'use strict'
const Dramaindo = require('../../../lib/dramaindo.js')
module.exports = async function (fastify, opts) {
  fastify.get('/:mode', async function (request, reply) {
    const drama  = new Dramaindo()
    const page = request.query.page ? request.query.page : 1
    // console.log(page)
    const mode = request.params.mode
    const data = await drama.index(mode, page)
    return data
  })
}
