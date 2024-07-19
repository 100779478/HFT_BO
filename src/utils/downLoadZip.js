import {http} from "@/utils/request";
import {time} from "@/common/common";

/**
 * 下载ZIP文件
 * @param {string} url - 请求的接口地址
 * @param {object} params - 请求的参数
 * @param {string} name - 下载的文件名的前缀
 * @return {Promise}
 */
export function downLoadZip(url, params, name) {
    return new Promise((resolve, reject) => {
        http.post(url, params, (res) => {
            const blob = new Blob([res], {type: 'application/zip'});
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);

            // 获取当前日期和时间
            const dateObj = time.dateToLocaleObject(new Date());
            const dateStr = `${dateObj.year}-${dateObj.month}-${dateObj.date}`;

            // 设置文件名
            link.download = `${name}_${dateStr}.zip`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve()
        })
    })
}