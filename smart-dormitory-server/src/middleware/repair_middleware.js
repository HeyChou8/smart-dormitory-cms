// 验证是否为管理员
const verifyIsAdmin = async(ctx,next) =>{
    const {role} = ctx.request.body
    if(role != '管理员'){
        return ctx.app.emit('error','is_not_admin',ctx)
    }
    await next()
}
module.exports = {verifyIsAdmin}