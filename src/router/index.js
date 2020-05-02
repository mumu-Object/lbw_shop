import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, form, next) => {
  // 判断路由是否是登录路由
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断是否存在token 如果没有跳转到登录路由
  if (!tokenStr) return next('/login')
  next()
})
export default router
