import { localCache } from "../utils/cache.ts"
import React from "react"
import { Navigate } from "react-router-dom"
const Login = React.lazy(() => import('../views/login'))
const Main = React.lazy(() => import('../views/main'))
const NotFound = React.lazy(() => import('../views/not-found'))
const MainUser = React.lazy(() => import('../views/main/c-cpns/main_user'))
const MainMonitor = React.lazy(() => import('../views/main/c-cpns/main_monitor'))
const MainCenter = React.lazy(() => import('../views/main/c-cpns/main_center'))
const MainRepair = React.lazy(() => import('../views/main/c-cpns/main_repair'))
const MainNotice = React.lazy(() => import('../views/main/c-cpns/main_notice'))
const role = localCache.getCache('role')
const routes = [
    {
        path: '/',
        element: <Navigate to="/login"/>
    },
    {
        path:"/main",
        element: <Main/>,
        children: [
            {
                path:'center',
                element:<MainCenter/>
            },
            {
                path: 'user',
                element: <MainUser/>
            },
            {
                path: 'monitor',
                element: <MainMonitor/>
            },
            {
                path:'repair',
                element:<MainRepair/>
            },
            {
                path: 'notice',
                element: <MainNotice/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: '*',
        element: <NotFound/>
    }

]
export default routes