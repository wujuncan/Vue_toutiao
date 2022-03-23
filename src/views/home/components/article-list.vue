<template>
  <div class="article-list">
    <!--pull-refresh  -->
    <!-- 
        v-model	是否处于加载中状态
        success-text	刷新成功提示文案
        success-duration	刷新成功提示展示时长(ms)
        refresh	下拉刷新时触发的事件
    
     -->
    <van-pull-refresh
      :success-text="refreshSuccessText"
      :success-duration="1500"
      v-model="isRefreshLoading"
      @refresh="onRefresh"
    >
      <!-- list组件 finished-text: 加载结束之后的提示文本-->
      <!-- 
        list: 列表组件 : 瀑布流滚动加载, 用于展示长列表
        List组件通过 loading和 finished 两个变量控制加载状态
        loading: (控制 "加载中..." 是否显示)
            当组件初始化 或 滚动到页面底部时  , 会触发load事件 并且 会将loading状态设置为true(自动) , 此时就可以发起异步请求获取数据.
            数据获取完毕 , 就会将loading状态设置为false(手动).
        finished: (控制 finished-text:"没有更多了" 是否显示)
            若数据已经全部加载完毕 , 则将finished 设置为 true , 代表整个数据加载结束 , 没有更多数据

        1. load事件: 加载事件
            list初始化时 , 会触发一次load事件 , 用于加载第一页数据
            如果第一页数据不能占满全屏 , list会再次触发load事件 , 直到数据占满一屏为之
            如果也没滚动到底部, 也会自动触发load事件

        2. loading属性: 控制加载中状态
            loading为false时,代表非加载中状态 , 此时会根据列表的滚动位置判断是否要触发load事件
            loading为true时,代表加载中状态, 表示正在发送异步请求,加载数据  , 此时不会再次触发load事件

        3. finished属性: 控制加载结束状态
            在每次请求完毕之后 , 需要手动将loading设置为false , 代表本次加载结束
            所有数据加载结束 , 我们需要控制finished为true , 此时就不再会触发load事件
     -->
      <!-- error需要添加sync修饰符: 这是因为父组件要修改error,子组件vant-list也需要修改
          父子组件同时需要修改error数据
          错误处理逻辑:
            1.如果加载过程中出现错误 , 那么我们自己控制error为true
            2. error-text就会显示
            3. 点击error-text标签 , 就会自动重新执行load事件
      -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="加载错误,请点击重试"
      >
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
        <ArticleItem v-for="(article,index) in list" 
        :key="index" 
        :article="article">
        </ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article.js";
import ArticleItem from '@/components/article-item'
// 文章列表组件
export default {
  name: "ArticleList",
  components: {
    ArticleItem
  },
  props: {
    // 当前频道是哪个呢? 是由父组件home/index.vue传递过来的  , 父向子传递数据
    channel: {
      type: Object, //要求数据类型是对象
      required: true, //必传
    },
  },
  data() {
    return {
      list: [], // 当前频道的文章列表数据
      loading: false,
      finished: false,
      timestamp: null,
      error: false, //表示当前列表加载错误状态
      // 控制下拉刷新的失败状态
      isRefreshLoading: false,
      refreshSuccessText: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // list初始化和页面滚动到底部 , 都会触发load事件 , 会调用onLoad方法
    async onLoad() {
      console.log("onLoad");
      // //1. 发起请求获取数据
      //   setTimeout(() => {
      //       //2. 把请求结果数据放到list数组中
      //     for (let i = 0; i < 10; i++) {
      //         // 0 + 1 = 1
      //         // 1 + 1 = 2
      //       this.list.push(this.list.length + 1);
      //     }
      //     //3. 本次数据加载结束 , 需要手动将loading设置为false
      //     this.loading = false;
      //     //4. 判断数据是否全部加载完毕 , 如果加载完毕,那么就需要手动将finished设置为true
      //     if (this.list.length >= 50) {
      //       this.finished = true;
      //     }
      //   }, 1000);
      try {
        //1. 发起请求获取数据
        const result = await getArticles({
          channel_id: this.channel.id, //当前频道的id
          // 如果是当前时间,那么就返回频道的最新文章列表
          // 如果获取下一页数据? 在请求完当前页数据之后,服务器会返回一个pre_timestamp字段
          // pre_timestamp就是当前页的下一页的数据时间戳
          timestamp: this.timestamp || Date.now(), //时间戳
          with_top: 1, // 1代表返回置顶文章,0不返回置顶文章 , 服务器数据没有置顶数据,所以固定1
        });
        console.log(result);
        //模拟错误
        // if (Math.random() > 0.5) {
        //   JSON.parse("asdfasdf123");
        // }
        //2. 把请求结果数据放到list数组中
        // this.list = result.data.data.results; 这里不能这样处理 (因为我们还有第二页数据)
        // 由于这里有分页数据,所以需要采用追加的形式添加数据
        this.list.push(...result.data.data.results);
        // this.list.push( 1,2)// result.data.data.results => [1,2]
        //3. 本次数据加载结束 , 需要手动将loading设置为false
        this.loading = false;
        //4. 判断数据是否全部加载完毕 , 如果加载完毕,那么就需要手动将finished设置为true
        if (result.length == 0) {
          //如果当前页数据长度为0 ,那么就说明没有更多数据
          this.finished = true;
        } else {
          this.timestamp = result.data.data.pre_timestamp;
          console.log("更新时间戳:" + this.timestamp);
        }
      } catch (error) {
        console.log(error);
        this.error = true;
        this.loading = false;
        if (error.response.status == 400) {
          this.$toast.fail("请求参数错误");
        } else {
          this.$toast.fail("未知错误,请稍后重试");
        }
      }
    },
    // pull-refresh的下拉刷新方法
   async onRefresh(){
      try {
        // 1. 请求获取数据
        const result = await getArticles({
          channel_id:this.channel.id,
          timestamp:Date.now(),
          with_top:1
        })
        // 2. 将数据添加到列表的顶部
        const articles = result.data.data.results 
        this.list.unshift(...articles)
        // 3. 关闭下拉刷新的loading状态 , 更新下拉刷新的成功提示文本
        this.isRefreshLoading = false
        this.refreshSuccessText = `刷新成功,更新了${articles.length}条数据`
      } catch (error) {
        console.log(error);
        //错误的情况
        this.refreshSuccessText = '刷新失败'
        this.isRefreshLoading = false
        
      }
    }
  },
};
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  // vw: viewportWidth 视口宽度
  // vh: viewportHeight 视口高度
  height: 79vh;
  overflow-y: auto;
}
</style>