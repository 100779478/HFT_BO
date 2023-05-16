import Vue from 'vue'
import App from './App.vue'
// import VueRouter from 'vue-router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

import Router from '@/router/index'

Vue.config.productionTip = false
Vue.use(ViewUI);
// Vue.use(VueRouter)
// Router.beforeEach((to, from, next) => {
//   if (!localStorage.getItem('username')) {
//     if (to.path !== '/login') {
//       next('/login')
//     } else next()
//   }
//   next()
// })
new Vue({
  render: h => h(App),
  router: Router
}).$mount('#app')
