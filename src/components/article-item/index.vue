<template>
<!-- cell单元格的to属性 与routerlink的to属性时一样的
      :to="article/"+article.art_id
      :to="`article/${article.art_id}`""
 -->
  <van-cell class="article-item" 
     :to="`article/${article.art_id}`"
  >
    <!-- 如果type=0那么就是没有图片
           如果type=1那么就是有一张图片
           如果type=3那么就是有三张图片 
           我们想要的效果 , 正好与cell标签的结构符合
       -->
    <!-- 1. 左侧上方标题 -->
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>

    <template #label>
      <!-- 4. 左侧下方的:三张图片, 如果type=3才会出现 -->
      <div v-if="article.cover.type == 3" class="cover-wrap">
        <div
          v-for="(img, index) in article.cover.images"
          :key="index"
          class="cover-item"
        >
          <van-image class="cover-item-img" :src="img"></van-image>
        </div>
      </div>
      <!-- 2. 左侧下方的:作者评论 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}条评论</span>
        <!-- 如何使用过滤?  xxx | 过滤器名字 -->
        <!-- 过滤器调用: 会将|前边的值作为第一个参数传递 -->
        <span>{{ article.pubdate | relativeTime}}</span>
      </div>
    </template>
    <!-- 3.右侧一张图片 , 如果type为1才会出现 -->
    <van-image
      class="right-cover"
      v-if="article.cover.type == 1"
      slot="default"
      :src="article.cover.images[0]"
    ></van-image>
  </van-cell>
</template>

<script>
export default {
  name: "ArticleItem",
  components: {},
  props: {
    // 文章列表项 , 需要显示文章标题, 图片 ,作者 ,发布日期等数据 , 需要接受父组件传递文章对象
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>