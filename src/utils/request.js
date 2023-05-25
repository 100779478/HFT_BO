import axios from 'axios'
import { getToken } from './token'
import { Message } from 'view-design'

const requestHost = "http://192.168.50.71"
const requestContextPath = requestHost + "/hft-bos"

const axiosInstance = axios.create({
    timeout: 10000
});

export const URL = {
    login: requestContextPath + '/user/login'
}

export const http = {
    /**
     * HTTP GET 请求
     * @param {string} url - 请求地址
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    get: (url,
        thenHandler = (response) => {
        },
        errorHandler = defaultErrorHandler) => {
        return axiosInstance.get(url)
            .then(thenHandler)
            .catch(errorHandler)
    },

    /**
     * HTTP POST 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    post: (url, data,
        thenHandler = (response) => {
        },
        errorHandler = defaultErrorHandler) => {
        return axiosInstance.post(url, data)
            .then(thenHandler)
            .catch(errorHandler)
    },

    /**
     * HTTP PUT 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    put: (url, data,
        thenHandler = (response) => {
        },
        errorHandler = defaultErrorHandler) => {
        return axiosInstance.post(url, data)
            .then(thenHandler)
            .catch(errorHandler)
    },

    /**
     * HTTP DELETE 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    delete: (url, data,
        thenHandler = (response) => {
        },
        errorHandler = defaultErrorHandler) => {
        return axiosInstance.post(url, data)
            .then(thenHandler)
            .catch(errorHandler)
    }
}

/**
 * 默认HTTP请求错误处理器
 * @param {object} error - 错误返回结果
 */
export function defaultErrorHandler(error) {
    let errorResponse = error.response;
    if (undefined == errorResponse) {
        console.log("Error ====> ", error)
        return;
    }
    let errorMessage = errorResponse.errorMessage;
    console.log("Error ====> ", errorMessage)
    if (null == errorMessage || undefined == errorMessage || "" === errorMessage) {
        console.log("Error ====> ", errorResponse)
        return;
    }
    Message.error(errorMessage);
}

/**
 * axios 请求拦截器
 */
axiosInstance.interceptors.request.use(
    config => {
        let isLogin = config.url === URL.login
        if (isLogin) {
            return config
        }
        const token = getToken()
        if (null == token || undefined == token || "" === token) {
            Message.error('登录过期，请重新登录！')
            this.$router.push("/login");
        }
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    }
)

/**
 * axios 响应拦截器
 */
axiosInstance.interceptors.response.use(
    response => {
        if (response.status === 200 && response.data.code === '0') {
            return response
        }
        throw new Error(response)
    },
    error => {
        let errorResponse = error.response;
        let httpStatus
        if (undefined == errorResponse || null == errorResponse) {
            httpStatus = 500
        } else {
            httpStatus = errorResponse.status
        }
        switch (httpStatus) {
            case 503:
            case 500:
            case 502:
                Message.error('服务器连接失败！')
                return Promise.reject(error);
            default:
                return Promise.reject(error);
        }
    }
)