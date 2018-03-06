import Vue from 'vue'
import App from './App'
import vueRouter from 'vue-router'
import routers from './routers'
/*import axios from 'axios'
axios.defaults.baseURL = 'D:/learn/vue-project/learn-router/dist'
Vue.prototype.$axios = axios*/


Vue.config.productionTip = false

Vue.use(vueRouter);
const router = new vueRouter({
  mode:'hash',
  routes:routers
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
