const app = require('./app/index')
require('./utils/handle_error')
// 启动app
app.listen(8001,'0.0.0.0',() => {
    console.log('服务器启动')
})