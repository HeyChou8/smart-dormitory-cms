const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/screct')
class LoginController {
    sign(ctx,next){
        // 1.获取用户信息
        const { id, account,role } = ctx.user
        // 2.颁发令牌token
        // 新版本的jwt不能解析buffer,降为8版本的
        // 获得公钥私钥的指令，window要在git bash下使用
        // OpenSSL genrsa -out private.key 1024
        // OpenSSL rsa -in private.key -pubout -out public.key
       const token = jwt.sign({id,account},PRIVATE_KEY,{expiresIn:60*60*24,algorithm:'RS256'})
    //    console.log(token)
    //    const token = 1
       // 3.返回用户信息
       ctx.body = {code: 0,data: { id, account, token,role }}
    }
    test(ctx,next){
        ctx.body = '验证通过'
    }
}
module.exports = new LoginController()