// src/router/router.js
import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";
import NewPage from "@/views/NewPage.vue";
import About from "@/views/About.vue";
import searchService from "@/services/searchService.js";

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
    path:'/newPage',
    name:'NewPage',
    component: NewPage,
    meta: {
      title: '添加新页面'
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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由切换后，索引当前页面内容
router.afterEach(async (to) => {
  try {
    // 根据当前路径获取内容
    const pageName = to.path.substring(1); // 移除 '/'
    const contentModule = await import(`@/utils/${pageName}Content.js`);
    const content = contentModule.default || contentModule[`${pageName}Contents`];
    if (content) {
      searchService.addContents(content, to.path);
    }
  } catch (err) {
    console.log(`No content found for ${to.path}, skipping index`);
  }
});
export default router
