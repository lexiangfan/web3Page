//这边需要添加page页面路由
import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import page from "@/views/page.vue";
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
    const pageName = to.path === '/' ? 'page' : to.path.substring(1);

    const contentModules = {
      'page': () => import('@/utils/page.js'),
      'page1': () => import('@/utils/page1.js'),
      'page2': () => import('@/utils/page2.js'),
    };

    // 检查是否有对应的导入函数
    if (contentModules[pageName]) {
      const contentModule = await contentModules[pageName]();
      let content = contentModule.default;

      // 如果默认导出不存在，尝试其他常见的导出名称
      if (!content) {
        content = contentModule[`${pageName}Contents`] ||
            contentModule[`${pageName}Content`] ||
            contentModule.pageContents ||
            contentModule.content;
      }

      // 如果成功获取到内容，添加到搜索索引
      if (content && Array.isArray(content)) {
        searchService.addContents(content, to.path);
      } else if (content) {
        // 如果是对象而不是数组，也添加到索引
        searchService.addContent({...content, id: content.id || pageName}, to.path);
      }
    }
  } catch (err) {
    console.log(`No content found for ${to.path}, skipping index`, err);
  }
});
export default router
