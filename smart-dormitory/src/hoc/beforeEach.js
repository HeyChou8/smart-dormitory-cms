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
    const copyRole = localCache.getCache('copyRole')
    // console.log(token)
    useEffect(() => {
      // 没有token时拦截
        if(!token && route.pathname != "/login"){
          navigate('/login')
      }
      
      // 判断是学生还是管理员进行重定向
      if(role ==='学生'){
        navigate('/main/visual')
        localCache.setCache('copyRole',role)
        localCache.removeCache('role')
      }else if(role === '管理员'){
        navigate('/main/visual')
        localCache.setCache('copyRole',role)
        localCache.removeCache('role')
      }
      // 当角色为学生时拦截通过路由进入用户管理页面
      if(copyRole==='学生' && route.pathname === '/main/user'){
      navigate('/main/visual')
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