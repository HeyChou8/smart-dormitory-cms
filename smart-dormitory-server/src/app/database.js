const mysql = require('mysql2')
// 创建连接池
const connectionPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'smart-dormitory',
    user: 'root',
    password: 'cjt001115',
    connectionLimit: 5
})
// 查看连接是否成功
connectionPool.getConnection((err,connection) => {
    // 判断是否有错误信息
    if(err){
        console.log('获取连接失败',err)
        return
    }
    // 获取connection，尝试与数据库建立一下连接
    connection.connect(err => {
        if(err) {
            console.log('与数据库交互失败',err)
        }else {
            console.log('和数据库交互成功')
        }
    })
})
// 获取连接池中的连接对象
const connection = connectionPool.promise()
module.exports = connection