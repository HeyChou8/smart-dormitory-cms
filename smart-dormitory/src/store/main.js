
import { create } from 'zustand'
import {createJSONStorage, devtools,persist} from 'zustand/middleware'
import { deleteUserById, editUserById, newUser, 
    postUserList,postRepairList,deleteRepairById,newRepair,changeStatusRepairById,
    postNoticeList,newNotice,deleteNoticeById,editNoticeById, saveProfile, postProfile, deleteProfile} from '../service/main/main'
import { formatUTC } from '../utils/format_time'

const UseMainStore = create(devtools(
    
    (set,get) => ({
        code:1,
        errorMessage:'',
        userList: [],
        userTotalCount: 0,
        repairTotalCount:0,
        noticeTotalCount:0,
        menuList:[],
        repairList: [],
        noticeList: [],
        offset:0,
        temperature:0,
        presence:false,
        // 将每页的偏移值上传
        changeOffsetAction:(offset) =>{
            set({offset})
        },
        // 当删除每页最后一条数据时offset - 10
        changeOffsetActionAsync:async(list) =>{
            if(!(list.length-1)){
                await new Promise((res) => {
                    setTimeout(() => {
                        set((state) => ({offset:state.offset - 10}))
                        res()
                    },100)
                })
            }
            
        },
        // 用户页面
        // 展示用户
        postUserListAction: async(queryInfo) => {
            const userListResult = await postUserList(queryInfo)
            const list = userListResult?.data?.list
            const totalCount = userListResult?.data?.totalCount
            const userList = list?.map(item => {
                // 格式化时间
                const createAt = formatUTC(item.createAt)
                const updateAt = formatUTC(item.updateAt)
                const key = item.id
                return {...item,createAt,updateAt,key}
            })
            set({userList})
            set({userTotalCount: totalCount})
        },
        // 删除用户
        deleteUserByIdAction: async(id)=>{
            const deleteResult =  await deleteUserById(id)
            const deleteFailedUserMessage = deleteResult?.deleteFailedMessage
            get().postUserListAction({offset:get().offset,size:10})
            return deleteFailedUserMessage
        },
        // 编辑用户
        editUserByIdAction: async(id,userInfo) =>{
            const editResult = await editUserById(id,userInfo)
            get().postUserListAction({offset:get().offset,size:10})
        },
        // 注册用户
        newUserAction: async(userInfo)=>{
            const newResult = await newUser(userInfo)
            const errorMessage = newResult?.message
            const code = newResult?.code
            set({errorMessage})
            set({code})
            get().postUserListAction({offset: 0,size:10})
            // 返回状态码和错误信息
            return {errorMessage: get().errorMessage,code:get().code }
        },

        // 报修页面
        // 展示报修列表
        postRepairListAction: async(queryInfo) => {
            const repairListResult = await postRepairList(queryInfo)
            const list = repairListResult?.data?.list
            const totalCount = repairListResult?.data?.totalCount
            const repairList = list?.map(item => {
                // 格式化时间
                const createAt = formatUTC(item.createAt)
                const key = item.id
                return {...item,createAt,key}
            })
            set({repairList})
            set({repairTotalCount: totalCount})
        },
        // 删除报修
        deleteRepairByIdAction: async(id)=>{
            const deleteResult =  await deleteRepairById(id)
            await get().postRepairListAction({offset:get().offset,size:10})
        },
        // 提交报修
        newRepairAction: async(userInfo)=>{
            const newResult = await newRepair(userInfo)
            get().postRepairListAction({offset: 0,size:10})
        },
        // 管理员修改状态
        changeStatusRepairAction: async(id,repairInfo) =>{
            const changeResult = await changeStatusRepairById(id,repairInfo)
            get().postRepairListAction({offset:get().offset,size:10})
        },

        // 通知页面
        // 展示通知列表
        postNoticeListAction: async(queryInfo) => {
            const noticeListResult = await postNoticeList(queryInfo)
            const list = noticeListResult?.data?.list
            const totalCount = noticeListResult?.data?.totalCount
            const noticeList = list?.map(item => {
                // 格式化时间
                const createAt = formatUTC(item.createAt)
                const updateAt = formatUTC(item.updateAt)
                const key = item.id
                return {...item,createAt,updateAt,key}
            })
            set({noticeList})
            set({noticeTotalCount: totalCount})
        },
        // 删除通知
        deleteNoticeByIdAction: async(id,role)=>{
            const deleteResult =  await deleteNoticeById(id,role)
             await get().postNoticeListAction({offset: get().offset,size:10})    
        },
        // 提交通知
        newNoticeAction: async(noticeInfo)=>{
            const newResult = await newNotice(noticeInfo)
            get().postNoticeListAction({offset: 0,size:10})
            return newResult
        },
        // 管理员编辑通知
        editNoticeAction: async(id,noticeInfo) =>{
            const editResult = await editNoticeById(id,noticeInfo)
            get().postNoticeListAction({offset:get().offset,size:10})
        },


        // 个人信息页面
        // 保存个人信息
        saveProfileAction:async(user_id,profileInfo)=> {
            const saveResult = await saveProfile(user_id,profileInfo)
            return saveResult
            // get().postProfileAction(get().user_id)
        },
        // 获取个人信息
        postProfileAction:async(user_id)=>{
            const postResult = await postProfile(user_id)
            // console.log(postResult.data[0])
            function isEmptyObject(obj) {
                if(obj){
                    return Object.keys(obj).length !== 0;
                }
              }
            // 拿出个人信息
            if(isEmptyObject(postResult?.data[0])){
                const {username,gender,department,major,dormitory,cellphone,start_year,mail} = postResult?.data[0]
                const profileInfo = {username,gender,department,major,dormitory,cellphone,start_year,mail}
                if(profileInfo){
                    return profileInfo
                }
            // 存入
            // set({profileInfo})
            }
           
        },
        // 删除个人信息
        deleteProfileAction: async(user_id) =>{
            const deleteResult = await deleteProfile(user_id)
            return deleteResult
        },

        // 监控页面
        // 修改温度和人体存在
        changeTemPresenceAction: async(temperature,presence) => {
            set({temperature,presence})
            // return {temperature:get().temperature,presence:get().presence}
        }
    })
))
export default UseMainStore