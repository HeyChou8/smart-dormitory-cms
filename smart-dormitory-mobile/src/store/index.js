import { create } from 'zustand'
import { devtools} from 'zustand/middleware'
const UseMonitorStore = create(devtools(
    (set,get) => ({
        temperature:0,
        presence:false,
         // 监控页面
        // 修改温度和人体存在
        changeTemPresenceAction: async(temperature,presence) => {
            set({temperature,presence})
            // return {temperature:get().temperature,presence:get().presence}
        }
})))
export default UseMonitorStore