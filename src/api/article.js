//与文章相关的请求api方法
import axios from '@/utils/request.js'
//1. 获取频道对应的新闻列表数据
export const getArticles = (params) => {
    return axios({
        url: '/app/v1_0/articles',
        method: 'get',
        // params:params
        params
    })
}
//2. 根据id获取文章详情
export const getArticleById = (articleId) => {
    return axios({
        url: '/app/v1_0/articles/' + articleId,
        method: "get"
    })
}
/**
 * 收藏文章
 */
export const addCollect = (target) => {
    return axios({
        method: 'post',
        url: '/app/v1_0/article/collections',
        data: {
            target
        }
    })
}

/**
 * 取消收藏文章
 */
export const deleteCollect = (target) => {
    return axios({
        method: 'delete',
        url: '/app/v1_0/article/collections/'+target
    })
}

/**
 * 对文章点赞
 */
export const addLikings = (target) => {
    return axios({
        method: 'post',
        url: '/app/v1_0/article/likings',
        data: {
            target
        }
    })
}

/**
 * 取消对文章点赞
 */
export const deleteLinkings = (target) => {
    return axios({
        method: 'delete',
        url: '/app/v1_0/article/likings/'+target
    })
}