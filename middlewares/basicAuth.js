const auth = require('basic-auth')

module.exports = async (req, res, next) => {
    const credentials = auth(req)
    if (!credentials || credentials.name !== process.env.BASIC_AUTH_USER || credentials.pass !== process.env.BASIC_AUTH_PASS) {
        res.statusCode = 401
        res.setHeader('WWW-Authenticate', 'Basic realm="example"')
        res.end('Access denied')
    }
    next()
}