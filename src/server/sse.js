import { requestContextPath } from "@/api/serverApi";
import { Message } from "view-design";
import store from "@/store";

let eventSource = null;

function createEventSource() {
    if (eventSource) {
        eventSource.close();
        console.log("Existing connection to server closed.");
    }
    eventSource = new EventSource(requestContextPath + '/sse');
    eventSource.onopen = function () {
        console.log("Connection to server opened.");
    };
    eventSource.addEventListener('StaticConfigs', function (event) {
        const data = JSON.parse(event.data);
        try {
            if (data.code === '0') {
                store.commit('dictionary/dictionaryList', data.data);
            } else {
                Message.error(data?.errorMessage || 'An unknown error occurred');
            }
        } catch (e) {
            Message.error('Failed to parse event data');
        }
    }, false);
    eventSource.onerror = function (event) {
        Message.error('Server is unreachable, check your internet connection');
    };
}

function closeEventSource() {
    if (eventSource) {
        eventSource.close();
        console.log("Connection to server closed.");
        eventSource = null;
    }
}

export { createEventSource, closeEventSource };
