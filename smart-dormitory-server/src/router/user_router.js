const KoaRouter = require('@koa/router')
const userRouter = new KoaRouter({prefix: '/users'})
const {create,update,list,remove} = require('../controller/user_controller')
const { verifyUser,handlePassword } = require('../middleware/user_middleware')
const { verifyAuth } = require('../middleware/login_middleware')

// 用户注册
userRouter.post('/',verifyUser,handlePassword, create)
// 删除用户
userRouter.delete('/:id',verifyAuth,remove)
// 展示用户列表
userRouter.post('/list',verifyAuth,list)
// 修改用户
userRouter.patch('/:id',verifyAuth,update)
module.exports = userRouter