<template>
  <div class="article-container markdown-body">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      @click-left="$router.back()"
      left-arrow
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 判断is_followed如果为true,代表已关注,显示已关注按钮 , 点击按钮,取消关注 -->
          <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            @click="onFollow"
            :loading="followLoading"
            >已关注</van-button
          >
          <!-- 反之显示添加关注按钮 , 点击按钮,添加关注-->
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="onFollow"
            :loading="followLoading"
            >关注</van-button
          >
        </van-cell>
        <!-- /用户信息 -->
        <!-- 文章内容 -->
        <!-- 文章内容中包含有html标签, 想要标签生效 , 需要使用v-html -->
        <div
          ref="article-content"
          class="article-content"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus == 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button class="comment-btn" type="default" round size="small"
        >写评论</van-button
      >
      <van-icon name="comment-o" info="123" color="#777" />
      <van-icon
        color="#777"
        :name="article.is_collected ? 'star' : 'star-o'"
        :class="{
          collected: article.is_collected,
        }"
        @click="onCollect"
      />
      <van-icon
        color="#777"
        :name="article.attitude == 1 ? 'good-job' : 'good-job-o'"
        :class="{ attitude: article.attitude == 1 }"
        @click="onAttitude"
      />
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->
  </div>
</template>

<script>
import { getArticleById } from "@/api/article.js";
import { addFollow, deleteFollow } from "@/api/user.js";
import { addCollect, deleteCollect } from "@/api/article.js";
import { addLikings, deleteLinkings } from "@/api/article.js";
//一. 图片预览测试
//1.导入图片预览函数
import { Form, ImagePreview } from "vant";
//2.调用预览函数,传入图片数组
// ImagePreview({
//   //图片数组
//   images:[
//     'https://img.yzcdn.cn/vant/apple-1.jpg',
//     'https://img.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   //起始位置
//   startPosition:1 // 索引从0开始,0代表第一张图片
// })
//二. 将图片预览函数的参数处理成真实数据
//1. 在界面渲染完成之后, 获取所有的img 图片 标签对象
//2. 根据img获取src,这个src其实就是当前文章的真实图片路径
//3. 给img添加点击事件 , 调用ImagePreview方法来预览
export default {
  name: "ArticleIndex",
  props: {
    articleId: {
      type: String,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      article: {},
      isLoading: true, // 文章加载状态
      errStatus: "", // 请求异常状态
      followLoading: false, //关注用户按钮的加载中状态
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      try {
        //随机错误
        // if (Math.random() > 0.5) {
        //   return JSON.parse("asdfas12312");
        // }
        //刚开始请求的时候 , 就应该显示加载中
        this.isLoading = true;
        const result = await getArticleById(this.articleId);
        console.log(result);
        this.article = result.data.data;
      } catch (error) {
        console.log("加载失败");
        console.log(error);
        if (error.response && error.response.status == 404) {
          this.errStatus = 404;
        }
      }
      this.isLoading = false; // 所有逻辑执行完毕,说明加载完成
      // isLoading为false之后, 才会将文章详情显示出来;
      setTimeout(() => {
        this.fnPreviewImg();
      }, 10);
    },
    fnPreviewImg() {
      //二. 将图片预览函数的参数处理成真实数据
      //1. 在界面渲染完成之后, 获取所有的img 图片 标签对象
      const article_content = this.$refs["article-content"];
      const allImg = article_content.querySelectorAll("img"); //查询article_content下所有的img标签
      //2. 根据img获取src,这个src其实就是当前文章的真实图片路径
      const images = [];
      allImg.forEach((img, index) => {
        images.push(img.src);
        //3. 给img添加点击事件 , 调用ImagePreview方法来预览
        img.onclick = () => {
          ImagePreview({
            images: images,
            startPosition: index,
          });
        };
      });
    },
    //添加关注与取消关注的综合函数
    async onFollow() {
      this.followLoading = true; //开始加载中
      try {
        //如果是已经关注 , 那么取消关注
        if (this.article.is_followed) {
          await deleteFollow(this.article.aut_id);
          // this.article.is_followed = false
        } else {
          //如果是没有关注 , 那么添加关注
          await addFollow(this.article.aut_id);
          // this.article.is_followed = true;
        }
        // 更新是否关注的标记 , 进而影响界面
        this.article.is_followed = !this.article.is_followed;
      } catch (error) {
        console.log(error);
        if (error.response.status == 400) {
          this.$toast.fail("参数错误");
        } else if (error.response.status == 401) {
          this.$toast.fail("未认证,重新登录");
        } else {
          this.$toast.fail("未知错误,请求稍后重试");
        }
      }
      this.followLoading = false; //结束加载中
    },
    //收藏或取消收藏
    async onCollect() {
      // 开始请求
      // 开始请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        // 是否收藏
        if (this.article.is_collected) {
          // 父组件 传递articleId
          await deleteCollect(this.article.art_id);
        } else {
          await addCollect(this.article.art_id);
        }
        // 更新视图
        this.article.is_collected = !this.article.is_collected;
        this.$toast.success(
          this.article.is_collected ? "收藏成功" : "取消收藏"
        );
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败，请重试");
      }
    },
    //点赞或取消点赞
    async onAttitude() {
      try {
        //是否点赞
        if (this.article.attitude === 1) {
          await deleteLinkings(this.article.art_id);
          this.article.attitude = 0
          console.log(this.article.attitude)
        } else {
          await addLikings(this.article.art_id);
          this.article.attitude = 1
          console.log(this.article.attitude)
        }
        this.$toast.success(
          this.article.attitude == 1 ? "已点赞" : "取消点赞"
        );
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
  .collected {
    color: #ffa500 !important;
  }
  .attitude {
    color: #ffa500 !important;
  }
}
</style>