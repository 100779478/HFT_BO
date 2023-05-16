import vue from 'vue';
import VueRouter from 'vue-router';

vue.use(VueRouter)
const router = new VueRouter(
    {
        routes: [
            {
                path: '/',
                redirect: '/login',
                name: 'Login',
            },
            {
                path: '/login',
                name: 'Login',
                component: () => import('@/pages/login/Login')
            },
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/pages/home/Home')
            },


        ],
        mode: 'history',
    }
)
export default router