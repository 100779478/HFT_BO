import axios from "axios";
import {getToken, putToken} from "./token";
import {Message} from "view-design";
import {requestContextPath, URL} from "@/api/serverApi";
import router from "@/router/index";
import store from "@/store";
import {ClientRoutePage} from "@/common/constant";

let is403MessageShown = false;
const axiosInstance = axios.create({
    // timeout: 10000,
    baseURL: requestContextPath,
});
axiosInstance.defaults.headers['Access-Control-Allow-Origin'] = '*'
axiosInstance.defaults.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'
export const http = {
    /**
     * HTTP GET 请求
     * @param {string} url - 请求地址
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @param responseType 请求类型
     * @returns 请求响应
     */
    get: (
        url,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler,
        responseType
    ) => {
        return axiosInstance.get(url, {responseType}).then(thenHandler
        ).catch(errorHandler);
    },
    /**
     * HTTP POST 请求
     * @param {string} url - 请求地址
     * @param messageType - 提示消息
     * @param responseType - 请求类型
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    post: (
        url,
        {messageType, responseType, ...data} = {},
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler,
    ) => {
        // 创建一个 data 的副本
        return axiosInstance.post(url, data, {responseType}).then((res) => {
            thenHandler(res)
            const msg = !res.okMessage ? messageType : res.okMessage
            if (res?.code === '0' && messageType) Message.success(msg)
        }).catch(errorHandler);
    },
    uploadFile: (url, file, data = {}, cancelToken, progressCallBack = () => {
    }, thenHandler = () => {
    }, errorHandler = defaultErrorHandler,) => {
        const formData = new FormData();
        formData.append("file", file);  // 通过 "file" 字段传递文件
        // 将其他参数加入 FormData
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                formData.append(key, data[key]);
            }
        }
        return axiosInstance
            .post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",  // 设置请求头为multipart/form-data
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100 / progressEvent.total))
                    progressCallBack(percentCompleted)
                },
                cancelToken: cancelToken // 将取消令牌传递给请求
            })
            .then((res) => {
                if (!res.code) {
                    thenHandler(res)
                }
            })
            .catch((err) => {
                if (axios.isCancel(err)) {
                    console.log('Request canceled:', err.message); // 如果请求被取消，记录取消信息
                    // 可以在这里执行取消请求后的操作，比如显示一个提示
                    Message.error(err.message)
                } else {
                    errorHandler(err); // 处理其他类型的错误
                }
                progressCallBack(0)
            });
    },
    /**
     * HTTP PUT 请求
     * @param {string} url - 请求地址
     * @param messageType - 提示消息
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    put: (
        url,
        {messageType, ...data} = {},
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler,
    ) => {
        return axiosInstance.put(url, data).then((res) => {
            thenHandler(res)
            const msg = !res.okMessage ? messageType : res.okMessage
            if (res?.code === '0' && messageType) Message.success(msg)
        }).catch(errorHandler);
    },

    /**
     * HTTP DELETE 请求
     * @param {string} url - 请求地址
     * @param messageType - 提示消息
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    delete: (
        url,
        {messageType, ...data} = {},
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance
            .delete(url, data)
            .then((res) => {
                thenHandler(res)
                const msg = !res.okMessage ? messageType : res.okMessage
                if (res?.code === '0' && messageType) Message.success(msg)
            })
            .catch(errorHandler);
    },
};

/**
 * 默认HTTP请求错误处理器
 * @param {object} error - 错误返回结果
 */
export function defaultErrorHandler(error) {
    try {
        let errorResponse = error?.response;
        if (undefined === errorResponse) {
            console.log("Error ====> ", error);
            if (error?.errorMessage) {
                Message.error(error?.errorMessage);
            }
            return;
        }
        let errorMessage = errorResponse?.errorMessage;
        if (null == errorMessage || "" === errorMessage) {
            console.log("ErrorResponse ====> ", errorResponse);
            Message.error(errorResponse?.data?.errorMessage);
            return;
        }
        Message.error(errorMessage);
    } catch (e) {
        // 如果服务器返回的错误是JSON格式
        if (error.response && error.response.data) {
            if (error.response.data instanceof Blob || error.response.data instanceof File) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const errorData = JSON.parse(reader.result);
                        Message.error(errorData.errorMessage)
                        // 处理错误信息
                    } catch (e) {
                    }
                };
                reader.readAsText(error.response.data)
            }
        }
    }
}

/**
 * axios 请求拦截器
 */
axiosInstance.interceptors.request.use((config) => {
    let isLogin = config.url === URL.login;
    if (
        isLogin ||
        config.url === URL.verifyCode ||
        config.url === URL.dictionaryList
    ) {
        return config;
    }
    // 自动刷新获取数据字典
    // const excludedRoutes = ['Login', 'Dashboard', 'Home', 'MonitorStatus', 'MonitorHistory', 'TransactionSummary', 'SubRuleTransactionSummary'];
    const excludedRoutes = ['Login', 'Dashboard', 'Home'].concat(Object.values(ClientRoutePage));
    if (!localStorage.dictionaryList && (!excludedRoutes.includes(router.currentRoute.name))) {
        http.get(URL.dictionaryList, res => store.commit("dictionary/dictionaryList", res.data))
    }
    const token = getToken();
    if (!token) {
        // 客户端页面特殊处理登录请求
        // if ('MonitorStatus' !== router.currentRoute.name && 'MonitorHistory' !== router.currentRoute.name && 'TransactionSummary' !== router.currentRoute.name
        //     && 'SubRuleTransactionSummary' !== router.currentRoute.name && router.currentRoute.name && !is403MessageShown) {
        if (!Object.values(ClientRoutePage).includes(router.currentRoute.name) && router.currentRoute.name && !is403MessageShown) {
            router.push({name: "Login"});
            is403MessageShown = true;
        }
        return config;
    }
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

/**
 * axios 响应拦截器
 */
axiosInstance.interceptors.response.use(
    (response) => {
        const code = response.data.code;
        if (response.status === 200) {
            is403MessageShown = false;
            if (response.data.errorMessage) {
                Message.error(response.data.errorMessage);
            }
            return response.data;
        }
        if (response.status === 403) {
            if (response.data.errorMessage) {
                Message.error(response.data.errorMessage);
            }
        }
        throw response.data;
    },
    (error) => {
        let errorResponse = error.request;
        let httpStatus;
        console.log('onRejected Error:', error)
        if (undefined === errorResponse || null == errorResponse) {
            httpStatus = 500;
        } else {
            httpStatus = errorResponse.status;
        }
        switch (httpStatus) {
            case 0:
                Message.error('网络错误')
                return Promise.reject(error);
            case 403:
                if (!is403MessageShown) {
                    is403MessageShown = true;
                    // if ('MonitorStatus' !== router.currentRoute.name && 'MonitorHistory' !== router.currentRoute.name && 'TransactionSummary' !== router.currentRoute.name && 'SubRuleTransactionSummary' !== router.currentRoute.name) {
                    if (!Object.values(ClientRoutePage).includes(router.currentRoute.name)) {
                        router.push({name: "Login"});
                    } else {
                        http.post(URL.clientLogin, {
                            username: sessionStorage.getItem('customerid'),
                            password: sessionStorage.getItem('pwd'),
                            messageType: '登录成功',
                        }, (res) => {
                            putToken(res.data.token); // 将 token 存储起来
                            // router.go(0)
                        });
                    }
                    return Promise.reject(error);
                }
                break
            case 401:
                return Promise.reject(error);
            case 413:
                Message.error("策略文件超出最大限制")
                return
            case 503:
            case 500:
            case 502:
                // Message.error("服务器连接失败！");
                return Promise.reject(error);
            default:
                return Promise.reject(error);
        }
    }
);
