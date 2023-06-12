//吴彦祖IP
// export const requestContextPath = "http://192.168.50.199:80" + "/hft-bos"
// 玺子哥IP
// export const requestContextPath = "http://192.168.50.71:80" + "/hft-bos"
//服务器
export const requestContextPath = "http://106.13.177.225:8090" + "/hft-bos"

export const URL = {
    // 用户登录
    login: '/user/login',
    // 修改密码
    modification: '/user/modification',
    // 退出登录
    logout: '/user/logout',
    // 用户菜单列表
    menus: '/user/menus',
    // 获取当前用户信息
    current: '/user/current',
    // 获取用户列表
    user: '/user',
    // 获取所有角色列表
    role: '/role',
    // 查询环境列表
    environment: '/env/list',
    // 切换环境
    setEnvironment: '/env/set',
    // 删除环境
    deleteEnvironment: '/env',
    // 新增环境
    addEnvironment: '/env',
    // 获取当前环境
    environmentCurrent: '/env/current',
    // 修改环境
    modificationEnvironment: '/env',
    // 角色列表
    role: '/role',
    // 获取所有权限列表
    permission: '/permission',
    // 修改通道、添加通道
    channel: '/channel',
    // 查询通道列表
    channelList: '/channel/list',
    // 获取外部接口类型
    apiType: '/channel/apiType',
    // 获取指定外部接口类型下的通道类型
    inApiType: '/channel/inApiType',
    // 获取通道类型
    channelType: '/channel/channelType',
    // 分页获取客户通道数据
    channelTrade: '/cus-channel/list',
    // 获取交易通道
    tradeChannel: '/cus-channel/tradeChannel',
    // 添加、修改、删除客户通道
    customChannel: '/cus-channel',
}