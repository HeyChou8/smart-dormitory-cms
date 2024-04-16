const userService = require('../service/user_service')
const md5password = require('../utils/md5_password')
const verifyUser = async(ctx,next)=>{
    // 验证客户端传过来的user是否可以保存到数据库中
    // 验证账号密码是否为空
    const {account,password} = ctx.request.body
    // console.log(account,password)
    if(!account || !password){
        return ctx.app.emit('error','account_or_password_is_required',ctx)
    }
    // 判断account是否在数据库中存在
    const users = await userService.findUserByAccount(account)
    // console.log(users)
    if(users.length){
        return ctx.app.emit('error', 'account_is_already_exists',ctx)
    }
    await next()
}
const handlePassword = async(ctx,next) => {
    // 取出密码
    const {password} = ctx.request.body
    // 加密
    ctx.request.body.password = md5password(password)
    // console.log(ctx.request.body.password)
    await next()
}
module.exports = {verifyUser,handlePassword}