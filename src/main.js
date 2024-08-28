import Vue from "vue";
import App from "./App.vue";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
import store from "@/store";
import Router from "@/router/index";
import md5 from "js-md5";
import 'intro.js/introjs.css';
import introJs from 'intro.js';
import {log} from "@/common/log";
import {requestContextPath, sseUrl} from "@/api/serverApi";

// // 获取当前脚本的路径
// const scriptElement = document.currentScript || (function () {
//     const scripts = document.getElementsByTagName('data-src');
//     return scripts[scripts.length - 1];
// })();
//
// console.log('Current script src:', scriptElement.src);

// Attach config to Vue prototype
Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.prototype.$introJs = introJs;
Vue.prototype.$md5 = md5;
Vue.prototype.$log = log;

let sseWorker = null;

function startSSE(url) {
    if (window.Worker) {
        if (sseWorker) {
            sseWorker.terminate(); // 终止之前的 Worker
        }
        sseWorker = new Worker(new URL('@/server/sse.js', import.meta.url));
        sseWorker.postMessage({type: 'start', url: url});
        sseWorker.addEventListener('message', function (event) {
            const {type, data, message} = event.data;
            if (type === 'dictionaryList') {
                store.commit('dictionary/dictionaryList', data);
            } else if (type === 'error') {
                ViewUI.Message.error(message);
            }
        });
    } else {
        console.error("Web Workers are not supported in this browser.");
    }
}

function stopSSE() {
    if (sseWorker) {
        sseWorker.postMessage({type: 'close'});
        sseWorker.terminate();
        sseWorker = null;
    }
}


new Vue({
    render: (h) => h(App),
    router: Router,
    store, // 注册 Vuex store
    // beforeCreate() {
    //     Vue.prototype.$menuPath = this;
    // },
    created() {
        // 添加 beforeunload 事件监听器
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        // 检查是否是页面刷新
        if (sessionStorage.getItem('isPageReload')) {
            sessionStorage.removeItem('isPageReload');
            // 执行刷新后的操作，重定向到主页面
            const mark = location.hash.substring(2)
            if (mark !== 'login' && mark) {
                this.$router.replace({name: 'Dashboard'});
            }
        }
        // 启动 SSE Worker
        startSSE(requestContextPath + sseUrl.SSE);
    },
    methods: {
        handleBeforeUnload() {
            // 设置标志，表示页面将要刷新
            sessionStorage.setItem('isPageReload', 'true');
        }
    },
    beforeDestroy() {
        // 停止 SSE Worker
        stopSSE();
        // 移除 beforeunload 事件监听器
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
}).$mount("#app");


