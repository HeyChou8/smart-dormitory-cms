const connection = require('../app/database')
class UserService {
    async create(user){
        // 1.获取用户user
        const { account, password,dormitory_number,bed_number,role } = user
        // 2.拼接statement
        // 插入数据
        const statement = 'INSERT INTO `user` (account,password,dormitory_number,bed_number,role) VALUES (?,?,?,?,?);'
        // 将菜单和用户表进行关联，后面可以用用户id获取菜单
        let statement1 = ``
        if(role === '管理员'){
             statement1 = `INSERT INTO permission (user_id, menu_id)
            SELECT user.id, menu.menu_id
            FROM user
            CROSS JOIN (
                SELECT 1 as menu_id UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                    SELECT 5
                    ) AS menu
            WHERE user.role = '管理员'
            ORDER BY menu.menu_id;`
        }else if(role === '学生') {
             statement1 = `INSERT INTO permission (user_id, menu_id)
            SELECT user.id, menu.menu_id
            FROM user
            CROSS JOIN (
                SELECT 2 as menu_id UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5
                    ) AS menu
            WHERE user.role = '学生'
            ORDER BY menu.menu_id;`
        }
        // 删除权限表中重复的权限，避免出现重复菜单
        const statement2 = `DELETE p1
        FROM permission p1
        JOIN permission p2 ON p1.user_id = p2.user_id AND p1.menu_id = p2.menu_id
        WHERE p1.permission_id > p2.permission_id;`
        // 3.执行sql语句
        const [result] = await connection.execute(statement,[account, password,dormitory_number,bed_number,role])
        const [result1] = await connection.execute(statement1)
        const [result2] = await connection.execute(statement2)
        return {result,result1,result2}
    }
    // 查询是否有相同的用户
    async findUserByAccount(account){
        const statement = 'SELECT * FROM `user` WHERE account = ?;'
        const [ values ] =  await connection.execute(statement, [account])
        return values 
    }
    // 查询列表 按id降序排序，单条件或多条件模糊查询
    async queryList(offset,size,account,dormitory_number,bed_number,role){
        let statement = `SELECT * FROM user WHERE 1=1`;
        const params = [];
    
        if (account) {
            statement += ` AND account LIKE ?`;
            params.push(`%${account}%`);
        }
    
        if (dormitory_number) {
            statement += ` AND dormitory_number LIKE ?`;
            params.push(`%${dormitory_number}%`);
        }
    
        if (bed_number) {
            statement += ` AND bed_number LIKE ?`;
            params.push(`%${bed_number}%`);
        }
        if (role) {
            statement += ` AND role LIKE ?`;
            params.push(`%${role}%`);
        }
        statement += ` ORDER BY id DESC`;
        if (offset !== undefined && size !== undefined) {
            statement += ` LIMIT ? OFFSET ?`;
            params.push(String(size), String(offset));
        }
        const [result] = await connection.execute(statement, params);
        return result;
    }
    // 统计用户
    async totalCount(){
        const statement = `SELECT COUNT(*) totalCount FROM user;`
        const [totalCount] = await connection.execute(statement)
        return totalCount
    }
    // 编辑修改用户
    async update(account,dormitory_number,bed_number,role,id){
        const statement = `UPDATE user SET account = ?,dormitory_number = ?,bed_number = ?,role=? WHERE id = ?;`
        const [result] = await connection.execute(statement,[account,dormitory_number,bed_number,role,id])
        return result
    }
    async remove(id){
        const statement0 = `SET FOREIGN_KEY_CHECKS=0;`
        const statement = `DELETE FROM user WHERE id = ?;`
        const statement1 = `SET FOREIGN_KEY_CHECKS=1;`
        // 关闭外键约束
        const [result0] = await connection.execute(statement0)
        // 删除
        const [result] = await connection.execute(statement,[id])
        // 打开外键约束
        const [result1] = await connection.execute(statement1)
        return {result0,result,result1}
    }
    async queryById(id){
        const statement = `SELECT id, account, dormitory_number, bed_number,createAt,updateAt FROM user WHERE id = ?;`
        const [result] = await connection.execute(statement,[id])
        return result
    }
    
}
module.exports = new UserService()