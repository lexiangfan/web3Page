// src/router/router.js
import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";
import NewPage from "@/views/NewPage.vue";
import About from "@/views/About.vue";
import pageService from '@/services/pageService.js'

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

// 当路由发生变化时，同步到页面服务
router.beforeEach((to, from, next) => {
  // 检查页面是否已存在
  const existingPage = pageService.findPageByPath(to.path);

  // 如果页面不存在，则添加到页面服务中
  if (!existingPage && to.meta && to.meta.title) {
    pageService.addPage({
      title: to.name || to.path,
      path: to.path,
      meta: to.meta
    });
  }

  next();
});

export default router
