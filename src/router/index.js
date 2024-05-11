import vue from "vue";
import VueRouter from "vue-router";

vue.use(VueRouter);
const router = new VueRouter({
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            name: "Login",
            component: () => import("@/pages/login/Login"),
            meta: {
                title: "登录",
            },
        },
        {
            path: "*",
            name: "NotFound",
            component: () => import("@/pages/notFound/NotFound"),
        },
        {
            path: "/home",
            name: "Home",
            component: () => import("@/pages/home/Home"),
            children: [
                // 主页
                {
                    path: "/home/dashboard",
                    name: "Dashboard",
                    component: () => import("@/pages/dashboard/Dashboard"),
                    meta: {
                        title: "主页",
                    },
                },
                // 用户角色管理
                {
                    path: "/home/manage/user-manage",
                    name: "UserManage",
                    component: () => import("@/pages/manage/UserManage"),
                    meta: {
                        title: "用户角色管理/用户管理",
                    },
                },
                {
                    path: "/home/manage/role-manage",
                    name: "RoleManage",
                    component: () => import("@/pages/manage/RoleManage"),
                    meta: {
                        title: "用户角色管理/角色管理",
                    },
                },
                // 系统管理
                {
                    path: "/home/sys-manage/environment-manage",
                    name: "EnvironmentManage",
                    component: () => import("@/pages/manage/EnvironmentManage"),
                    meta: {
                        title: "系统管理/环境管理",
                    },
                },
                {
                    path: "/home/sys-manage/real-account-manage",
                    name: "RealAccountManage",
                    component: () => import("@/pages/systemManage/RealAccount"),
                    meta: {
                        title: "系统管理/实体账户",
                    },
                },
                {
                    path: "/home/sys-manage/sub-account-manage",
                    name: "SubAccountManage",
                    component: () => import("@/pages/systemManage/SubAccount"),
                    meta: {
                        title: "系统管理/分账户管理",
                    },
                },
                {
                    path: "/home/sys-manage/rule-manage",
                    name: "RuleManage",
                    component: () => import("@/pages/systemManage/RuleManage.vue"),
                    meta: {
                        title: "用户策略管理",
                    },
                },
                {
                    path: "/home/auth-manage/auth-manage",
                    name: "TradeDataPermission",
                    component: () => import("@/pages/systemManage/TradeDataPermission.vue"),
                    meta: {
                        title: "系统管理/权限管理",
                    },
                },
                // 系统监控
                {
                    path: "/home/sys-monitor/channel-status",
                    name: "ChannelStatusManage",
                    component: () => import("@/pages/systemMonitor/ChannelStatusManage"),
                    meta: {
                        title: "连接状态",
                    },
                },
                // 主页
                {
                    path: "/home/sys-monitor/trade-calendar",
                    name: "TradeCalendar",
                    component: () => import("@/pages/systemManage/TradeCalendar.vue"),
                    meta: {
                        title: "系统管理/交易日历",
                    },
                },
                // 操作日志
                {
                    path: "/home/sys-monitor/operating-log",
                    name: "OperatingLog",
                    component: () => import("@/pages/systemMonitor/OperatingLog"),
                    meta: {
                        title: "操作日志",
                    },
                },
                // 报表查询
                {
                    path: "/home/report-query/orders",
                    name: "Order",
                    component: () => import("@/pages/reportQuery/Order"),
                    meta: {
                        title: "报单列表",
                    },
                },
                {
                    path: "/home/report-query/deals",
                    name: "Trade",
                    component: () => import("@/pages/reportQuery/Deal"),
                    meta: {
                        title: "成交列表",
                    },
                },
                {
                    path: "/home/report-query/position",
                    name: "Position",
                    component: () => import("@/pages/reportQuery/Position"),
                    meta: {
                        title: "持仓列表",
                    },
                },
                {
                    path: "/test",
                    name: "TradeCalendarManage",
                    redirect: "NotFound",
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
    ],
    mode: "hash",
});
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title ? `HFT-${to.meta.title}` : "找不到页面";
    }
    next();
});
export default router;
