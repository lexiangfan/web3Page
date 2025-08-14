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

// 视频预加载工具函数
function preloadVideos(videoUrls) {
    const promises = videoUrls.map((url) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadeddata = () => resolve(url);
            video.onerror = () => reject(url);
            video.src = url;
        });
    });

    return Promise.allSettled(promises);
}

// 在应用初始化时预加载关键视频
window.addEventListener('load', () => {
    const importantVideos = [
        // 添加关键视频URL
    ];

    preloadVideos(importantVideos).then(results => {
        console.log('视频预加载完成:', results);
    });
});

window.addEventListener('resize', setMobileHeight)
window.addEventListener('load', setMobileHeight)
setMobileHeight()

app.use(ElementPlus)
app.use(router)
app.mount('#app')

// 导出页面模块以供其他组件使用
export { pages }
