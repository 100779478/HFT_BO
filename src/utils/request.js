import axios from 'axios'
export const METHOD = {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete"
}
const instance = axios.create({
    baseURL: 'http://106.13.177.225:9090',
    timeout: 3000,
})
// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在请求发送之前做一些处理
        const token = localStorage.getItem('token');
        // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    error => {
        // 发送失败
        Promise.reject(error);
    }
);
// export const post = (url, data = {}) => {
//     return new Promise((resolve, reject) => {
//         instance.post(url, data, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//             .then((response) => {
//                 resolve(response.data)
//             }).catch((err) => {
//                 reject(err)
//             })
//     })
// }
// export const get = (url, params = {}) => {
//     return new Promise((resolve, reject) => {
//         instance.get(url, { params }
//         ).then((response) => {
//             resolve(response.data)
//         }).catch((err) => {
//             // reject(err)
//             console.error(err)
//         })
//     })
// }

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log(config, 222233)
    return config;
}, function (error) {
    // 对请求错误做些什么
    alert('请求失败')
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // return Promise.reject(error);
});

export default instance;