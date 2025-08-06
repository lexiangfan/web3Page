import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/router.js'

const app = createApp(App)
// 移动端适配 - 处理地址栏影响
if ('virtualKeyboard' in navigator) {
    // 处理虚拟键盘对视口的影响
    navigator.virtualKeyboard.overlaysContent = true;
}

// 或者使用 CSS 变量动态设置
function setMobileHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setMobileHeight);
window.addEventListener('load', setMobileHeight);
setMobileHeight();
app.use(ElementPlus)
app.use(router)
app.mount('#app')