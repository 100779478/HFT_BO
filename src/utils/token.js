
const tokenKey = "token"
const userInfo = "userInfo"
/**
 * 将Token存入LocalStorage
 * @param {string} token - 登录之后获取的 Token
 */
export function putToken(token) {
    localStorage.setItem(tokenKey, token)
}
//存入user信息
export function setUserInfo(token) {
    localStorage.setItem(userInfo, token)
}
/**
 * 获取Token
 * @returns {string} token - 登录之后获取的 Token
 */
export function getToken() {
    return localStorage.getItem(tokenKey)
}
export function getUserInfo() {
    return localStorage.getItem(userInfo)
}
/**
 * 移除Token
 */
export function removeToken() {
    localStorage.removeItem(tokenKey)
}
