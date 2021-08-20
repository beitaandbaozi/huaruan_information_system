import Vue from 'vue'
import VueRouter from 'vue-router'
/**
 * 懒加载优化(2021-6-18)
 *
 */
// 导入登录组件(2021-6-12)
const Login = () => import('../components/login.vue')
// 导入Home组件(2021-6-12)
// import Home from '../components/home.vue'
const Home = () => import('../components/home.vue')
// 导入welcome组件(2021-6-12)
// import Welcome from '../components/welcome/welcome.vue'
const Welcome = () => import('../components/welcome/welcome.vue');
// 导入用户主页组件(2021-6-12)
// import Users from '../components/users/users.vue'
const Users = () => import('../components/users/users.vue');
// 导入学生管理主页组件(2021-6-14)
// import Students from '../components/students/students.vue'
const Students = () => import('../components/students/students.vue');
// 导入课程管理主页组件(2021-6-15)
// import Class from '../components/class/class.vue'
const Class = () => import('../components/class/class.vue');
// 导入教师管理主页组件(2021-6-16)
// import Teachers from '../components/teachers/teachers.vue'
const Teachers = () => import('../components/teachers/teachers.vue');
// 导入404页面
const _404 = () => import('../components/404.vue')
// 导入信息管理页面
const Message = () => import('../components/message/message.vue')



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: './welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/students', component: Students },
      { path: '/class', component: Class },
      { path: '/teachers', component: Teachers },
      { path: '/message', component: Message }
    ]
  },
  {
    path: '/404',
    component: _404
  }

]

// 导航守卫





const router = new VueRouter({
  routes
})

export default router
