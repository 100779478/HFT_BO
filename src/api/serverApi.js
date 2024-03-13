//吴彦祖IP
// export const requestContextPath = "http://192.168.50.199:80" + "/hft-bos"
// 玺子哥IP
// export const requestContextPath = "http://192.168.50.71:80" + "/hft-bos"
const env = process.env.NODE_ENV;
// const devUrl = "http://106.12.178.118:9000";
const devUrl = "http://192.168.50.17:9000";
const proUrl = location.origin;
//服务器
export const requestContextPath =
    (env === "development" ? devUrl : proUrl) + "/hft-bos";
console.log("current env :", env, requestContextPath, proUrl);
export const URL = {
    // 数据字典
    dictionaryList: "/config/static-enums",
    // 页面配置
    template: "/template",
    // 用户登录
    login: "/customer/login",
    // 修改密码
    // modification: "/user/modification",
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
    // 修改用户，
    userEdit: "/customer",
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
    // 新增环境
    addEnvironment: "/env",
    // 获取当前环境
    environmentCurrent: "/env/current",
    // 修改环境
    modificationEnvironment: "/env",
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
    // 分页获取用户策略
    ruleList: "/rule/list",
    // 添加、修改、删除用户策略
    rule: "/rule",
    // 导出用户策略列表
    ruleExport: "/rule",
    // 获取策略类型列表
    ruleType: "/rule/type",
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
};
