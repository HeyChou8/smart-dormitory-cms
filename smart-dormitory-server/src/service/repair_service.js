
const connection = require('../app/database')
class RepairService {
    // 创建报修
    async create(repairInfo){
        // 获取数据
        const {dormitory_number, contact_person,cellphone,repair_content,repair_status} = repairInfo
        // sql语句
        const statement = 'INSERT INTO `repair` (dormitory_number,contact_person,cellphone,repair_content,repair_status) VALUES (?,?,?,?,?);'
        // 执行sql
        const [result] = await connection.execute(statement,[dormitory_number,contact_person,cellphone,repair_content,repair_status])
        return result
    }
    // 查询列表
    // async queryList(offset=0,size=10){
    //     // const statement = `SELECT id, account, dormitory_number, bed_number,createAt,updateAt FROM user LIMIT ? OFFSET ?;`
    //     const statement = `SELECT id, dormitory_number, contact_person,cellphone,repair_content,repair_status createAt FROM repair ORDER BY id DESC LIMIT ? OFFSET ?;`
    //     const [list] = await connection.execute(statement,[String(size),String(offset)])
    //     return list
    // }
    // 查询报修列表，按id降序排列，并且实现了单条件和多条件模糊查询
    async queryList(offset,size,dormitory_number,contact_person,cellphone,repair_content,repair_status){
        let statement = `SELECT * FROM repair WHERE 1=1`;
        const params = [];
    
        if (dormitory_number) {
            statement += ` AND dormitory_number LIKE ?`;
            params.push(`%${dormitory_number}%`);
        }
    
        if (contact_person) {
            statement += ` AND contact_person LIKE ?`;
            params.push(`%${contact_person}%`);
        }
    
        if (cellphone) {
            statement += ` AND cellphone LIKE ?`;
            params.push(`%${cellphone}%`);
        }
        if (repair_content) {
            statement += ` AND repair_content LIKE ?`;
            params.push(`%${repair_content}%`);
        }
    
        if (repair_status) {
            statement += ` AND repair_status LIKE ?`;
            params.push(`%${repair_status}%`);
        }
        statement += ` ORDER BY id DESC`;
        if (offset !== undefined && size !== undefined) {
            statement += ` LIMIT ? OFFSET ?`;
            params.push(String(size), String(offset));
        }
        const [result] = await connection.execute(statement, params);
        return result;
        }
    // 统计数量
    async totalCount(){
        const statement = `SELECT COUNT(*) totalCount FROM repair;`
        const [totalCount] = await connection.execute(statement)
        return totalCount
    }
    // 删除数据
    async remove(id){
        const statement = `DELETE FROM repair WHERE id = ?;`
        // 删除
        const [result] = await connection.execute(statement,[id])
        
        return result
    }
    // 管理员修改状态
    async change(repair_status,id){
        const statement = `UPDATE repair SET repair_status = ? WHERE id = ?;`
        const [result] = await connection.execute(statement,[repair_status,id])
        return result
    }
}
module.exports = new RepairService()