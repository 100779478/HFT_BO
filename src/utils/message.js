import {Message} from 'view-design';

/**
 * 信息提示
 * @param content 提示内容
 * @param duration 展示延迟时间
 */
export default function showNotification(content, duration = 1.5) {
    if (content) {
        Message.success({content, duration});
    }
}
