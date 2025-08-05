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

// 添加全局前置守卫来动态修改标题
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = 'Web3 学习平台'; // 默认标题
  }
  next();
})
export default router