<template>
  <div class="home-container">
    <!-- nav-bar的title只能显示普通文本标题
         如果想要自定义标题 , 就需要使用同名插槽title来自定义 (自定义为button)
         总结:vant的插槽使用机制,一般vant会提供两套机制:
              1. 属性机制 , 通过属性可以实现默认效果
                  nav-bar的title属性 , 默认普通文本标签
                  field的left-icon, 默认是使用vant内部的icon图标
              2. 同名插槽机制, 通过同名的插槽来实现自定义任意效果
                  nav-bar的title插槽 , 可以自定义button的效果
                  field的left-icon插槽 , 可以自定义使用自己的字体图标
     -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 频道列表 -->
    <!-- animated: 开启切换动画
         swipeable: 可以通过滑动切换标签也
     -->
    <van-tabs class="channel-tabs" v-model="active"
     animated swipeable
     >
      <van-tab v-for="channel in channels"
      :key="channel.id"
       :title="channel.name">
       <!-- //文章列表 -->
       <ArticleList :channel="channel"></ArticleList>
       </van-tab>
      <!-- <van-tab title="标签 2">内容 2</van-tab>
      <van-tab title="标签 3">内容 3</van-tab>
      <van-tab title="标签 4">内容 4</van-tab>
      <van-tab title="标签 5">内容 5</van-tab> -->
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->
  </div>
</template>

<script>
import {getChannels} from '@/api/user.js'
import ArticleList from './components/article-list.vue'
export default {
  name: "HomeIndex",
  components: {
    ArticleList
  },
  props: {},
  data() {
    return {
      active: 0, //van-tas双向数据绑定的变量(控制van-tabs默认选中哪一个标签,索引从0开始)
      channels:[]
    };
  },
  computed: {},
  watch: {},
  created() {
    //总结:获取数据调用时机总结
    //1. 点击之后需要发起请求 ,那么我们就在点击事件内部调用请求方法
    //2. 界面展示之后就需要将数据展示 , 那么我们需要在created内部调用
    //频道列表是在当前界面显示的时候,需要展示的数据 , 所以在created里调用
    this.fnGetChannels();
  },
  mounted() {},
  methods: {
    //获取用户频道列表
    async fnGetChannels(){
      try {
        const rest = await getChannels();
        console.log(rest);
        //这里获取到的数据要在template中使用,所以需要先进行保存
        this.channels = rest.data.data.channels
      } catch (error) {
        this.$toast.fail('服务器错误,请稍后重试')
      }
    }
  },
};
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    //添加到.van-tabs__line下方:
    .placeholder {
      //占位元素为了解决最后一个tab标签被汉堡盖住问题（看下边的图）
      flex-shrink: 0; //此元素不参与flex的平分
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        //找到父节点，添加伪元素（这个是汉堡按钮与tab之间的一个竖线）
        content: "";
        position: absolute;
        left: 0;
        width: 1px; //在模拟器上看不到（手机上没问题），如果想看到改为2px
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>