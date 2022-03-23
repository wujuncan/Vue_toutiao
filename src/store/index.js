import Vue from 'vue'
import Vuex from 'vuex'
import {getItem,setItem} from '@/utils/storage.js'

Vue.use(Vuex)

//1. 将用户登录成功之后的token保存起来
//2. 如果将token只是保存到vuex中, 是无法持久化的, 一刷新界面就丢了,所以这里需要结合本地存储
//JSON.parse:将json字符串转化为对象
//JSON.stringify:将对象字符串化
export default new Vuex.Store({
  state: {
    //存储用户登录之后的token信息的对象
    // user:JSON.parse(window.localStorage.getItem('toutiao-user'))
    user:getItem("toutiao-user")
  },
  mutations: {
    setUser(state,user){
      //1. 保存到vuex的state
      state.user = user
      //2. 保存到本地存储 , localStorage只能存储字符串，需要将对象字符串化
      // window.localStorage.setItem('toutiao-user',JSON.stringify(user))
      setItem("toutiao-user",user)
    }
  },
  actions: {
  },
  modules: {
  }
})
