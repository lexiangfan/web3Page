//这边需要添加page页面路由
import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";
import page1 from "@/views/page1.vue";
import page2 from "@/views/page2.vue";
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
