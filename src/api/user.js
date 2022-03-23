// 此处书写所有跟用户相关的接口请求方法
import axios from '@/utils/request.js'
import store from '@/store/index.js'
// 1. 登录请求方法
export const login = (data) =>{
    //在接口方法中, 直接返回axios的结果
  return  axios({
        url:'/app/v1_0/authorizations',
        method:'POST',
        data
    })
}

//2. 发送验证码的方法
export const sendSms = (mobile) =>{
    return axios({
        url:'/app/v1_0/sms/codes/'+mobile,
        method:'get'
    })
}
//3. 获取用户个人信息
export const getUserInfo = () =>{
    console.log("Bearer "+store.state.user.token);
    return axios({
        url:'/app/v1_0/user',
        method:'get',
        //请求头
        // headers:{
        //     // 认证头的值,就是token
        //     Authorization:"Bearer "+store.state.user.token
        // }
    })
}
//4. 获取用户频道列表
export const getChannels = ()=>{
    return axios({
        url:'/app/v1_0/user/channels',
        method:'get'
    })
}

// 添加关注
export const addFollow = (target_user_id) => {
    return axios({
        url:'/app/v1_0/user/followings',
        method:'post',
        data:{
            target:target_user_id
        }
    })
}

// 取消关注
export const deleteFollow = (target_user_id) =>{
    return axios({
        url:'/app/v1_0/user/followings/'+target_user_id,
        method:'delete'
    })
}