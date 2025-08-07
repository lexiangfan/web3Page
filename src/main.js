// src/main.js (增强版本)
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router.js'

// 自动扫描并注册views目录下的页面组件
const pages = import.meta.glob('@/views/*.vue')

const app = createApp(App)

// 移动端适配 - 处理地址栏影响
if ('virtualKeyboard' in navigator) {
    // 处理虚拟键盘对视口的影响
    navigator.virtualKeyboard.overlaysContent = true
}

// 或者使用 CSS 变量动态设置
function setMobileHeight() {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('resize', setMobileHeight)
window.addEventListener('load', setMobileHeight)
setMobileHeight()

app.use(ElementPlus)
app.use(router)
app.mount('#app')

// 导出页面模块以供其他组件使用
export { pages }
