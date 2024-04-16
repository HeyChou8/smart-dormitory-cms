const KoaRouter = require('@koa/router')
const koaBody = require('koa-body')
const serve = require('koa-static');
const profileRouter = new KoaRouter({prefix: '/profile'})
const {info,remove, save,avatar,changePwd} = require('../controller/profile_controller')
const { verifyAuth } = require('../middleware/login_middleware')
const path = require('path')
require('dotenv').config()
const uploadsDir = path.join(process.env.BASE_DIR, 'uploads');

// 保存个人信息，如果同个user_id已经有信息了则执行更新语句，否则执行创建语句
profileRouter.post('/:id',verifyAuth,save)
// 删除个人信息
profileRouter.delete('/:id',verifyAuth,remove)
// 展示个人信息
profileRouter.post('/info/:id',verifyAuth,info)
// 上传头像
profileRouter.post('/uploads/:id', koaBody({
    multipart: true,
    formidable: {
      uploadDir: uploadsDir, // 指定文件上传目录
      keepExtensions: true, // 保持文件扩展名，避免文件同名的情况，提高安全性
      maxFileSize: 2 * 1024 * 1024, // 设置最大文件大小为2MB
    }
  }),avatar)

// 修改密码
profileRouter.post('/changePwd/:id',changePwd)

module.exports = profileRouter

