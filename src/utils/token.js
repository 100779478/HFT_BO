
const tokenKey = "token"

/**
 * 将Token存入LocalStorage
 * @param {string} token - 登录之后获取的 Token
 */
export function putToken(token) {
    localStorage.setItem(tokenKey, token)
}

/**
 * 获取Token
 * @returns {string} token - 登录之后获取的 Token
 */
export function getToken(){
    return localStorage.getItem(tokenKey)
}

/**
 * 移除Token
 */
export function removeToken() {
    console.log(2222222)
    localStorage.removeItem(tokenKey)
}