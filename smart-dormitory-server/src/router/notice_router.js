const KoaRouter = require('@koa/router')
const noticeRouter = new KoaRouter({prefix: '/notice'})
const {create,update,list,remove} = require('../controller/notice_controller')
const { verifyAuth } = require('../middleware/login_middleware')
const { verifyIsAdmin } = require('../middleware/repair_middleware')
// 提交通知
noticeRouter.post('/',verifyAuth,verifyIsAdmin,create)
// 展示通知列表
noticeRouter.post('/list',verifyAuth,list)
// 管理员才能编辑通知
noticeRouter.patch('/:id',verifyAuth,verifyIsAdmin, update)
// 删除通知
noticeRouter.delete('/:id',verifyAuth,verifyIsAdmin,remove)
module.exports = noticeRouter