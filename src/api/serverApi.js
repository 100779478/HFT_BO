//吴彦祖IP
// export const requestContextPath = "http://192.168.50.199:80" + "/hft-bos"
// 玺子哥IP
// export const requestContextPath = "http://192.168.50.71:80" + "/hft-bos"
const env = process.env.NODE_ENV;
// const devUrl = "http://106.13.177.225:8090";
const devUrl = "http://192.168.50.29:9000";
//服务器
export const requestContextPath =
  (env === "development" ? devUrl : location.origin) + "/hft-bos";
console.log("current env :", env, requestContextPath);
export const URL = {
  // 数据字典
  dictionaryList: "/config/static-enums",
  // 页面配置
  template: "/template",
  // 用户登录
  login: "/user/login",
  // 修改密码
  modification: "/user/modification",
  // 获取验证码图片
  verifyCode: "/user/captcha",
  // 退出登录
  logout: "/user/logout",
  // 用户菜单列表
  menus: "/user/menus",
  // 获取当前用户信息
  current: "/user/current",
  // 获取分页用户列表
  user: "/user",
  // GET获取用户列表,
  userList: "/user/list",
  // 获取所有角色列表
  role: "/role",
  // 查询环境列表
  environment: "/env/list",
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
  // // 角色列表
  // role: '/role',
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
  // 获取交易通道
  tradeChannel: "/channel/current",
  // 添加、修改、删除客户通道
  customChannel: "/cus-channel",
  // 分页获取用户策略
  ruleList: "/rule/list",
  // 添加、修改、删除用户策略
  rule: "/rule",
  // 获取策略类型列表
  ruleType: "/rule/type",
  // 获取连接状态
  channelStatus: "/channel-status",
  // 获取订单列表
  orders: "/order",
  // 导出订单
  ordersExport: "/order/export",
  // 获取订单列表
  deals: "/deal",
  // 导出订单
  dealsExport: "/deal/export",
  // 获取订单列表
  position: "/position",
  // 导出订单
  positionExport: "/position/export",
};
