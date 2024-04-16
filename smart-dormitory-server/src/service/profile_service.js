const connection = require('../app/database')
const md5password = require('../utils/md5_password')
class ProfileService {
    // 创建个人信息
    async create(user_id,profileInfo){
        // 获取数据
        const {username,gender,department,major,dormitory,cellphone,start_year,mail} = profileInfo
        // sql语句
        const statement = 'INSERT INTO `profile`(user_id,username,gender,department,major,dormitory,cellphone,start_year,mail) VALUES (?,?,?,?,?,?,?,?,?);'
        // 执行sql
        const [result] = await connection.execute(statement,[user_id,username,gender,department,major,dormitory,cellphone,start_year,mail])
        return result
    }
    // 查询个人信息
    async info(user_id){
        // sql语句
        const statement = 'SELECT * FROM `profile` WHERE user_id = ?;'
        const [result] = await connection.execute(statement,[user_id])
        return result
    }
    // 更新个人信息
    async update(user_id,profileInfo){
        // 获取数据
        const {username,gender,department,major,dormitory,cellphone,start_year,mail} = profileInfo 
        // sql语句
        const statement = 'UPDATE `profile` SET username = ?, gender = ?, department = ?, major = ?, dormitory = ?, cellphone = ?, start_year = ?, mail = ? WHERE user_id = ?;'
        const [result] = await connection.execute(statement,[username,gender,department,major,dormitory,cellphone,start_year,mail,user_id])
        return result
    }
    // 删除个人信息
    async remove(user_id){
        // sql语句
        const statement = 'DELETE FROM `profile` WHERE user_id = ?;'
        const [result] = await connection.execute(statement,[user_id])
        return result
    }
    // 验证user_id里是否语句有数据，避免重复创建数据
    async verifySameUserId(user_id){
        const statement = `SELECT * FROM profile WHERE user_id = ?;`
        const [result] =  await connection.execute(statement,[user_id])
        return result
    }
    // 上传头像
    async avatar(user_id,url){
        const statement = 'INSERT INTO `profile`(user_id,avatar_filepath) VALUES (?,?);'
        const [result] = await connection.execute(statement,[user_id,url])
        return result
    }
    // 更改头像文件路径
    async updateAvatar(user_id,url){
        const statement = 'UPDATE `profile` SET avatar_filepath = ? WHERE user_id = ?;'
        const [result] = await connection.execute(statement,[url,user_id])
        return result
    }
    async changePwd(user_id,pwdInfo){
        const { currentPassword, newPassword } = pwdInfo
        // 验证当前密码的正确性
        const statement0 = 'SELECT password FROM user WHERE id = ?;'
        const statement = 'UPDATE user SET password = ? WHERE id = ? AND password = ?;'
        const [user] = await connection.execute(statement0,[user_id])
        //更新密码
        const [result] = await connection.execute(statement,[md5password(newPassword),user_id,md5password(currentPassword)])
        return {result,user}
    }
}
module.exports = new ProfileService()