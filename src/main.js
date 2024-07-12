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
import {closeEventSource} from "@/server/sse";

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.prototype.$introJs = introJs;
Vue.prototype.$md5 = md5;
Vue.prototype.$log = log;
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
            this.$router.replace({name: 'Dashboard'});
        }
    },
    methods: {
        handleBeforeUnload() {
            // 设置标志，表示页面将要刷新
            sessionStorage.setItem('isPageReload', 'true');
        }
    },
    beforeDestroy() {
        // 断开连接SSE
        closeEventSource()
        // 移除 beforeunload 事件监听器
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
}).$mount("#app");
