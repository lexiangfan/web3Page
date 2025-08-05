import {createRouter, createWebHashHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";
import About from "@/views/About.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path:'/Page',
    name:'Page',
    component: Page
  },
  {
    path:'/about',
    name:'About',
    component: About
  }

]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router