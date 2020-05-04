import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入登录组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/users/Users.vue'
Vue.use(VueRouter)
// 路由规则
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/users',
    children: [
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由守卫
router.beforeEach(async (to, form, next) => {
  // 判断路由是否是登录路由
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断是否存在token 如果没有跳转到登录路由
  if (!tokenStr) return next('/login')
  // 如果路由路径不是login
  if (to.path !== '/login') {
    // 发送请求
    const isToken = await Vue.prototype.$axios.get('/menus')
    // 如果是无效token
    if (isToken.data == null && isToken.meta.msg === '无效token') {
      // 清除恶意token值
      window.sessionStorage.removeItem('token')
      // 提交用户
      Vue.prototype.$message({
        message: '对方不想说话并向你放了个屁~',
        type: 'error'
      })
      // 返回登录路由
      return next('/login')
    }
  }
  next()
})
export default router
