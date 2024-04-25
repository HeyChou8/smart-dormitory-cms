const UserService = require('../service/user_service')
class UserController {
    async create(ctx,next){
        // 拿到用户传递的信息
        const user = ctx.request.body
        try {
            // 将信息存入数据库
        const result = await UserService.create(user)
        // console.log(result)
         // 告知前端创建成功
        ctx.body = {
            code:0,
            message: '创建成功',
            data:result
        }
        } catch (error) {
            // 当宿舍号和床号的组合出现重复时返回错误
            if(error.code === 'ER_DUP_ENTRY'){
                return ctx.app.emit('error','the_bed_has_been_allocated',ctx)
            }
        }
    }
    async list(ctx,next){
        const {offset,size,account,dormitory_number,bed_number,role} = ctx.request.body
        const result = await UserService.queryList(offset,size,account,dormitory_number,bed_number,role)
        const totalCount =await UserService.totalCount()
        ctx.body = {
            code: 0,
            message: '查询成功',
            data: {
                list: result,
                totalCount:totalCount[0].totalCount
            },
            
        }
        
    }
    async update(ctx,next){
        // 获取Id
        const { id } = ctx.params
        // 修改的内容
        const { account,dormitory_number,bed_number,role } = ctx.request.body
        // 执行数据库操作
        const result = await UserService.update(account,dormitory_number,bed_number,role,id)
        ctx.body = {
            code: 0,
            message: '更新成功',
            data: result
        }
    }
    async remove(ctx,next){
        // 获取momentid
        const { id } = ctx.params
        // 操作数据库
        if(id == 63){
            ctx.body = {
                deleteFailedMessage:'此用户为初始管理员，无法删除'
            }
        }else {
            const result = await UserService.remove(id)
        ctx.body = {
            code: 0,
            message: '删除成功',
            data: result
        }
        }
        
    }
    async detail(ctx,next){
        // 1.获取动态的id
        const { id } = ctx.params
        // 2.根据id查询详情
        const result = await UserService.queryById(id)
        ctx.body = {
            code: 0,
            message: '查询成功',
            data: result[0]
        }
    }
}
module.exports = new UserController()