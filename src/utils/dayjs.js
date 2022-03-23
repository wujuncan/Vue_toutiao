//处理相对时间的工具类
import Vue from 'vue'
import dayjs  from 'dayjs' //导入dayjs
import relativeTime from 'dayjs/plugin/relativeTime' //导入相对时间插件

import "dayjs/locale/zh-cn"//导入语言包

dayjs.extend(relativeTime) // 加载配置相对时间的插件
dayjs.locale('zh-cn') // 配置语言包

//to:计算一个时间到另一个时间的相对时间
//dayjs()不传递参数代表返回的是一个当前时间对象
//dayjs(xxx)传递参数代表返回的传递时间的时间对象
// console.log(dayjs().to(dayjs('2021-02-25')));
// Vue.filter(过滤器的名字,过滤器的函数)
Vue.filter('relativeTime', value => { // value处理成相对时间的时间
    return dayjs().to(dayjs(value))// 计算value到现在的相对时间
})
