import MyRequest from './request/index.ts'
import { BASE_URL, TIMEOUT } from './request/config'
import { localCache } from '../utils/cache.ts'
const myRequest = new MyRequest({
    baseURL:BASE_URL,
    timeout: TIMEOUT,
    interceptors:{
        requestSuccessFn: (config) => {
            // 每一个请求都自动携带token
            const token = localCache.getCache('login_token')
            if (config.headers && token) {
              config.headers.Authorization = token
            }
            return config
        }
    }
})
export default myRequest