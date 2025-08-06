import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";
import NewPage from "@/views/NewPage.vue"; // 添加新页面导入
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
    path:'/Page',
    name:'Page',
    component: Page,
    meta: {
      title: 'Web3 内容页面'
    }
  },
  {
    path:'/about',
    name:'About',
    component: About,
    meta: {
      title: '关于我们'
    }
  },
  {
    path:'/newPage',
    name:'NewPage',
    component: NewPage,
    meta: {
      title: '添加新页面'
    }
  },

]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router