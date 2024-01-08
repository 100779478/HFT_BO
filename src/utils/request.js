import axios from "axios";
import { getToken } from "./token";
import { Message } from "view-design";
import { requestContextPath, URL } from "../api/serverApi";
import router from "@/router/index";

const axiosInstance = axios.create({
  // timeout: 1000,
  baseURL: requestContextPath,
});

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
    thenHandler = (response) => {},
    errorHandler = defaultErrorHandler
  ) => {
    return axiosInstance.get(url).then(thenHandler).catch(errorHandler);
  },

  getBlob: (
    url,
    thenHandler = (response) => {},
    errorHandler = defaultErrorHandler
  ) => {
    return axiosInstance
      .get(url, { responseType: "blob" })
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
    thenHandler = (response) => {},
    errorHandler = defaultErrorHandler
  ) => {
    return axiosInstance.post(url, data).then(thenHandler).catch(errorHandler);
  },
  postBlob: (
    url,
    data,
    thenHandler = (response) => {},
    errorHandler = defaultErrorHandler
  ) => {
    return axiosInstance
      .post(url, data, { responseType: "blob" })
      .then(thenHandler)
      .catch(errorHandler);
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
    thenHandler = (response) => {},
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
    thenHandler = (response) => {},
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
  let errorResponse = error.response;
  if (undefined == errorResponse) {
    console.log("Error ====> ", error);
    if (error.errorMessage) {
      Message.error(error.errorMessage);
    }
    return;
  }
  let errorMessage = errorResponse.errorMessage;
  if (
    null == errorMessage ||
    undefined == errorMessage ||
    "" === errorMessage
  ) {
    console.log("Error ====> ", errorResponse);
    Message.error(errorResponse.data.errorMessage);
    return;
  }
  Message.error(errorMessage);
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
  const token = getToken();
  if (null == token || undefined == token || "" === token) {
    Message.error("登录过期，请重新登录！");
    router.push("/login");
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
      if (code === "100002") {
        router.push({ name: "Login" });
      }
      switch (code) {
        case "100002":
          router.push({ name: "Login" });
        // case "110020":
        // case "100001":
        // case "110002":
        // case "100000":
        //   Message.error(response.data.errorMessage);
        default:
          if (response.data.errorMessage) {
            Message.error(response.data.errorMessage);
          }
      }
      return response.data;
    }
    if (response.status === 403) {
      if (response.data.errorMessage) {
        Message.error(response.data.errorMessage);
      }
      router.push({ name: "Login" });
    }
    // if (response.status === 200 && response.data.code === "0") {
    //   return response.data;
    // }
    throw response.data;
    // throw new Error(response)
  },
  (error) => {
    // let errorResponse = error.response;
    let errorResponse = error.request;
    let httpStatus;
    console.log("errorResponse", errorResponse);
    if (undefined == errorResponse || null == errorResponse) {
      httpStatus = 500;
    } else {
      httpStatus = errorResponse.status;
    }
    switch (httpStatus) {
      case 0:
      case 403:
        Message.error("登录信息已过期，请重新登录");
        router.push({ name: "Login" });
        break;
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
