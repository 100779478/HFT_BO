const tokenKey = "token"
const userInfo = "customerid"

/**
 * 将Token存入LocalStorage
 * @param {string} token - 登录之后获取的 Token
 */
export function putToken(token) {
    sessionStorage.setItem(tokenKey, token)
}

//存入user信息
export function setUserInfo(token) {
    sessionStorage.setItem(userInfo, token)
}

/**
 * 获取Token
 * @returns {string} token - 登录之后获取的 Token
 */
export function getToken() {
    return sessionStorage.getItem(tokenKey)
}

export function getUserInfo() {
    return sessionStorage.getItem(userInfo)
}

/**
 * 移除Token
 */
export function removeToken() {
    sessionStorage.removeItem(tokenKey)
}