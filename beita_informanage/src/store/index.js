import Vue from 'vue'
import Vuex from 'vuex'
 
Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    // 存储登录的id
    userId:'',
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
  },
  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);
    },
    // 改变用户id值，从而切换账号
    changeUserId(state,userId){
      state.userId = userId;
    }
 
  },
  actions: {
  },
  modules: {
  }
});
