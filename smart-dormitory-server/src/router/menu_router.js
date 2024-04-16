const KoaRouter = require('@koa/router')
const menuRouter = new KoaRouter({prefix: '/menu'})
const { create, list } = require('../controller/menu_controller')
const { verifyAuth } = require('../middleware/login_middleware')
// 新建菜单
menuRouter.post('/',verifyAuth,create)
// 展示菜单列表
menuRouter.post('/list/:id',verifyAuth,list)
module.exports = menuRouter