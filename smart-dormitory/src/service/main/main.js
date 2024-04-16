import myRequest from "..";

// 查询用户列表
export function postUserList(queryInfo){
    return myRequest.post({
        url: '/users/list',
        data: queryInfo
    })
}
// 删除用户
export function deleteUserById(id){
    return myRequest.delete({
        url: `/users/${id}`
    })
}
// 编辑用户
export function editUserById(id, userInfo) {
    return myRequest.patch({
      url: `/users/${id}`,
      data: userInfo
    })
  }
// 注册用户
export function newUser(userInfo) {
    return myRequest.post({
      url: '/users',
      data: userInfo
    })
  }

// 查询报修列表
export function postRepairList(repiarInfo){
  return myRequest.post({
    url:'/repair/list',
    data: repiarInfo
  })
}
// 提交报修
export function newRepair(repiarInfo){
  return myRequest.post({
    url:'/repair',
    data:repiarInfo
  })
}
// 删除报修
export function deleteRepairById(id){
  return myRequest.delete({
    url:`/repair/${id}`
  })
}
// 管理员修改报修状态
export function changeStatusRepairById(id,repairInfo){
  return myRequest.patch({
    url:`/repair/${id}`,
    data:repairInfo
  })
}

// 查询通知列表
export function postNoticeList(noticeInfo){
  return myRequest.post({
    url:'/notice/list',
    data: noticeInfo
  })
}
// 新建通知
export function newNotice(noticeInfo){
  return myRequest.post({
    url:'/notice',
    data:noticeInfo
  })
}
// 管理员删除报修
export function deleteNoticeById(id,role){
  return myRequest.delete({
    url:`/notice/${id}`,
    data: role
  })
}
// 管理员编辑通知
export function editNoticeById(id,noticeInfo){
  return myRequest.patch({
    url:`/notice/${id}`,
    data:noticeInfo
  })
}

// 保存更新信息
export function saveProfile(user_id,profileInfo){
  return myRequest.post({
    url:`/profile/${user_id}`,
    data:profileInfo
  })
}

// 获取个人信息
export function postProfile(user_id){
  return myRequest.post({
    url:`/profile/info/${user_id}`
  })
}

// 删除个人信息
export function deleteProfile(user_id){
  return myRequest.delete({
    url:`/profile/${user_id}`
  })
}

// 修改密码
export function changePwd(user_id,pwdInfo){
  return myRequest.post({
    url:`/profile/changePwd/${user_id}`,
    data:pwdInfo
  })
}