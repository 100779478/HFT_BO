import vue from 'vue';
import VueRouter from 'vue-router';

vue.use(VueRouter)
const router = new VueRouter(
    {
        routes: [
            {
                path: '/',
                redirect: '/login',
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('@/pages/login/Login')
            },
            {
                path: '*',
                name: 'NotFound',
                component: () => import('@/pages/notFound/NotFound')
            },
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/pages/home/Home'),
                children: [
                    // 主页
                    {
                        path: '/home/dashboard',
                        name: 'Dashboard',
                        component: () => import('@/pages/dashboard/Dashboard')
                    },
                    // 用户角色管理
                    {
                        path: '/home/manage/user-manage',
                        name: 'UserManage',
                        component: () => import('@/pages/manage/UserManage')
                    },
                    {
                        path: '/home/manage/role-manage',
                        name: 'RoleManage',
                        component: () => import('@/pages/manage/RoleManage')
                    },
                    // 系统管理
                    {
                        path: '/home/sys-manage/environment-manage',
                        name: 'EnvironmentManage',
                        component: () => import('@/pages/manage/EnvironmentManage')
                    },
                    {
                        path: '/home/sys-manage/real-account-manage',
                        name: 'RealAccountManage',
                        component: () => import('@/pages/systemManage/RealAccount')
                    },
                    {
                        path: '/home/sys-manage/sub-account-manage',
                        name: 'SubAccountManage',
                        component: () => import('@/pages/systemManage/SubAccount')
                    },
                    {
                        path: '/home/sys-manage/user-strategy-manage',
                        name: 'UserStrategyManage',
                        component: () => import('@/pages/systemManage/UserStrategyManage')
                    },
                    {
                        path: '/test',
                        name: 'TradeCalendarManage',
                        redirect: 'NotFound',
                    },
                ]
            },
            // 刷新页面 必须保留
            // {
            //     path: '/refresh',
            //     name: 'Refresh',
            //     hidden: true,
            //     component: {
            //         beforeRouteEnter(to, from, next) {
            //             next(instance => instance.$router.replace(from.fullPath));
            //         },
            //         render: h => h()
            //     }
            // },

        ],
        mode: 'history',
    }
)
export default router