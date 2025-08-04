import {createRouter,createWebHistory} from "vue-router"
import Home from '@/views/Home.vue'
import Page from "@/views/page.vue";

const routes = [
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
  history: createWebHistory(),
  routes
})
export default router