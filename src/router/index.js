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
                component: () => import('@/pages/login/Login'),
                meta: {
                    title: '登录'
                },
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
                        component: () => import('@/pages/dashboard/Dashboard'),
                        meta: {
                            title: '主页'
                        },
                    },
                    // 用户角色管理
                    {
                        path: '/home/manage/user-manage',
                        name: 'UserManage',
                        component: () => import('@/pages/manage/UserManage'),
                        meta: {
                            title: '用户角色管理/用户管理'
                        },
                    },
                    {
                        path: '/home/manage/role-manage',
                        name: 'RoleManage',
                        component: () => import('@/pages/manage/RoleManage'),
                        meta: {
                            title: '用户角色管理/角色管理'
                        },
                    },
                    // 系统管理
                    {
                        path: '/home/sys-manage/environment-manage',
                        name: 'EnvironmentManage',
                        component: () => import('@/pages/manage/EnvironmentManage'),
                        meta: {
                            title: '系统管理/环境管理'
                        },
                    },
                    {
                        path: '/home/sys-manage/real-account-manage',
                        name: 'RealAccountManage',
                        component: () => import('@/pages/systemManage/RealAccount'),
                        meta: {
                            title: '系统管理/实体账户'
                        },
                    },
                    {
                        path: '/home/sys-manage/sub-account-manage',
                        name: 'SubAccountManage',
                        component: () => import('@/pages/systemManage/SubAccount'),
                        meta: {
                            title: '系统管理/分帐户管理'
                        },
                    },
                    {
                        path: '/home/sys-manage/user-strategy-manage',
                        name: 'UserStrategyManage',
                        component: () => import('@/pages/systemManage/UserStrategyManage'),
                        meta: {
                            title: '用户策略管理'
                        },
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
        mode: 'hash',
    }
)
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title ? `HFT-${to.meta.title}` : '找不到页面';
    }
    next()
})
export default router
