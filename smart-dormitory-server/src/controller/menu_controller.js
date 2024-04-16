const MenuService = require('../service/menu_service')
class MenuController {
    async create(ctx,next){
        // 拿到用户传递的信息
        const menu = ctx.request.body
        // 将信息存入数据库
        const result = await MenuService.create(menu)
        // console.log(result)
    // 告知前端创建成功
        ctx.body = {
            message: '菜单创建成功',
            data:result
        }
    }
    async list(ctx,next){
        const { id } = ctx.params
        const result = await MenuService.queryList(id)
        ctx.body = {
            code: 0,
            message: '菜单查询成功',
            data: {
                list: result
            },
            
        }
        
    }
}
module.exports = new MenuController()