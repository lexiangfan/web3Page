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

        <div class="navbar-center" :class="{ 'hidden-mobile': isMobileMenuCollapsed }">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">查看文档</el-menu-item>
          <el-menu-item index="3">产品文档</el-menu-item>
        </div>

        <div class="navbar-right">
          <GlobalSearch class="navbar-search" />
          <el-menu-item index="4" class="github-item">
            <el-button
                type="primary"
                link
                class="github-button"
                @click="goToImKey"
            >
              imKey
            </el-button>
          </el-menu-item>

          <el-menu-item class="mobile-menu-toggle" @click="toggleMobileMenu">
            <el-icon><expand v-if="isMobileMenuCollapsed" /><fold v-else /></el-icon>
          </el-menu-item>
        </div>
      </div>
    </el-menu>

    <RouterView class="content-area" />
  </div>
</template>

// App.vue
<script setup>
import { ref, onMounted } from 'vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import router from '@/router/router'
import '@/assets/styles/global.css'
import GlobalSearch from '@/components/GlobalSearch.vue'
import searchService from "@/services/searchService.js"
import contentLoader from "@/services/contentLoader.js"


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
      router.push('/page')
      break
    case '3':
      router.push('/about')
      break
  }
  activeIndex.value = key
  if (window.innerWidth <= 768) {
    isMobileMenuCollapsed.value = true
  }
}

const goToImKey = () => {
  window.open('https://imkey.im', '_blank')
}

// 初始化内容
const initializeContent = async () => {
  try {
    // 重置搜索索引以避免重复
    searchService.resetIndex();
    // 加载所有页面内容并初始化搜索索引
    const allPageContents = await contentLoader.loadAllPageContents();
    searchService.initializeAllContents(allPageContents);
    console.log('Successfully initialized all content for search');
  } catch (error) {
    console.error('Failed to initialize content:', error);
  }
}

const toggleMobileMenu = () => {
  isMobileMenuCollapsed.value = !isMobileMenuCollapsed.value
}

onMounted(() => {
  // 延迟初始化以确保路由已准备就绪
  setTimeout(() => {
    initializeContent()
  }, 100)
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

:deep(.navbar .el-menu-item) {
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

:deep(.navbar .el-menu-item:hover) {
  background: var(--color-surface) !important;
  color: var(--color-primary) !important;
}

:deep(.navbar .el-sub-menu__title) {
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

:deep(.navbar .el-sub-menu__title:hover) {
  background: var(--color-surface) !important;
  color: var(--color-primary) !important;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background: var(--color-primary) !important;
  color: white !important;
  font-weight: 600;
}

.navbar-search {
  width: 250px;
  margin: 0 12px;
  min-width: 180px;
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
    padding: 0 5px;
    display: flex;
    align-items: center;
    position: relative;
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
    max-height: calc(100vh - var(--navbar-height));
    overflow-y: auto;
    margin-top: 0 !important;
    border-top: none;
    border-radius: 0 !important;
  }

  .navbar-center:not(.hidden-mobile) {
    display: flex;
  }

  .navbar-center.hidden-mobile {
    display: none;
  }

  .navbar-center:not(.hidden-mobile) {
    display: flex;
  }

  .navbar-search {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 180px;
    margin: 0;
    min-width: 150px;
  }

  .mobile-menu-toggle {
    display: flex !important;
    align-items: center;
    justify-content: center;
    padding: 0 6px !important;
    margin-left: 2px;
    min-width: 45px;
  }

  :deep(.navbar .el-menu-item) {
    padding: 0 4px !important;
    margin: 2px 0;
    width: 100%;
    min-width: 40px;
  }

  .navbar-left {
    margin-right: auto;
    flex-shrink: 0;
    min-width: 60px;
  }

  .logo-text {
    font-size: 18px;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 3px;
    flex-shrink: 0;
    margin-left: auto;
  }

  .github-button {
    font-size: var(--font-size-xs);
    padding: 5px 8px !important;
  }

  .github-item {
    display: none !important;
  }
}

@media (max-width: 576px) {
  .content-area {
    min-height: calc(100vh - var(--navbar-height));
    padding-top: var(--navbar-height);
  }

  .navbar-container {
    padding: 0 2px;
  }

  .navbar-center {
    padding: 8px;
    margin: 0;
    box-shadow: var(--shadow-base);
    top: var(--navbar-height);
  }

  :deep(.navbar-center .el-menu-item) {
    margin: 1px 0;
    width: 100%;
  }

  :deep(.navbar-center .el-sub-menu) {
    width: 100%;
  }

  .navbar-search {
    width: 150px;
    min-width: 120px;
  }

  .navbar-right {
    gap: 1px;
  }

  .logo-text {
    font-size: 18px;
  }

  .mobile-menu-toggle {
    padding: 0 3px !important;
    margin-left: 1px;
  }

  .github-item {
    display: none !important;
  }
}

@media (max-width: 400px) {
  .navbar-search {
    width: 120px;
    min-width: 100px;
  }
}
</style>
