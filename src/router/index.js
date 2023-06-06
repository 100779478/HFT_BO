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
                    {
                        path: '/home/dashboard',
                        name: 'Dashboard',
                        component: () => import('@/pages/dashboard/Dashboard')
                    },
                    {
                        path: '/home/manage/user-manage',
                        name: 'UserManage',
                        component: () => import('@/pages/userManage/UserManage')
                    },
                    {
                        path: '/home/manage/role-manage',
                        name: 'RoleManage',
                        component: () => import('@/pages/userManage/RoleManage')
                    },
                ]
            },
            // 刷新页面 必须保留
            {
                path: '/refresh',
                name: 'Refresh',
                hidden: true,
                component: {
                    beforeRouteEnter(to, from, next) {
                        next(instance => instance.$router.replace(from.fullPath));
                    },
                    render: h => h()
                }
            },

        ],
        mode: 'history',
    }
)
export default router