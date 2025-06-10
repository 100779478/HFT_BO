import {http} from "@/utils/request";
import {time} from "@/common/common";
import {Message} from "view-design";

const isBlobJson = async (blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const text = reader.result;
                const json = JSON.parse(text);
                resolve(json); // 如果成功解析为 JSON，则返回 json 对象
            } catch (e) {
                resolve(null); // 不是 JSON
            }
        };
        reader.readAsText(blob); // 把 blob 当作文本读出来
    });
};

/**
 * 下载ZIP文件
 * @param {string} url - 请求的接口地址
 * @param {object} params - 请求的参数
 * @param {string} name - 下载的文件名的前缀
 * @return {Promise}
 */
export function downLoadZip(url, params, name) {
    return new Promise((resolve, reject) => {
        http.post(url, params, async (res) => {
            const json = await isBlobJson(res);
            if (json) {
                console.log(json);
                Message.error(json.errorMessage);
                return;
            }
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