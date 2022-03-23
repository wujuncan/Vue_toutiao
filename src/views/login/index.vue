<template>
  <div class="login-container">
    <!-- 导航栏 title:导航栏的标题 ,显示在中间 -->
    <van-nav-bar class="page-nav-bar" title="登录" />
    <!-- /导航栏 -->
    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="userForm">
      <!-- submit事件提交表单且验证通过后触发 -->
      <!-- field的name:提交时的名字  , placeholder:占位内容 -->
      <!-- <van-field name="手机号" placeholder="请输入手机号"
        left-icon="cart-o"
      > -->
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userRules.mobile"
        type="number"
      >
        <!-- left-icon属性只能使用vant里内部提供的icon图标
            如果想自定义,那么就需要使用同名的插槽:left-icon
       -->
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>
      <van-field
        name="验证码"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userRules.code"
        type="number"
      >
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <template #button>
          <!-- button调整颜色和圆角 -->
          <!-- "false","true" 转化boolean为true  ""转化是false -->
          <!-- round属性需要的是boolean的值 -->
          <!-- 属性绑定的两个用处:1.属性绑定 2.将数据还原为真实的数据类型:'true'--true -->
          <!-- <van-button size="small" :round="true" type="default">发送验证码</van-button> -->
          <!-- van-button的native-type默认就是submit -->
          <!-- 发送验证码只是想单独处理发送验证码请求的逻辑 , 不希望提交表单 -->
          <van-button
            size="small"
            round
            type="default"
            native-type="button"
            @click="fnSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <!-- button的属性: block块级元素 , type按钮的颜色,info蓝色 
            native-type: 原生button的type属性 , 控制按钮的类型(提交按钮submit,重置按钮reset,普通按钮button)
            native:原生,原始
            van-button的type是控制颜色的 , 与原生button的type冲突了 
            所以改名为native-type
           -->
        <van-button class="login-btn" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>
<script>
// 一、点击登录按钮，实现登录功能
// 1. 给登录按钮添加点击事件 (由于登录按钮是提交按钮,点击时会触发submit , 就不再额外添加点击事件)
// 2. 收集用户输入的内容 (如何获取用户输入的内容: v-model)
// 3. 发起登录请求
// 二、给表单添加校验规则 (给field添加rules属性)
// 1. 需要定义校验规则对象
// 2. 给field的rules绑定校验规则对象中的某项校验规则
// 三、 处理发送验证码
// 1. 给发送验证码按钮添加点击事件
// 2. 手动再次校验手机号
// 3. 发起获取验证码的请求,传递手机号

import { login, sendSms } from "@/api/user.js";
export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      //表单校验规则对象
      userRules: {
        //手机
        mobile: [
          //必填校验 (required必填校验,message是错误提示信息,trigger校验规则触发时机:onBlur失去焦点)
          { required: true, message: "请输入手机号", trigger: "onBlur" },
          //手机号格式校验 (trigger默认就是onBlur)
          { pattern: /^1[3|5|7|8]\d{9}$/, message: "请输入合法的手机号" },
        ],
        //验证码
        code: [
          //必填
          { required: true, message: "请输入验证码" },
          //长度校验,必须是6位
          { pattern: /^\d{6}$/, message: "请输入六位验证码" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      //values就是当前表单中的数据对象,暂时不用
      console.log("点击了登录");
      //登陆中进度条
      this.$toast.loading({
        message: "加载中...", //提示框的消息
        forbidClick: true, // 禁止点击
        duration: 0, //显示时长,0不消失(但是如果再出现一个toast,这个就会自动隐藏)
      });

      // 对请求做统一的错误捕获
      try {
        const result = await login(this.user);
        console.log(result);
        this.$toast.success("登录成功");
        //TODO 登录成功之后需要将token报错到vuex中
        // mutations方法
        this.$store.commit('setUser',result.data.data)
        //跳转到我的界面
        this.$router.push('/my')
      } catch (error) {
        if (error.response.status == 400) {
          // console.log("请求参数错误");
          this.$toast.fail("请求参数错误");
        } else if (error.response.status == 401) {
          // console.log("用户未认证");
          this.$toast.fail("用户未认证");
        } else {
          // console.log("服务器错误,请求稍后重试");
          this.$toast.fail("服务器错误,请求稍后重试");
        }
      }
    },
    //发送验证码
    fnSendSms() {
      // 三、 处理发送验证码
      // 1. 给发送验证码按钮添加点击事件
      // 2. 手动再次校验手机号
      // 调用表单对象的validate('要校验的表单项的name')
      // 如何获取元素对象 , 给此元素添加ref属性,再this.$refs
      // validate方法返回的是promise对象 , 如果校验失败会走catch , 校验通过会走then
      this.$refs.userForm
        .validate("mobile")
        .then(async (res) => {
          console.log("校验通过");
          try {
            // 3. 发起获取验证码的请求,传递手机号
            await sendSms(this.user.mobile);
            this.$toast.success('发送成功')
          } catch (error) {
            if(error.response.status == 404){
              this.$toast.fail('手机号不正确')
            }else if(error.response.status == 429){
              this.$toast.fail('发送太频繁')
            }else{
              this.$toast.fail('服务器异常, 请稍后重试')

            }
          }
        })
        .catch((error) => {
          // 必须catch, 要不然会报错
          console.log("校验失败");
          console.log(error);
        });
    },
  },
};
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>