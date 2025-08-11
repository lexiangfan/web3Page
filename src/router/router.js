//这边需要添加page页面路由
import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import page from "@/views/page.vue";
import page1 from "@/views/page1.vue";
import page2 from "@/views/page2.vue";
import About from "@/views/About.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Web3 入门必看'
    }
  },
  {
    path:'/page',
    name:'page',
    component: page,
    meta: {
      title: 'Web3 内容第一章'
    }
  },
  {
    path:'/page1',
    name:'page1',
    component: page1,
    meta: {
      title: '内容第二章'
    }
  },
  {
    path:'/page2',
    name:'page2',
    component: page2,
    meta: {
      title: '内容第三章'
    }
  },
  {
    path:'/about',
    name:'About',
    component: About,
    meta: {
      title: '产品文档'
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
