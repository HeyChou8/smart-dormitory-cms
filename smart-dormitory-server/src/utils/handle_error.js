const app = require('../app/index')
app.on('error',(error,ctx)=>{
    let code = 0
    let message =''
    switch(error){
        case 'account_or_password_is_required':
            code = -1001
            message = '用户名或者密码不能为空'
        break
        case 'account_is_already_exists':
            code = -1002
            message = '账号已经存在'
        break
        case 'account_is_not_exists':
            code =-1003
            message = '账户不存在,请检查您的账户名'
        break
        case 'password_is_incorrent':
            code = -1004
            message = '密码错误,请重新输入'
        break
        case 'unauthorization':
            code = -1005
            message = 'token过期或无效'
        break
        case 'is_not_admin':
            code = -1006
            message = '您不是管理员，无权限操作'
        break 
        case 'the_bed_has_been_allocated':
            code = -1007
            message = '该床位已经被分配'
    }
    ctx.body = {code,message}
})