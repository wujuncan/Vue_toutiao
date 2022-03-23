<template>
  <div class="">
    <h1>1. 查询所有图书信息</h1>
    <!-- <button v-on:click="fnGetAllBooks">查询-看控制台</button> -->
    <button @click="fnGetAllBooks">查询-看控制台</button>
    <h1>2. 查询某本图书信息</h1>
    <input type="text" placeholder="输入要查询的书名" 
    v-model="bookname">
    <button @click="fnGetBookByBookName">查询某本图书</button>
    <h1>3. 发布图书</h1>
    <input type="text" placeholder="书名" v-model="newBook.bookname">
    <input type="text" placeholder="作者" v-model="newBook.author">
    <input type="text" placeholder="出版社" v-model="newBook.publisher">
    <button @click="fnAddBook">新增图书</button>
  </div>
</template>

<script>
// 一. 点击按钮 , 查询所有图书信息
// 1. 给按钮添加点击事件
// 2. 在处理程序中, 发起axios请求 , 获取所有图书信息
// 二. axios的使用步骤
// 1. 下载axios
// 2. 引入axios
// 3. 发起axios请求
// 三. 根据图书名称, 获取单本图书
// 问题: 如何获取用户在文本框中输入的图片名称???
// vue中固定通过v-model获取用户输入的内容
// 给文本框input添加v-model(双向数据绑定)
// 双向数据绑定: 
// 1. 数据影响界面
// 2. 界面变化影响数据
import axios from 'axios'  //引入axios
//四、 给axios添加默认url
axios.defaults.baseURL = 'http://123.57.109.30:3006'
export default {
  // 组件名称
  name: "",
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
        bookname:'',// 图书文本框双向数据绑定的遍历
        newBook:{ // 新增图书的对象
          bookname:'',
          author:'',
          publisher:''
        }
    };
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    fnGetAllBooks() {
      //发起axios请求 , 获取所有图书信息
      axios({
          // 请求方式
          method:'GET',
          // 请求url
          url:'/api/getbooks'
      }).then(res => { // 请求成功执行的代码
          console.log(res);
          console.log(res.data);
      }).catch(error => { // 请求失败执行的代码
          console.log(error);
      })
    },
    // 发起axios请求 , 根据图书名称获取图书
    fnGetBookByBookName(){
        console.log(this.bookname);
        axios({
            //请求方式
            methods:'get',
            //请求url
            url:'/api/getbooks',
            params:{
                bookname: this.bookname
            }
        }).then(res => {
            console.log(res.data);//直接通过res.data获取服务器返回的真正数据
        }).catch(error => {
            console.log(error);
        })
    },
    //发起axios请求 ， 新增一本图书
    fnAddBook(){
      console.log(this.newBook);
      // ... 扩展运算符 ， 拆包运算符
      // {a:1,b:2,c:3}
      // ...{a:1,b:2,c:3} ===> a:1,b:2,c:3
      // a:1,b:2,c:3 变为一个对象 ====》 {a:1,b:2,c:3 }
      // console.log();
      // appkey: "7250d3eb-18e1-41bc-8bb2-11483665535a"
      // 如何给一个对象新增一个新的属性
      this.newBook.appkey = "7250d3eb-18e1-41bc-8bb2-11483665535a";
      axios({
        //post : 邮递 ， 发布 ， 新增
        method:'post',
        url:'/api/addbook',
        //post传递参数 ， 一般通过请求体 ， data
        // data:{
        //   ...this.newBook
        // }
        data:this.newBook
      }).then(res => {
          console.log(res.data);
      }).catch(error => {
        console.log(error);
      })
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted() {},
};
</script> 

<style scoped lang="less">
</style>