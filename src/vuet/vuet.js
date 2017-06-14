import Vue from 'vue'
import Vuet from 'vuet'

Vue.use(Vuet)

export default new Vuet({
  pathJoin: '-',
  modules: {
    topic: {
      list: {
        data () {
          return {
            data: [], // 列表存储的数据
            loading: true, // 数据正在加载中
            done: false, // 数据是否已经全部加载完成
            page: 1 // 加载的页数
          }
        },
        async fetch ({ state, route, params, path }) {
          // 注，在vuet 0.1.2以上版本，会多带一个params.routeWatch参数，我们可以根据这个来判断页面是否发生了变化
          if (params.routeWatch === true) { // 路由发生了变化，重置模块状态
            this.reset(path)
          } else if (params.routeWatch === false) { // 路由没有变化触发的请求，可能是从详情返回到列表
            return {}
          }
          // params.routeWatch 没有参数，则是上拉加载触发的调用
          const { tab = '' } = route.query
          const res = await fetch(`https://cnodejs.org/api/v1/topics/?mdrender=false&limit=20&page=${state.page}&tab=${tab}`).then(response => response.json())
          const data = params.routeWatch ? res.data : [...state.data, ...res.data]
          return {
            data,
            page: ++state.page,
            loading: false,
            done: res.data.length < 20
          }
        }
      }
    }
  }
})