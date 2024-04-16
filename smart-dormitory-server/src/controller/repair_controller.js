const RepairService = require('../service/repair_service')
class RepairController {
    async create(ctx,next){
        // 拿到用户传递的信息
        const repairInfo = ctx.request.body
        // 将信息存入数据库
        const result = await RepairService.create(repairInfo)
    // 告知前端创建成功
        ctx.body = {
            message: '创建成功',
            data:result
        }
    }
    // 展示列表
    async list(ctx,next){
        const {offset,size,dormitory_number,contact_person,cellphone,repair_content,repair_status} = ctx.request.body
        const result = await RepairService.queryList(offset,size,dormitory_number,contact_person,cellphone,repair_content,repair_status)
        const totalCount =await RepairService.totalCount()
        ctx.body = {
            code: 0,
            message: '查询成功',
            data: {
                list: result,
                totalCount:totalCount[0].totalCount
            },
            
        }
    }
    // 删除
    async remove(ctx,next){
        // 获取id
        const { id } = ctx.params
        // 操作数据库
        const result = await RepairService.remove(id)
        ctx.body = {
            code: 0,
            message: '删除成功',
            data: result
        }
    }
    // 修改状态
    async change(ctx,next){
        const {id} = ctx.params
        const {repair_status} = ctx.request.body
        const result = await RepairService.change(repair_status,id)
        ctx.body = {
            code: 0,
            message:'修改成功',
            data:result
        }
        
    }
}
module.exports = new RepairController()