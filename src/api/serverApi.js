import request, { METHOD } from '../utils/request'
export function AccountLogin(data) {
    return request({
        url: '/hft-bos/user/login',
        method: METHOD.post,
        data
    });
}