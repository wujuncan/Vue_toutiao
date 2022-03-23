//封装本地存储模块

//保存数据方法
export const setItem = (key,value) =>{
    // 如果value是object类型，那么就需要做转化
    if(typeof value == "object"){
       value =  JSON.stringify(value)
    }
    window.localStorage.setItem(key,value)
}

//获取数据方法
//result : "{"name":"zhangsan","age",18}"  -- 可以通过JSON.parse转化成功
//result : "name" -- 通过JSON.parse转化会失败, 所以直接返回
export const getItem = (key) => {
   const result = window.localStorage.getItem(key)
   try {
       return JSON.parse(result)
   } catch (error) {
       return result
   }
}

//移除数据方法

export const removeItem = (key) => {
    window.localStorage.removeItem(key)
}

