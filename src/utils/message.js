// utils/notice.js
import {Message} from 'view-design';

/**
 * 信息提示工具
 * @param {string} content 提示内容
 * @param {object} [options] 配置项
 * @param {number} [options.duration=1.5] 展示时长，单位秒
 * @param {'success'|'error'|'info'|'warning'} [options.type='success'] 提示类型
 * @param {boolean} [options.background=true] 是否显示背景色
 */
export default function showMessage(content, options = {}) {
    if (!content) return;

    const {
        duration = 2,
        type = 'success',
        background = true,
    } = options;

    Message[type]({
        content,
        duration,
        background,
        ...options
    });
}
