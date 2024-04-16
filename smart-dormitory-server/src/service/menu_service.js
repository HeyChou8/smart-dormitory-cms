const connection = require('../app/database')
class MenuService{
    async create(menu){
        // 1.获取menu
        const { menu_name,menu_url } = menu
        // 2.拼接statement
        const statement = 'INSERT INTO `menu` (menu_name,menu_url) VALUES (?,?);'
        // 3.执行sql语句
        const [result] = await connection.execute(statement,[menu_name,menu_url])
        return result
    }
    async queryList(user_id){
        const statement = `SELECT menu.menu_id,menu.menu_name, menu.menu_url
        FROM permission
        JOIN menu ON permission.menu_id = menu.menu_id
        WHERE permission.user_id = ?;`
        const [list] = await connection.execute(statement,[user_id])
        return list
    }
}
module.exports = new MenuService()