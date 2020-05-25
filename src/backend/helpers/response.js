const { corsDomain } = require(`../config/${process.env.ENV}.json`)

const dynamicCors = origin => {
  if (corsDomain) return corsDomain

  if (
    origin.endsWith(`imgthreads.netlify.app`) ||
    origin.startsWith('http://localhost:')
  ) {
    return origin
  }

  return null
}

module.exports.buildResponse = (origin, body) => ({
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': dynamicCors(origin),
  },
  body: JSON.stringify(body),
})
