import request, { METHOD } from '../utils/request'

//登录接口
export function AccountLogin(data) {
    return request({
        url: '/hft-bos/user/login',
        method: METHOD.post,
        data
    });
}
//修改密码
export function modificationPassword(data) {
    return request({
        url: '/hft-bos/user/modification',
        method: METHOD.post,
        data
    });
}