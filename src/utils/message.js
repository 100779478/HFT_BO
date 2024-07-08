import {Message} from 'view-design';

export default function showNotification(content) {
    if (content) {
        Message.success(content);
    }
}
