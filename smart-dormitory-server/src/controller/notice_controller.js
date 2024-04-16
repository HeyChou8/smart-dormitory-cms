const NoticeService = require('../service/notice_service')
class NoticeController {
    async create(ctx,next){
        // 拿到用户传递的信息
        const noticeInfo = ctx.request.body
        // 将信息存入数据库
        const result = await NoticeService.create(noticeInfo)
    // 告知前端创建成功
        ctx.body = {
            message: '创建成功',
            data:result
        }
    }
    // 展示列表
    async list(ctx,next){
        const {offset,size,title} = ctx.request.body
        const result = await NoticeService.queryList(offset,size,title)
        const totalCount =await NoticeService.totalCount()
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
        // 获取momentid
        const { id } = ctx.params
        // 操作数据库
        const result = await NoticeService.remove(id)
        ctx.body = {
            code: 0,
            message: '删除成功',
            data: result
        }
    }
    // 编辑
    async update(ctx,next){
        // 获取Id
        const { id } = ctx.params
        // 修改的内容
        const { title,notice_content } = ctx.request.body
        // 执行数据库操作
        const result = await NoticeService.update(title,notice_content,id)
        ctx.body = {
            code: 0,
            message: '更新成功',
            data: result
        }
    }
}
module.exports = new NoticeController()