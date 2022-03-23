<template>
  <div id="app">
    <h1>黑马头条</h1>
    <UseAxios></UseAxios>
    <router-view />
  </div>
</template>

<script>
// 想在App中显示UseAxios组件 , 那么就需要注册
// 1. 导入
// 2. 注册
import UseAxios from './components/UseAxios.vue'
export default {
  name: 'App',
  components: {
    UseAxios
  }
}
</script>

<style scoped lang="less"></style>