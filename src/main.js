import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'amfe-flexible'
import store from './store'
//导入dayjs,初始化相对时间的过滤器
import '@/utils/dayjs.js'

// 初始化vant
// 1. 导入vant js
import Vant from 'vant'
// 2. 导入vant css
import 'vant/lib/index.css'
import './styles/index.less'


Vue.config.productionTip = false

// 3. 注册vant组件
Vue.use(Vant) 
// use方法内部会调用Vant.install()方法来注册
// install方法会调用Vue.component() 注册组件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


