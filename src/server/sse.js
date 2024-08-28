let eventSource = null;
let reconnectTimeout = null; // Variable to store timeout handler

self.addEventListener('message', function (event) {
    const {type, url} = event.data;

    if (type === 'start') {
        createEventSource(url);
    } else if (type === 'close') {
        closeEventSource();
    }
});

function createEventSource(url) {
    if (eventSource) {
        eventSource.close();
        console.log("Existing connection to server closed.");
    }

    eventSource = new EventSource(url);

    eventSource.onopen = function () {
        console.log("Connection to server opened.");
        clearTimeout(reconnectTimeout); // Clear any pending reconnect attempt
        reconnectTimeout = null; // Reset reconnect timeout for clarity
    };

    eventSource.addEventListener('StaticConfigs', function (event) {
        const {code, data, errorMessage} = JSON.parse(event.data);
        try {
            if (code === '0') {
                // 发送数据到主线程
                self.postMessage({type: 'dictionaryList', data});
            } else {
                self.postMessage({type: 'error', message: errorMessage || '未知错误'});
            }
        } catch (e) {
            self.postMessage({type: 'error', message: 'Failed to parse event data'});
        }
    }, false);

    eventSource.onerror = function () {
        self.postMessage({type: 'error', message: '服务连接失败，请检查网络'});
        // Implement reconnection logic (replace with your desired strategy)
        reconnectWithBackoff(url);
    };
}

function reconnectWithBackoff(url) {
    // Define initial retry delay (in milliseconds)
    let retryDelay = 5000; // 1 second

    // Exponential backoff calculation (adjust as needed)
    retryDelay = Math.min(retryDelay * 2, 60000); // Max delay of 1 minute

    reconnectTimeout = setTimeout(() => {
        console.log(`Reconnecting to server in ${retryDelay / 1000} seconds...`);
        createEventSource(url); // Re-create the event source
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
