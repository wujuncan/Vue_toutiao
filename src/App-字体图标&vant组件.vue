<template>
  <div id="app">
    <h1>黑马头条</h1>
    <!-- //字体图标 -->
    <i class="toutiao toutiao-sousuo"></i> <br />
    <van-button type="primary">主要按钮</van-button>
    <van-button type="success">成功按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <br />
    <van-button loading type="primary" />
    <van-button loading type="primary" loading-type="spinner" />
    <van-button loading type="primary" loading-text="加载中..." />

    <van-cell title="选择单个日期" :value="date" @click="show = true" />
    <van-calendar v-model="show" @confirm="onConfirm" />
    <router-view />
  </div>
</template>

<script>
// 想在App中显示UseAxios组件 , 那么就需要注册
// 1. 导入
// 2. 注册
import UseAxios from "./components/UseAxios.vue";
import { ref } from "vue";
export default {
  name: "App",

  data() {
    return {
      date: '',
      show: false,
    };
  },
  components: {
    UseAxios,
  },
  methods: {
     formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
      console.log(this.date);
    },
  },
};
</script>

<style scoped lang="less"></style>