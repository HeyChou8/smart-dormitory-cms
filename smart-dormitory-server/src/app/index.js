const Koa = require('koa')
// 引入环境变量确保绝对路径正确
require('dotenv').config()
const path = require('path')
const bodyParser = require('koa-bodyparser')
// 静态文件托管
const serve = require('koa-static')
const loginRouter = require('../router/login_router')
const userRouter = require('../router/user_router')
const menuRouter = require('../router/menu_router')
const repairRouter = require('../router/repair_router')
const noticeRouter = require('../router/notice_router')
const profileRouter = require('../router/profile_router')
const monitorRouter = require('../router/monitor_router')
// D:\基于物联网的智慧宿舍管理系统\smart-dormitory-server,
// 如果请求的路径有uploads文件夹的名字，那么托管的时候就不要加uploads
// 是从这个路径找文件夹，如果加上uploads就找不到uploads文件夹了
const uploadsDir = path.join(process.env.BASE_DIR);

const app = new Koa()
// 使用koa中间件允许跨域
const cors = require('@koa/cors');
app.use(cors());
app.use(bodyParser())
app.use(serve(uploadsDir))
app.use(loginRouter.routes())
app.use(loginRouter.allowedMethods())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())
app.use(menuRouter.routes())
app.use(menuRouter.allowedMethods())
app.use(repairRouter.routes())
app.use(repairRouter.allowedMethods())
app.use(noticeRouter.routes())
app.use(noticeRouter.allowedMethods())
app.use(serve(uploadsDir))
app.use(profileRouter.routes())
app.use(profileRouter.allowedMethods())
app.use(monitorRouter.routes())
app.use(monitorRouter.allowedMethods())
module.exports = app