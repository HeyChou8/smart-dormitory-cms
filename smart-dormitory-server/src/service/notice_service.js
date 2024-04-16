const connection = require('../app/database')
class NoticeService {
    async create(noticeInfo){
        // 获取数据
        const {title,notice_content} = noticeInfo
        // sql语句
        const statement = 'INSERT INTO `notice` (title,notice_content) VALUES (?,?);'
        // 执行sql
        const [result] = await connection.execute(statement,[title,notice_content])
        return result
    }
    // 查询列表 按id降序排序，单条件或多条件模糊查询
    async queryList(offset,size,title){
        let statement = `SELECT * FROM notice WHERE 1=1`;
        const params = [];
    
        if (title) {
            statement += ` AND title LIKE ?`;
            params.push(`%${title}%`);
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
        const statement = `SELECT COUNT(*) totalCount FROM notice;`
        const [totalCount] = await connection.execute(statement)
        return totalCount
    }
    // 编辑
    async update(title,notice_content,id){
        const statement = `UPDATE notice SET title = ?,notice_content = ? WHERE id = ?;`
        const [result] = await connection.execute(statement,[title,notice_content,id])
        return result
    }
    // 删除
    async remove(id){
        const statement = `DELETE FROM notice WHERE id = ?;`
        // 删除
        const [result] = await connection.execute(statement,[id])   
        
        return result
    }
}
module.exports = new NoticeService()