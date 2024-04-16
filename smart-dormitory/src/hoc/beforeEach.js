import { localCache } from '../utils/cache.ts'
import PropTypes from 'prop-types'
import React, { memo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const beforeEach = memo((props) => {
    const {children} = props
    const navigate = useNavigate()
    const route = useLocation()
    const token =  localCache.getCache('login_token')
    const role = localCache.getCache('role')
    const menuList = localCache.getCache('menuList')
    // console.log(token)
    useEffect(() => {
      // 没有token时拦截
        if(!token && route.pathname != "/login"){
          navigate('/login')
      }
      
      // 判断是学生还是管理员进行重定向
      if(role ==='学生'){
        navigate('/main/monitor')
        localCache.setCache('copyRole',role)
        localCache.removeCache('role')
      }else if(role === '管理员'){
        navigate('/main/user')
        localCache.setCache('copyRole',role)
        localCache.removeCache('role')
      }
      // 当角色为学生时拦截通过路由进入用户管理页面
      if(menuList?.length === 4 && route.pathname === '/main/user'){
      navigate('/main/monitor')
      }
      if(route.pathname === '/login'){
        // localCache.removeCache('login_token')
      }
    },[route.pathname])
  return (
    <>{props.children}</>
  )
})

beforeEach.propTypes = {
    children: PropTypes.any
}

export default beforeEach