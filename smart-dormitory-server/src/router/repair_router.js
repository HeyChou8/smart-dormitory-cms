const KoaRouter = require('@koa/router')
const repairRouter = new KoaRouter({prefix: '/repair'})
const {create,change,list,remove} = require('../controller/repair_controller')
const { verifyAuth } = require('../middleware/login_middleware')
const {verifyIsAdmin} = require('../middleware/repair_middleware')

// 提交报修
repairRouter.post('/',verifyAuth, create)
// 删除报修
repairRouter.delete('/:id',verifyAuth,remove)
// 展示报修列表
repairRouter.post('/list',verifyAuth,list)
// 管理员修改报修状态
repairRouter.patch('/:id',verifyAuth,verifyIsAdmin,change)
module.exports = repairRouter