import {createRouter, createWebHashHistory, createWebHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";

const routes = [
  {
    path: '/',
    redirect: 'Home' // 👈 默认跳转到首页
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/Page',
    name:'Page',
    component: Page
  }

]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router