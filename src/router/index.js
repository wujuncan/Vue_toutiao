import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../views/login/index.vue'

Vue.use(VueRouter)

//路由规则
const routes = [
  // /首页的路由
  {
    path:'/',
    component:() => import('@/views/layout'),
    children:[//配置layout的子路由规则
      {
        path:'',//默认路径 , 意思访问/的时候,会将home组件直接显示出来
        component:() => import('@/views/home')
      },
      {
        path:'my', // /my
        component:() => import('@/views/my')
      },
      {
        path:'qa',// /qa
        component:() => import('@/views/qa')
      },
      {
        path:'video',// /video
        component:() => import('@/views/video')
      },

    ]
  },
  // 登录界面的路由规则
  {
    //路径
    path:'/login',
    //组件
    // component:Login
    //懒加载组件 , import()函数:指定的参数是导入的组件路径
    //@:代表当前项目的src路径 , 可以省略index.vue
    component:() => import('@/views/login')

  },
  //文章详情
  {
    //需要接受路由参数
    path:'/article/:articleId',
    component:()=> import("@/views/article"),
    //开启props传参
    props:true // 相当于将路由参数变为props数据来接受
  }
]

const router = new VueRouter({
  routes
})

export default router