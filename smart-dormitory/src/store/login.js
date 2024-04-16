import { accountLoginRequest,postMenuList } from '../service/login/login'
import { create } from 'zustand'
import { localCache } from '../utils/cache.ts'
import {createJSONStorage, devtools,persist} from 'zustand/middleware'
import {jwtDecode} from 'jwt-decode'

const useLoginStore = create(devtools(
    (set,get) => ({
        token: '',
        errorMessage: '',
        role: '',
        menuList:[],
        accountStr: '',
        user_id:0,
        // 登录逻辑
        loginAccountAction: async(account) =>{
            const loginResult = await accountLoginRequest(account)
            const token = loginResult.data?.token
            const id = loginResult.data?.id
            const role = loginResult.data?.role
            const message = loginResult?.message
            const accountStr = loginResult.data?.account
            set({token})
            set({role})
            set({accountStr})
            set({user_id:id})
            set({errorMessage: message ? message : ''})
            // 将数据存入本地缓存
            localCache.setCache('login_token',get().token)
            localCache.setCache('role',get().role)
            localCache.setCache('account',get().accountStr)
            localCache.setCache('user_id',get().user_id)
            // 获取菜单
            const menuListResult = await postMenuList(id)
            const  list  = menuListResult?.data?.list
            set({menuList: list})
            // 将菜单存入本地
            localCache.setCache('menuList',get().menuList)
        },
        // 检查token有效性
        isTokenValidAction : () => {
            const token = localCache.getCache('login_token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    // Token 仍然有效
                    return true;
                } else {
                    // Token 已过期
                    return false;
                }
            } else {
              // Token 不存在
              return false;
          }
          }
        
    })
))
export default useLoginStore