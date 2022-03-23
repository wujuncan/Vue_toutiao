module.exports = {
  plugins: {
    // vue/cli 脚手架已经处理过浏览器兼容问题 , 配置过 browsers , 这里屏蔽掉 
    //   'autoprefixer': {
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    //   },
    // pxtorem : 将px转化为rem
    // div{width:750px}  750px ?? 转化为 rem???
    // 我们得知道一个比例关系 : rootValue就是1rem的大小
    // rootValue: 75 , 1rem = 75px   ====> 750px  转化为 10rem

    // rootValue是根据设计稿来设置的 , 设计稿是750px , 那么rootValue就是十分之一75px
    // 项目的设计稿是750px
    // 项目中使用vant的设计稿是375px
    'postcss-pxtorem': {
      // rootValue: 根值 , 基准值 , 参照物
      // rootValue: 37.5,
      // rootValue: 75,
      rootValue(obj) {
        console.log(obj.file);//样式文件路径
        // \101_其他\实训\河南大学\资料\课堂代码\toutiao-m\node_modules\vant\lib\index.css  这个包含vant说明是vant的样式,那么rootvalue就是37.5
        // \前端\101_其他\实训\河南大学\资料\课堂代码\toutiao-m\src\styles\index.less  这个不包含vant说明是项目本身的样式,那么rootvalue就是75
        //如果vant的索引不等于-1，说明包含vant字眼，就是vant的样式，返回37.5
        return obj.file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      propList: ['*'],
      // 配置不做单位转换的资源文件名
      exclude: 'github-markdown'
    }
  }
}