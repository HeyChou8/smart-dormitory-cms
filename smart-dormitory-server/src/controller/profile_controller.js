const ProfileService =  require('../service/profile_service')
const path = require('path')
const md5password = require('../utils/md5_password')
class ProfileController {
    // 展示个人信息
    async info (ctx,next){
        // 拿数据
        const {id} = ctx.params
        const result = await ProfileService.info(id)
        ctx.body = {
            code: 0,
            message: '查询成功',
            data: result 
        }
    }
   
    // 删除个人信息
    async remove(ctx,next){
         // 拿数据
         const {id} = ctx.params
         const result = await ProfileService.remove(id)
         ctx.body = {
             code: 0,
             message:'重置成功',
             data: result 
         }
    }
    // 保存个人信息，如果同个user_id已经有信息了则执行更新语句，否则执行创建语句
    async save(ctx,next){
        const {id} = ctx.params
        const profileInfo = ctx.request.body
        const result = await ProfileService.verifySameUserId(id)
    if(!result.length){
         // 操作数据库
         const result = await ProfileService.create(id,profileInfo)
         ctx.body = {
             code:0,
             message:'保存成功',
             data:result
         }
    }else {
        // 操作数据库
        const result = await ProfileService.update(id,profileInfo)
        ctx.body = {
            code:0,
            message:'更新成功',
            data:result
        }
    }
    }
    // 上传头像
    async avatar(ctx,next){
        const {id} = ctx.params
        const file = ctx.request.files.avatar; // 获取上传的文件
        const basename = path.basename(file.filepath)
        const url =`http://${ctx.host}/uploads/${basename}`
        const result = await ProfileService.verifySameUserId(id)
        if(!result.length){
            // 操作数据库
            const result = await ProfileService.avatar(id,url)
            if (result.affectedRows === 1) {
                ctx.body = {
                  code: 0,
                  message: '文件上传成功',
                  url
                };
              } else {
                ctx.body = {
                  message: '文件上传失败',
                };
              }
       }else {
           // 操作数据库
           const result = await ProfileService.updateAvatar(id,url)
           ctx.body = {
               code:0,
               message:'头像更新成功',
               url
           }
       }
    }
    // 修改密码
    async changePwd(ctx,next){
        const {id} = ctx.params
        const pwdInfo = ctx.request.body
        const { currentPassword } = pwdInfo
        // 操作数据库
        const {result,user} = await ProfileService.changePwd(id,pwdInfo)
        // 验证当前密码的正确性
        if (user.length === 0) {
            // ctx.status = 404;
            ctx.body = { success: false, message: '用户不存在' };
            return;
          }
          const currentPasswordInDB = user[0].password;
          if (md5password(currentPassword) !== currentPasswordInDB) {
            // 如果当前密码不匹配
            // ctx.status = 400;
            ctx.body = { success: false, message: '当前密码错误' };
            return;
          }
        if (result.affectedRows > 0) {
            ctx.body = { 
                success: true,
                message:'修改成功' };
          } else {
            ctx.status = 400;
            ctx.body = { success: false, message: '密码修改失败' };
          }
    }
}
module.exports = new ProfileController()