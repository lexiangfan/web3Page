import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";
import About from "@/views/About.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Web3 入门必看' // 添加标题
    }
  },
  {
    path:'/Page',
    name:'Page',
    component: Page,
    meta: {
      title: 'Web3 内容页面' // 添加标题
    }
  },
  {
    path:'/about',
    name:'About',
    component: About,
    meta: {
      title: '关于我们' // 添加标题
    }
  }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes:[]
})

export default router