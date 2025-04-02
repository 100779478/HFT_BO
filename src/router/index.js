import vue from "vue";
import VueRouter from "vue-router";
import {getToken, putToken} from "@/utils/token";
import {URL} from "@/api/serverApi";
import {http} from "@/utils/request";
import {ClientRoutePage} from "@/common/constant";

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
        component: () => import(/* webpackChunkName: "login-protect" */ "@/pages/loginProtect/LoginProtect.vue"),
        meta: {
            title: "登录保护",
        },
    },
    // 做市监控
    {
        path: "/monitor",
        name: "MonitorStatus",
        component: () => import(/* webpackChunkName: "make-market" */ "@/pages/systemMonitor/MakeMarket.vue"),
        meta: {
            title: "做市监控",
        },
    },
    // 做市监控历史
    {
        path: "/monitor-history",
        name: "MonitorHistory",
        component: () => import(/* webpackChunkName: "make-market-history" */ "@/pages/systemMonitor/MakeMarketList.vue"),
        meta: {
            title: "做市监控历史",
        },
    },
    // 成交汇总
    {
        path: "/deal",
        name: "TransactionSummary",
        component: () => import(/* webpackChunkName: "transaction-summary" */ "@/pages/reportQuery/DealAggregate/TransactionSummary.vue"),
        meta: {
            title: "成交汇总",
        },
    },
    // 分策略成交汇总
    {
        path: "/sub-deal",
        name: "SubRuleTransactionSummary",
        component: () => import(/* webpackChunkName: "sub-deal" */ "@/pages/reportQuery/DealAggregate/SubRuleTransactionSummary.vue"),
        meta: {
            title: "成交汇总",
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
            // ====================================================================================================
            // ===============================================主页===============================================
            // ====================================================================================================
            {
                path: "/home/dashboard",
                name: "Dashboard",
                component: () => import(/* webpackChunkName: "dashboard" */ "@/pages/dashboard/Dashboard"),
                meta: {
                    title: "主页",
                },
            },
            // ====================================================================================================
            // ===============================================用户角色管理===============================================
            // ====================================================================================================
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
            // ====================================================================================================
            // ===============================================系统管理===============================================
            // ====================================================================================================
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
                    title: "系统管理/策略管理",
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
            {
                path: "/home/sys-manage/rule-vetting",
                name: "RuleVetting",
                component: () => import(/* webpackChunkName: "rule-vetting" */ "@/pages/systemManage/RuleVetting.vue"),
                meta: {
                    title: "系统管理/策略审批管理",
                },
            },
            {
                path: "/home/sys-manage/my-rule-vetting",
                name: "MyRuleVetting",
                component: () => import(/* webpackChunkName: "my-rule-vetting" */ "@/pages/systemManage/MyRuleVetting.vue"),
                meta: {
                    title: "系统管理/我的审批",
                },
            },
            {
                path: "/home/sys-manage/trade-calendar",
                name: "TradeCalendar",
                component: () => import(/* webpackChunkName: "trade-calendar" */ "@/pages/systemManage/TradeCalendar.vue"),
                meta: {
                    title: "系统管理/交易日历",
                },
            },
            // ====================================================================================================
            // ===============================================系统监控===============================================
            // ====================================================================================================
            {
                path: "/home/sys-monitor/channel-status",
                name: "ChannelStatusManage",
                component: () => import(/* webpackChunkName: "channel-status" */ "@/pages/systemMonitor/ChannelStatusManage"),
                meta: {
                    title: "系统监控/连接状态",
                },
            },
            {
                path: "/home/sys-monitor/operating-log",
                name: "OperatingLog",
                component: () => import(/* webpackChunkName: "operating-log" */ "@/pages/systemMonitor/OperatingLog"),
                meta: {
                    title: "系统监控/操作日志",
                },
            },
            {
                path: "/home/sys-monitor/make-market",
                name: "MakeMarket",
                component: () => import(/* webpackChunkName: "dashboard" */ "@/pages/systemMonitor/MakeMarket.vue"),
                meta: {
                    title: "系统监控/做市义务监控统计",
                },
            },
            {
                path: "/home/sys-monitor/make-market-list",
                name: "MakeMarketList",
                component: () => import(/* webpackChunkName: "orders" */ "@/pages/systemMonitor/MakeMarketList.vue"),
                meta: {
                    title: "系统监控/做市义务监控历史",
                },
            },
            // 监控管理
            {
                path: "/home/sys-monitor/monitor-manage",
                name: "Monitor",
                component: () => import(/* webpackChunkName: "operating-log" */ "@/pages/systemMonitor/MonitorManage.vue"),
                meta: {
                    title: "监控管理",
                },
            },
            // ====================================================================================================
            // ===============================================报表查询===============================================
            // ====================================================================================================
            {
                path: "/home/report-query/bilateral-order",
                name: "BilateralOrder",
                component: () => import(/* webpackChunkName: "orders" */ "@/pages/reportQuery/BilaterOrder"),
                meta: {
                    title: "双边订单",
                },
            },
            // 报表查询
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
            {
                path: "/home/report-query/deal-aggregate",
                name: "DealAggregate",
                component: () => import(/* webpackChunkName: "deal-aggregate" */ "@/pages/reportQuery/DealAggregate"),
                meta: {
                    title: "成交汇总",
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
    let style;
    // 特定路由为客户端
    if (Object.values(ClientRoutePage).includes(to.name)) {
        sessionStorage.setItem('isClientPage', 'true')
        style = {
            '--background-color': '#0C1A36',
            '--content-background-color': '#233450',
            '--modal-backcolor': '#17315d',
            '--select-hover-backcolor': '#17315d',
            '--text-color': '#fff',
            '--graph-item-backcolor': '#0C1A36',
            '--debt-backcolor': '#0C1A36',
            '--debt-text-color': '#fff',
            '--graph-hover-color': '#4e5363',
            '--checked-color': '#0C1A36',
            '--table-hover': '#4e5363',
            '--date-hover-color': '#697a89',
            '--border': '#2C4067',
            '--table-th': '#1D2B48',
            '--table-th-border': 'linear-gradient(to bottom, black, #5a5a5a, black)',
        }
    } else {
        style = {
            '--background-color': '#fff',
            '--content-background-color': '#f4f7fa',
            '--modal-backcolor': '#FFFFFF',
            '--select-hover-backcolor': '#F3F3F3',
            '--text-color': '#515a6e',
            '--checked-color': '#007BFF',
            '--date-hover-color': '#E1F0FE',
            '--graph-item-backcolor': '#f4f7fa',
            '--debt-backcolor': '#f4f7fa',
            '--debt-text-color': '#133685',
            '--graph-hover-color': '#ceced0',
            '--table-hover': '#EBF7FF',
            '--border': '#dadadd',
            '--table-th': '#fff',
            '--table-th-border': '',
        }
        sessionStorage.removeItem('isClientPage')
    }
    // 动态修改 :root 中的 CSS 变量
    Object.keys(style).forEach(key => {
        document.documentElement.style.setProperty(key, style[key]);
    });
    // 检查用户是否已登录
    const isAuthenticated = getToken(); // 获取登录状态
    // 如果没有匹配到任何路由（包括通配符路由）
    if (to.matched[0].path === '*') {
        // 继续导航到通配符路径对应的页面
        next();
    } else if (to.path !== '/login' && !isAuthenticated && to.path !== '/login-protect' && !Object.values(ClientRoutePage).includes(to.name)) {
        // 用户未登录且访问的不是允许的页面时，重定向到登录页
        next({path: '/login'});
    } else {
        if (!isAuthenticated && Object.values(ClientRoutePage).includes(to.name)) {
            sessionStorage.setItem('customerid', to.query.customerid);
            sessionStorage.setItem('pwd', to.query.pwd);
            sessionStorage.setItem('envid', to.query.envid);
            http.post(URL.clientLogin, {
                username: to.query.customerid,
                password: to.query.pwd,
                // messageType: '登录成功',
            }, (res) => {
                putToken(res.data.token); // 将 token 存储起来
                next()
                // router.go(0)
            }, () => {
            });
        } else {
            // 否则，继续导航
            next();
        }
    }

});
export default router;
