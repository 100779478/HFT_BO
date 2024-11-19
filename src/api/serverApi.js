const env = process.env.NODE_ENV;
// const devUrl = "http://58.250.164.226:31004"; // POC
// const devUrl = "https://58.250.164.226:39888"; // 1.5.6
const devUrl = "http://172.24.16.13:9888"; // 1.5.6
// const devUrl = "https://10.210.6.241:8888"; // 1.5.6
// const devUrl = "http://192.168.77.16:9000"; // 玺子哥
const proUrl = location.origin;
//服务器
export const requestContextPath =
    (env === "development" ? devUrl : proUrl) + "/hft-bos";
console.log("current env :", env, requestContextPath);
export const URL = {
    // 获取加密类型
    encryption: '/config/password-type',
    // 数据字典
    dictionaryList: "/config/static-enums",
    // 页面配置
    template: "/template",
    // 用户登录
    login: "/customer/login",
    // 等保
    loginProtect: "/customer/password-expired-time",
    // 修改密码
    modification: "/customer/modification",
    // 密码强度校验
    pwdStrength: "/customer/password-strength",
    // 获取验证码图片
    verifyCode: "/customer/captcha",
    // 退出登录
    logout: "/customer/logout",
    // 用户菜单列表
    menus: "/customer/menus",
    // 获取当前用户信息
    current: "/customer/current",
    // 获取分页用户列表
    user: "/customer/list",
    // 编辑用户，
    userEdit: "/customer",
    // 修改密码
    userReset: "/customer/reset",
    // 导出用户管理
    userExport: "/customer/export",
    // GET获取用户列表,
    userList: "/customer/all",
    // 获取所有角色列表
    role: "/role",
    // 获取分页角色列表
    roleList: "/role/list",
    // 导出角色管理
    roleExport: "/role/export",
    // 查询环境列表
    environment: "/env/list",
    // 获取所有环境列表
    environmentAll: "/env/all",
    // 导出环境列表
    environmentExport: "/env/export",
    // 切换环境
    setEnvironment: "/env/set",
    // 删除环境
    deleteEnvironment: "/env",
    // 获取当前环境
    environmentCurrent: "/env/current",
    // 修改环境
    editEnvironment: "/env",
    // 获取所有权限列表
    permission: "/permission",
    // 修改通道、添加通道
    channel: "/channel",
    // 查询通道列表
    channelList: "/channel/list",
    // 获取外部接口类型
    apiType: "/channel/apiType",
    // 获取通道类型
    channelType: "/channel/channelType",
    // 分页获取客户通道数据
    channelTrade: "/cus-channel/list",
    // 导出实体账户
    channelTradeExport: "/channel/export",
    // 获取交易通道
    tradeChannel: "/channel/current",
    // 添加、修改、删除客户通道
    customChannel: "/cus-channel",
    // 导出分账户
    customChannelExport: "/cus-channel/export",
    // 获取做市策略列表
    ruleListMarket: "/rule/list/make-market",
    // 导出做市策略列表
    ruleExportMarket: "/rule/export/make-market",
    // 新增、更新做市策略
    ruleMarket: "/rule/make-market",
    // 分页获取量化策略列表
    ruleList: "/rule/list/quant",
    // 添加、修改、删除用户策略
    rule: "/rule",
    // 添加、修改、删除量化策略
    ruleQuant: "/rule/quant",
    // 导出量化策略列表
    ruleExportQuant: "/rule/export/quant",
    // 上传量化策略模板
    ruleUploadQuant: "/rule/upload/quant",
    // 获取量化策略实例列表
    ruleQuantInstanceList: "/rule/list/quant/instance",
    // 获取策略ID及存储位置 GET
    ruleUpload: "/rule/upload",
    // 上传策略文件
    ruleConfig: "/rule/config",
    // 上传策略参数
    ruleIdPath: "/rule/rule-id-path",
    // 获取连接状态
    channelStatus: "/channel-status/list",
    // 导出连接状态
    channelStatusExport: "/channel-status/export",
    // 获取订单列表
    orders: "/order/list",
    // 导出订单
    ordersExport: "/order/export",
    // 获取成交列表
    deals: "/deal/list",
    // 导出成交
    dealsExport: "/deal/export",
    // 获取持仓列表
    position: "/position/list",
    // 导出持仓
    positionExport: "/position/export",
    // 交易数据权限管理
    tradeDataList: "/trade-data-permission/list",
    // 新增、修改、删除交易数据权限
    tradeData: "/trade-data-permission",
    // 导出交易数据权限
    tradeDataExport: "/trade-data-permission/export",
    // 操作日志导出
    logExport: "/log/export",
    // 操作日志列表
    logList: "/log/list",
    // 获取节假日列表
    holidayList: "/calendar/holiday/list",
    // 新增删除修改节假日
    holiday: "/calendar/holiday",
    // 获取周末工作日列表
    weeklyList: "/calendar/trading-day/list",
    // 新增删除修改周末工作日
    weekly: "/calendar/trading-day",
    // 交易日历列表
    calendarList: "/calendar/list",
    // 交易日历计算
    calendarCalculate: "/calendar/recalculate",
    // 导出交易日历
    calendarExport: "/calendar/export",
    // 导出周末工作日
    weeklyExport: "/calendar/trading-day/export",
    // 导出节假日
    holidayExport: "/calendar/holiday/export",
    // 获取所有场景列表
    scenes: "/scenes",
    // 获取所有客户端权限列表
    clientPermission: "/client-permission",
    // 获取策略审批单列表
    vetting: '/rule-vetting/list',
    // 获取我的策略审批单列表
    myVetting: '/rule-vetting/list/my',
    // 撤销策略审批单
    cancelVetting: '/rule-vetting/cancel',
    // 同意策略审批单
    agreeVetting: '/rule-vetting/agree',
    // 拒绝策略审批单
    refuseVetting: '/rule-vetting/refuse',
    // 上传策略文件
    uploadVetting: '/rule-vetting/upload',
    // 更新策略审批单信息
    updateVetting: '/rule-vetting',
    // 获取生产所有环境列表，发送端
    envAllProduct: '/env/all/product-producer',
    // 一键上传策略至生产环境，发送端
    ruleUploadProduct: '/rule/upload-product',
    // 下载策略审批单中的策略文件，一般是ZIP包
    vettingDownload: '/rule-vetting/download',
    // 导出策略审批单列表
    vettingExport: '/rule-vetting/export',
    // 导出我的策略审批单列表
    myVettingExport: '/rule-vetting/export/my',
    // 导出策略实例
    ruleExportInstance: '/rule/export/quant/instance',
    // 获取策略服务节点列表
    ruleMonitorNodes: '/rule/monitor/nodes',
};
export const sseUrl = {
    // 长链接SSE
    SSE: '/sse',
}