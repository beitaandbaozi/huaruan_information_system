import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// 导入element-ui(2021-6-12)
import './plugins/element'
// 导入axios(2021-6-12)
import axios from 'axios'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 引入weui ===> 图片上传(后续重构为 element-ui upload 组件)
import 'weui/dist/style/weui.min.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'


// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 

Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
Vue.config.productionTip = false


/*
beforeEach:从一个页面跳转到另外一个页面时触发
to:要跳转的页面
from:从哪个页面出来
next:决定是否通过
*/
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();
  } else {
    let token = localStorage.getItem('Authorization');
    console.log(token)
    if (token === null || token === '') {
      next('/login');
    } else {
      if (to.matched.length === 0) {
        next('/404')
      } else {
        next();
      }
    }
  }
});



// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('Authorization')) {
      config.headers.Authorization = localStorage.getItem('Authorization');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
