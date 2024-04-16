const userService = require('../service/user_service')
const md5password = require('../utils/md5_password')
const {PUBLIC_KEY} = require('../config/screct')
const jwt = require('jsonwebtoken')
const verifyLogin = async(ctx,next)=> {
    const {account,password} = ctx.request.body
    // 1.判断用户名和密码是否为空
    if(!account || !password){
        return ctx.app.emit('error','account_or_password_is_required',ctx)
    }
    // 2.查询用户是否在数据库中存在
    const users =  await userService.findUserByAccount(account)
    const user = users[0]
    if(!user){
        return ctx.app.emit('error','account_is_not_exists',ctx)
    }
     // 3.查询数据库中的密码和用户传递的密码是否一致
     if(user.password !== md5password(password)){
        return ctx.app.emit('error','password_is_incorrent',ctx)
    }
    // 4.将user对象保存在ctx,生成token的时候要拿出来
    ctx.user = user
    // 执行下一个中间件
    await next()
}
const verifyAuth = async(ctx,next) => {
    // 1.获取token
    const authorization = ctx.header.authorization
    if(!authorization){
        return ctx.app.emit('error','unauthorization',ctx)
    }
    const token = authorization.replace('Bearer ','')
    // 2.验证token
   try {
    // 获取到token的信息
    const result = jwt.verify(token,PUBLIC_KEY,{
        algorithm: ['RS256']
    })
    // console.log(result)
    // 将token的信息保留下来 
    ctx.user = result
    // 执行下一个中间件
    await next()
   } catch (error) {
    ctx.app.emit('error','unauthorization',ctx)
   }
}
module.exports = { verifyLogin,verifyAuth }