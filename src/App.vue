<template>
  <div id="app">
    <el-menu
        :default-active="activeIndex"
        class="navbar"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >
      <div class="navbar-container">
        <div class="navbar-left">
          <el-menu-item index="0" class="logo-item">
            <div class="logo-wrapper">
              <span class="logo-text">WEB3</span>
            </div>
          </el-menu-item>
        </div>

        <!-- 在小屏幕上隐藏的导航项 -->
        <div class="navbar-center" :class="{ 'hidden-mobile': isMobileMenuCollapsed }">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">关于我们</el-menu-item>
          <el-sub-menu index="3">
            <template #title>文档</template>
            <el-menu-item index="3-1">入门指南</el-menu-item>
            <el-menu-item index="3-2">技术文档</el-menu-item>
            <el-menu-item index="3-3">最佳实践</el-menu-item>
          </el-sub-menu>
        </div>

        <div class="navbar-right">
          <GlobalSearch class="navbar-search" />
          <el-menu-item index="4" class="github-item">
            <el-button
                type="primary"
                link
                class="github-button"
                @click="goToGithub"
            >
              <i class="el-icon-link"></i>
              GitHub
            </el-button>
          </el-menu-item>
          <!-- 移动端菜单按钮 -->
          <el-menu-item class="mobile-menu-toggle" @click="toggleMobileMenu">
            <el-icon><Expand v-if="isMobileMenuCollapsed" /><Fold v-else /></el-icon>
          </el-menu-item>
        </div>
      </div>
    </el-menu>
    <RouterView class="content-area" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import router from '@/router/router'
import '@/assets/styles/global.css'
import GlobalSearch from '@/components/GlobalSearch.vue'
import contentManager from '@/services/contentManager.js'
import pageContents from '@/utils/page.js'

const activeIndex = ref('1')
const isMobileMenuCollapsed = ref(true)

const handleSelect = (key) => {
  switch (key) {
    case '0':
      router.push('/')
      break
    case '1':
      router.push('/')
      break
    case '2':
      router.push('/about')
      break
  }
  activeIndex.value = key
  // 在移动端选择后关闭菜单
  if (window.innerWidth <= 768) {
    isMobileMenuCollapsed.value = true
  }
}

const goToGithub = () => {
  window.open('https://github.com', '_blank')
}

// 初始化内容
const initializeContent = () => {
  contentManager.initializeContents(pageContents)
}

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuCollapsed.value = !isMobileMenuCollapsed.value
}

onMounted(() => {
  initializeContent()
})
</script>

<style scoped>
#app {
  background-color: var(--color-background);
  min-height: 100vh;
}

.content-area {
  padding-top: var(--navbar-height);
  min-height: calc(100vh - var(--navbar-height));
  background-color: var(--color-surface);
  width: 100%;
}

.navbar {
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-background);
  display: flex;
  align-items: center;
  height: var(--navbar-height);
  box-shadow: var(--shadow-base);
  border: none;
  backdrop-filter: blur(10px);
}

.navbar-container {
  display: flex;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo-item {
  padding: 0 !important;
  margin-right: 20px !important;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
  letter-spacing: -0.5px;
}

.navbar-center {
  display: flex;
  flex: 1;
  justify-content: center;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-toggle {
  display: none !important;
}

:deep(.el-menu-item) {
  color: var(--color-text-secondary) !important;
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--border-radius);
  margin: 0 2px;
  padding: 0 12px !important;
  height: 40px;
  display: flex;
  align-items: center;
  transition: var(--transition-base);
  border: none !important;
}

:deep(.el-menu-item:hover) {
  background: var(--color-surface) !important;
  color: var(--color-primary) !important;
}

:deep(.el-sub-menu__title) {
  color: var(--color-text-secondary) !important;
  font-size: var(--font-size-base);
  font-weight: 500;
  border-radius: var(--border-radius);
  margin: 0 2px;
  padding: 0 12px !important;
  height: 40px;
  display: flex;
  align-items: center;
  transition: var(--transition-base);
}

:deep(.el-sub-menu__title:hover) {
  background: var(--color-surface) !important;
  color: var(--color-primary) !important;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background: var(--color-primary) !important;
  color: white !important;
  font-weight: 600;
}

.navbar-search {
  width: 200px;
  margin: 0 12px;
}

.github-item {
  padding: 0 !important;
}

.github-button {
  color: var(--color-text-secondary) !important;
  font-weight: 500;
  transition: var(--transition-base);
  font-size: var(--font-size-sm);
}

.github-button:hover {
  color: var(--color-primary) !important;
}

/* 全局搜索样式覆盖 */
:deep(.global-search .el-input__wrapper) {
  background: var(--color-surface) !important;
  border-radius: var(--border-radius-large) !important;
  box-shadow: var(--shadow-base) !important;
  border: 1px solid var(--color-border) !important;
  transition: var(--transition-base);
}

:deep(.global-search .el-input__wrapper:hover) {
  box-shadow: var(--shadow-hover) !important;
  border-color: var(--color-primary) !important;
}

:deep(.global-search .el-input__inner) {
  color: var(--color-text) !important;
  background: transparent !important;
  font-size: var(--font-size-sm);
}

:deep(.global-search ::placeholder) {
  color: var(--color-text-muted) !important;
}

:deep(.global-search .el-input__prefix) {
  color: var(--color-text-muted) !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content-area {
    min-height: calc(100vh - var(--navbar-height));
    height: auto;
    padding-top: var(--navbar-height);
  }

  #app {
    min-height: 100vh;
    height: auto;
  }

  .navbar-container {
    padding: 0 12px;
  }

  .navbar-center {
    position: absolute;
    top: var(--navbar-height);
    left: 0;
    right: 0;
    background: var(--color-background);
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
    box-shadow: var(--shadow-base);
    z-index: 1000;
    transition: var(--transition-base);
    width: 100%;
  }

  .navbar-center.hidden-mobile {
    display: none;
  }

  .navbar-center:not(.hidden-mobile) {
    display: flex;
  }

  .navbar-search {
    width: 140px;
    margin: 0 6px;
  }

  .mobile-menu-toggle {
    display: flex !important;
    align-items: center;
    justify-content: center;
    padding: 0 8px !important;
  }

  :deep(.el-menu-item) {
    padding: 0 8px !important;
    margin: 2px 0;
    width: 100%;
  }

  /* 在移动端实现 logo 左对齐，其他元素右对齐的效果 */
  .navbar-left {
    margin-right: auto;
  }

  .logo-text {
    font-size: 18px;
  }

  .github-button {
    font-size: var(--font-size-xs);
    padding: 6px 10px !important;
  }
}

@media (max-width: 576px) {
  .content-area {
    min-height: calc(100vh - var(--navbar-height));
    padding-top: var(--navbar-height);
  }

  .navbar-search {
    display: none;
  }

  .navbar-right {
    gap: 6px;
  }

  .logo-text {
    font-size: 16px;
  }

  .github-button {
    display: none;
  }
}
</style>
