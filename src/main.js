import Vue from "vue";
import App from "./App.vue";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
import store from "./store/store.js";
import Router from "@/router/index";
import md5 from "js-md5";
Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.prototype.$md5 = md5;
new Vue({
  render: (h) => h(App),
  router: Router,
  store, // 注册 Vuex store
  beforeCreate() {
    Vue.prototype.$menuPath = this;
  },
}).$mount("#app");
