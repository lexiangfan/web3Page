<!-- src/App.vue -->
<template>
  <div id="app">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo navbar"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
    >
      <el-menu-item index="0">
        WEB3
      </el-menu-item>

      <!-- 使用优化后的全局搜索组件 -->
      <GlobalSearch />

      <el-menu-item index="1">
        关于我们
      </el-menu-item>
      <el-sub-menu index="2">
        <template #title>Workspace</template>
        <el-menu-item index="2-1">item one</el-menu-item>
        <el-menu-item index="2-2">item two</el-menu-item>
        <el-menu-item index="2-3">item three</el-menu-item>
        <el-sub-menu index="2-4">
          <template #title>item four</template>
          <el-menu-item index="2-4-1">item one</el-menu-item>
          <el-menu-item index="2-4-2">item two</el-menu-item>
          <el-menu-item index="2-4-3">item three</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>

    <RouterView class="content-area" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import router from '@/router/router'
import '@/assets/styles/global.css'
import GlobalSearch from '@/components/GlobalSearch.vue' // 修复导入路径
import contentManager from '@/services/contentManager.js'
import pageContents from '@/utils/page.js'

export default {
  name: 'App',
  components: {
    GlobalSearch
  },
  setup() {
    const activeIndex = ref('1')

    const handleSelect = (key) => {
      switch (key) {
        case '0':
          router.push('/')
          break
        case '1':
          router.push('/about')
          break
      }
    }

    // 初始化内容
    const initializeContent = () => {
      contentManager.initializeContents(pageContents)
    }

    onMounted(() => {
      initializeContent()
    })

    return {
      activeIndex,
      handleSelect
    }
  }
}
</script>

<style scoped>
#app {
  background-color: #ffffff; /* 全局背景为白色 */
  min-height: 100vh;
}

.content-area {
  padding-top: var(--navbar-height);
  background-color: #ffffff;
}

.navbar {
  margin: 0;
  padding: 0 10px;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #ffffff 0%, #4facfe 100%) !important;
  display: flex;
  align-items: center;
}

:deep(.el-menu-item) {
  color: var(--color-text) !important;
  font-size: var(--font-size-base);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  margin: 5px 0;
}

:deep(.el-sub-menu__title) {
  color: var(--color-text) !important;
  font-size: var(--font-size-base);
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  margin: 5px 0;
}

:deep(.el-menu-item:hover) {
  background: var(--color-hover) !important;
}

:deep(.el-sub-menu__title:hover) {
  background: var(--color-hover) !important;
}

:deep(.el-menu--horizontal > .el-menu-item.is-active) {
  background: var(--color-active) !important;
  border-bottom: none !important;
  color: var(--color-accent) !important;
}

.navbar > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
