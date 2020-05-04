import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局css样式
import './assets/css/global.css'
// 导入基于断点的隐藏类
import 'element-ui/lib/theme-chalk/display.css'
// 导入axios
import axios from 'axios'
// 设置axios默认地址
axios.defaults.baseURL = 'http://192.168.0.108:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// axios响应拦截器
axios.interceptors.response.use(config => {
  return config.data
})
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
