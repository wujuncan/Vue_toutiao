<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            :src="userInfo.photo"
            round
            fit="cover"
          />
          <span class="name">{{userInfo.name}} </span>
        </div>
        <div class="right">
          <van-button size="mini" round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}} </span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}} </span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}} </span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}} </span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="fnToLogin">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 宫格导航 -->
    <van-grid class="grid-nav mb-9" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell
      v-if="user"
      class="logout-cell"
      clickable
      title="退出登录"
      @click="fnLogout"
    />
  </div>
</template>

<script>
// 什么情况下使用映射 , 什么情况下直接通过$store.state.xxx来访问
// 如果在当前界面多次使用这个数据,那么就用映射
// 反之就使用$store.state.xxx来访问
import { mapState } from "vuex";
import {getUserInfo} from '@/api/user.js'
export default {
  name: "MyIndex",
  components: {},
  props: {},
  data() {
    return {
      userInfo:{}
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  watch: {},
  created() {
    //界面显示就需要获取网络数据,并且将网络数据回显到界面上
    //这种情况就需要在created中发起网络请求
    this.fnGetUserInfo()
  },
  mounted() {},
  methods: {
    //退出登录
    fnLogout() {
      //1.弹出确认对话框
      this.$dialog
        .confirm({
          title: "退出提示",
          message: "确认要退出么?",
        })
        .then(() => {
          //点击了确认
          //2.清空user数据
          this.$store.commit("setUser", null);
          //3.跳转到login界面
          this.$router.push("/login");
        })
        .catch(() => {
          //点击了取消
          //啥都不做
        });
    },
    //跳转到登录界面
    fnToLogin() {
      this.$router.push("/login");
    },
    //获取用户信息的方法
    async fnGetUserInfo(){
      try {
       const result = await getUserInfo()
       console.log(result);
       // 界面的template需要使用result中的数据,所以需要保存起来
       this.userInfo = result.data.data
      } catch (error) {
        if(error.response.status == 400){
          this.$toast.fail('请求参数错误');
        }else if(error.response.status == 401){
          this.$toast.fail('用户认证失败');//token错误/过期导致
        }
        
      }
    }
  },
};
</script>

<style scoped lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }

  .mb-9 {
    margin-bottom: 9px;
  }
}
</style>