const KoaRouter = require('@koa/router')
const {sign,test} = require('../controller/login_controller')
const loginRouter = new KoaRouter({prefix: '/login'})

const {verifyLogin,verifyAuth} = require('../middleware/login_middleware')
loginRouter.post('/',verifyLogin,sign)
loginRouter.get('/test',verifyAuth,test)
module.exports = loginRouter