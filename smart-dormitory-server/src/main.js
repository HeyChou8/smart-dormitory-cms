const app = require('./app/index')
require('dotenv').config()
require('./utils/handle_error')
const port = process.env.PORT || 8001
// 启动app
app.listen(port,'0.0.0.0',() => {
    console.log('服务器启动')
})