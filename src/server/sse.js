import {requestContextPath, URL} from "@/api/serverApi";
import {Message} from "view-design";
import store from "@/store";

let eventSource = null;
let reconnectTimeout = null; // Variable to store timeout handler

function createEventSource() {
    if (eventSource) {
        eventSource.close();
        console.log("Existing connection to server closed.");
    }

    eventSource = new EventSource(requestContextPath + URL.SSE);

    eventSource.onopen = function () {
        console.log("Connection to server opened.");
        clearTimeout(reconnectTimeout); // Clear any pending reconnect attempt
        reconnectTimeout = null; // Reset reconnect timeout for clarity
    };

    eventSource.addEventListener('StaticConfigs', function (event) {
        const {code, data, errorMessage} = JSON.parse(event.data);
        try {
            if (code === '0') {
                store.commit('dictionary/dictionaryList', data);
            } else {
                Message.error(errorMessage || '未知错误');
            }
        } catch (e) {
            Message.error('Failed to parse event data');
        }
    }, false);

    eventSource.onerror = function () {
        Message.error('服务连接失败，请检查网络');
        // Implement reconnection logic (replace with your desired strategy)
        reconnectWithBackoff();
    };
}

function reconnectWithBackoff() {
    // Define initial retry delay (in milliseconds)
    let retryDelay = 5000; // 1 second

    // Exponential backoff calculation (adjust as needed)
    retryDelay = Math.min(retryDelay * 2, 60000); // Max delay of 1 minute

    reconnectTimeout = setTimeout(() => {
        console.log(`Reconnecting to server in ${retryDelay / 1000} seconds...`);
        createEventSource(); // Re-create the event source
    }, retryDelay);
}

function closeEventSource() {
    if (eventSource) {
        eventSource.close();
        console.log("Connection to server closed.");
        clearTimeout(reconnectTimeout); // Clear any pending reconnect attempt
        eventSource = null;
    }
}

export {createEventSource, closeEventSource};