// 封装axios请求模块
import axios from 'axios'
import store from '@/store'
// 1. 配置基准地址
axios.defaults.baseURL = 'http://toutiao.itheima.net/'
// 2. 对请求的统一配置
// 请求拦截器的作用: 1.对请求进行拦截  2.对请求做统一处理
axios.interceptors.request.use(function (config) { 
    // config：本次请求的请求配置对象
    console.log(config.url);// "/app/v1_0/authorizations"
    //1. 统一去掉/app
    if (config.url.startsWith('/app')) {
        config.url = config.url.slice(4)//从索引4开始截取,截取到结尾
    }
    console.log(config.url); // "/v1_0/authorizations"
    //2.统一添加认证头
    const user = store.state.user
    if(user&&user.token){
      config.headers.Authorization = "Bearer "+user.token
      // config.headers.Authorization = `Bearer ${user.token}`//模板字符串,变量与字符串拼接的语法
    }

    // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
    return config
  }, function (error) {
    // 如果请求出错了（还没有发出去）会进入这里
    return Promise.reject(error)
  }) 
  // 3. 响应拦截器(响应数据回来时会统一执行use方法)
axios.interceptors.response.use( 
  //成功时走的回调函数
  function(response) { 
    return response
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function(error) { 
    // 如果响应码是 401 ，则请求获取新的 token 
    // 响应拦截器中的 error 就是那个响应的错误对象
    if (error.response && error.response.status === 401) {
      // 校验是否有 refresh_token , 如果没有直接跳转到登录
      const user = store.state.user 
      if (!user || !user.refresh_token) {
        router.push("/login") 
        return
      } 
      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: "PUT",
          url: "/app/v1_0/authorizations",
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        }) 
        // 如果获取成功，则把新的 token 更新到容器中
        console.log("刷新 token  成功", res);
        store.commit("setUser", {
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: user.refresh_token // 还是原来的 refresh_token
        }) 
        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log("请求刷线 token 失败", err)
        router.push("/login")
      }
    }
    return Promise.reject(error)
  }
);

export default axios