import {Message} from 'view-design';

export default function showNotification(content, duration = 1.5) {
    if (content) {
        Message.success({content, duration});
    }
}
