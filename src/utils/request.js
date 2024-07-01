import axios from "axios";
import {getToken} from "./token";
import {Message} from "view-design";
import {requestContextPath, URL} from "@/api/serverApi";
import router from "@/router/index";
import store from "@/store";


let is403MessageShown = false;
const axiosInstance = axios.create({
    // timeout: 1000,
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
     * @returns 请求响应
     */
    get: (
        url,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance.get(url).then(thenHandler).catch(errorHandler);
    },

    getBlob: (
        url,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance
            .get(url, {responseType: "blob"})
            .then(thenHandler)
            .catch(errorHandler);
    },
    /**
     * HTTP POST 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    post: (
        url,
        data,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance.post(url, data).then(thenHandler).catch(errorHandler);
    },
    uploadFile: (
        url,
        file,
        data = {},
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
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
            })
            .then(thenHandler)
            .catch(errorHandler);
    },
    postBlob: (
        url,
        data,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance
            .post(url, data, {
                responseType: "blob",  // 设置成功响应的数据类型为 blob
            })
            .then(thenHandler)
            .catch(error => {
                // 在这里处理错误，包括获取blob类型的数据
                if (error.response && error.response.data instanceof Blob) {
                    console.log("Blob 数据:", error.response.data);
                    // 尝试将 Blob 数据转换为 JSON
                    const reader = new FileReader();
                    reader.onload = () => {
                        try {
                            const jsonData = JSON.parse(reader.result);
                            console.log("成功转换为 JSON 数据:", jsonData);
                            // 从 JSON 数据中取得 errorMessage，并在这里处理
                            const errorMessage = jsonData.errorMessage;
                            Message.error(jsonData.errorMessage)
                            console.log("错误消息:", errorMessage);
                            // 在这里处理 errorMessage，例如调用自定义错误处理函数
                            // errorHandler(errorMessage);
                        } catch (jsonError) {
                            console.error("转换为 JSON 出错:", jsonError);
                            // 转换失败，调用自定义的错误处理函数
                            errorHandler(error);
                        }
                    };

                    reader.readAsText(error.response.data);
                } else {
                    // 处理其他错误，调用自定义的错误处理函数
                    return errorHandler(error);
                }
            });
    },

    /**
     * HTTP PUT 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    put: (
        url,
        data,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance.put(url, data).then(thenHandler).catch(errorHandler);
    },

    /**
     * HTTP DELETE 请求
     * @param {string} url - 请求地址
     * @param {object} data - 请求body参数
     * @param {Function=} thenHandler - 响应成功方法，可选项非必传，提供默认处理方式
     * @param {Function=} errorHandler - 错误处理方法，可选项非必传，提供默认处理方式
     * @returns 请求响应
     */
    delete: (
        url,
        data,
        thenHandler = () => {
        },
        errorHandler = defaultErrorHandler
    ) => {
        return axiosInstance
            .delete(url, data)
            .then(thenHandler)
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
        if (
            null == errorMessage ||
            "" === errorMessage
        ) {
            console.log("Error ====> ", errorResponse);
            Message.error(errorResponse?.data?.errorMessage);
            return;
        }
        Message.error(errorMessage);
    } catch (e) {
        Message.error('未知错误');
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
    if (!localStorage.dictionaryList &&
        (router.currentRoute.name !== 'Login' && router.currentRoute.name !== 'Dashboard' && router.currentRoute.name !== 'Home')
    ) {
        http.get(URL.dictionaryList, (res) => {
            store.commit("dictionary/dictionaryList", res.data);
        });
    }
    const token = getToken();
    if (!token) {
        if (!is403MessageShown) {
            Message.error("登录过期，请重新登录！");
            router.push("/login");
            is403MessageShown = true
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
            // switch (code) {
            //     case "100002":
            //         // router.push({name: "Login"});
            //     // case "110020":
            //     // case "100001":
            //     // case "110002":
            //     // case "100000":
            //     //   Message.error(response.data.errorMessage);
            //     default:
            if (response.data.errorMessage) {
                Message.error(response.data.errorMessage);
            }
            // }
            return response.data;
        }
        if (response.status === 403) {
            if (response.data.errorMessage) {
                Message.error(response.data.errorMessage);
            }
            // router.push({name: "Login"});
        }
        throw response.data;
        // throw new Error(response)
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
                    console.log('403 -- forbid')
                    Message.error('连接失败')
                    router.push({name: "Login"});
                    return Promise.reject(error);
                }
                break
            case 401:
                return Promise.reject(error);
            case 503:
            case 500:
            case 502:
                Message.error("服务器连接失败！");
                return Promise.reject(error);
            default:
                return Promise.reject(error);
        }
    }
);
