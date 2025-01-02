import vue from "vue";
import VueRouter from "vue-router";
import {http} from "@/utils/request";
import {URL} from "@/api/serverApi";

vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/login",
    },
    {
        path: "/login",
        name: "Login",
        component: () => import(/* webpackChunkName: "login" */ "@/pages/login/Login"),
        meta: {
            title: "登录",
        },
    },
    {
        path: "/login-protect",
        name: "LoginProtect",
        component: () => import("@/pages/loginProtect/LoginProtect.vue"),
        meta: {
            title: "登录保护",
        },
    },
    {
        path: "*",
        name: "NotFound",
        component: () => import(/* webpackChunkName: "notFound" */ "@/pages/notFound/NotFound"),
    },
    {
        path: "/home",
        name: "Home",
        component: () => import(/* webpackChunkName: "home" */ "@/pages/home/Home"),
        children: [
            // 主页
            {
                path: "/home/dashboard",
                name: "Dashboard",
                component: () => import(/* webpackChunkName: "dashboard" */ "@/pages/dashboard/Dashboard"),
                meta: {
                    title: "主页",
                },
            },
            // 用户角色管理
            {
                path: "/home/manage/user-manage",
                name: "UserManage",
                component: () => import(/* webpackChunkName: "user-manage" */ "@/pages/manage/UserManage"),
                meta: {
                    title: "用户角色管理/用户管理",
                },
            },
            {
                path: "/home/manage/role-manage",
                name: "RoleManage",
                component: () => import(/* webpackChunkName: "role-manage" */ "@/pages/manage/RoleManage"),
                meta: {
                    title: "用户角色管理/角色管理",
                },
            },
            // 系统管理
            {
                path: "/home/sys-manage/environment-manage",
                name: "EnvironmentManage",
                component: () => import(/* webpackChunkName: "environment-manage" */ "@/pages/manage/EnvironmentManage"),
                meta: {
                    title: "系统管理/环境管理",
                },
            },
            {
                path: "/home/sys-manage/real-account-manage",
                name: "RealAccountManage",
                component: () => import(/* webpackChunkName: "real-account-manage" */ "@/pages/systemManage/RealAccount"),
                meta: {
                    title: "系统管理/实体账户",
                },
            },
            {
                path: "/home/sys-manage/sub-account-manage",
                name: "SubAccountManage",
                component: () => import(/* webpackChunkName: "sub-account-manage" */ "@/pages/systemManage/SubAccount"),
                meta: {
                    title: "系统管理/分账户管理",
                },
            },
            {
                path: "/home/sys-manage/rule-manage",
                name: "RuleManage",
                component: () => import(/* webpackChunkName: "rule-manage" */ "@/pages/systemManage/RuleManage.vue"),
                meta: {
                    title: "用户策略管理",
                },
            },
            {
                path: "/home/auth-manage/auth-manage",
                name: "TradeDataPermission",
                component: () => import(/* webpackChunkName: "auth-manage" */ "@/pages/systemManage/TradeDataPermission.vue"),
                meta: {
                    title: "系统管理/权限管理",
                },
            },
            // 系统监控
            {
                path: "/home/sys-monitor/channel-status",
                name: "ChannelStatusManage",
                component: () => import(/* webpackChunkName: "channel-status" */ "@/pages/systemMonitor/ChannelStatusManage"),
                meta: {
                    title: "连接状态",
                },
            },
            // 主页
            {
                path: "/home/sys-monitor/trade-calendar",
                name: "TradeCalendar",
                component: () => import(/* webpackChunkName: "trade-calendar" */ "@/pages/systemManage/TradeCalendar.vue"),
                meta: {
                    title: "系统管理/交易日历",
                },
            },
            // 操作日志
            {
                path: "/home/sys-monitor/operating-log",
                name: "OperatingLog",
                component: () => import(/* webpackChunkName: "operating-log" */ "@/pages/systemMonitor/OperatingLog"),
                meta: {
                    title: "操作日志",
                },
            },
            // 报表查询
            {
                path: "/home/report-query/bilateral-order",
                name: "BilateralOrder",
                component: () => import(/* webpackChunkName: "orders" */ "@/pages/reportQuery/BilaterOrder"),
                meta: {
                    title: "双边订单",
                },
            },
            {
                path: "/home/report-query/orders",
                name: "Order",
                component: () => import(/* webpackChunkName: "orders" */ "@/pages/reportQuery/Order"),
                meta: {
                    title: "报单列表",
                },
            },
            {
                path: "/home/report-query/deals",
                name: "Trade",
                component: () => import(/* webpackChunkName: "deals" */ "@/pages/reportQuery/Deal"),
                meta: {
                    title: "成交列表",
                },
            },
            {
                path: "/home/report-query/position",
                name: "Position",
                component: () => import(/* webpackChunkName: "position" */ "@/pages/reportQuery/Position"),
                meta: {
                    title: "持仓列表",
                },
            },
        ],
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
]
const router = new VueRouter({
    routes,
    mode: "hash",
});
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title ? `HFT-${to.meta.title}` : "找不到页面";
    }
    next();

});
export default router;
