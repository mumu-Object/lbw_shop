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

axios.defaults.baseURL = 'http://192.168.0.108:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
