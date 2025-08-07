<!-- src/components/PageNavigationDrawer.vue -->
<template>
  <div class="page-navigation">
    <!-- 页面导航按钮 -->
    <el-button
        class="nav-toggle-button"
        @click="openDrawer"
    >
      <el-icon><Menu /></el-icon>
      <span>页面导航</span>
    </el-button>

    <!-- 桌面端页面导航抽屉 -->
    <el-drawer
        v-if="!isMobile"
        v-model="drawerVisible"
        title="页面导航"
        direction="ltr"
        size="300px"
        class="page-navigation-drawer"
    >
      <div class="page-nav-content">
        <!-- 页面列表 -->
        <div class="pages-section">
          <h3 class="section-title">页面列表</h3>
          <el-menu
              :default-active="activePage"
              @select="handlePageSelect"
              class="page-menu"
          >
            <el-menu-item
                v-for="page in pages"
                :key="page.path"
                :index="page.path"
            >
              <el-icon><Document /></el-icon>
              <span>{{ page.meta.title }}</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 当前页面锚点导航 -->
        <div v-if="currentContent.length > 0" class="anchors-section">
          <h3 class="section-title">页面内容</h3>
          <el-scrollbar class="anchor-scrollbar">
            <el-tree
                :data="anchorTreeData"
                :props="treeProps"
                node-key="id"
                @node-click="handleAnchorClick"
                class="anchor-tree"
            />
          </el-scrollbar>
        </div>
      </div>
    </el-drawer>

    <!-- 移动端页面导航抽屉 (从底部弹出) -->
    <el-drawer
        v-else
        v-model="drawerVisible"
        title="页面导航"
        direction="btt"
        size="70%"
        class="mobile-page-navigation-drawer"
    >
      <div class="page-nav-content">
        <!-- 页面列表 -->
        <div class="pages-section">
          <h3 class="section-title">页面列表</h3>
          <el-menu
              :default-active="activePage"
              @select="handlePageSelect"
              class="page-menu"
          >
            <el-menu-item
                v-for="page in pages"
                :key="page.path"
                :index="page.path"
            >
              <el-icon><Document /></el-icon>
              <span>{{ page.meta.title }}</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 当前页面锚点导航 -->
        <div v-if="currentContent.length > 0" class="anchors-section">
          <h3 class="section-title">页面内容</h3>
          <el-tree
              :data="anchorTreeData"
              :props="treeProps"
              node-key="id"
              @node-click="handleAnchorClick"
              class="anchor-tree mobile-anchor-tree"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, Document } from '@element-plus/icons-vue'
import pageService from '@/services/pageService.js'

const router = useRouter()
const route = useRoute()
const drawerVisible = ref(false)
const pages = ref([])
const currentContent = ref([])
const isMobile = ref(false)

// 树形控件属性
const treeProps = {
  label: 'label',
  children: 'children'
}

// 当前激活的页面
const activePage = computed(() => route.path)

// 锚点树形数据
const anchorTreeData = computed(() => {
  return currentContent.value.map(chapter => ({
    id: chapter.id,
    label: chapter.title,
    children: chapter.children ? chapter.children.map(section => ({
      id: section.id,
      label: section.title
    })) : []
  }))
})

// 检查是否为移动设备
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 监听窗口大小变化
const handleResize = () => {
  checkIsMobile()
}

// 打开抽屉
const openDrawer = () => {
  drawerVisible.value = true
}

// 处理页面选择
const handlePageSelect = async (path) => {
  drawerVisible.value = false
  router.push(path)
  // 更新当前页面内容
  await updateCurrentContent(path)
}

// 处理锚点点击
const handleAnchorClick = (data) => {
  // 滚动到对应锚点
  const element = document.getElementById(data.id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    drawerVisible.value = false
  }
}

// 更新当前页面内容
const updateCurrentContent = async (path) => {
  try {
    // 根据路径动态导入对应的内容文件
    let contentModule;

    switch(path) {
      case '/Page':
        contentModule = await import('@/utils/page.js')
        currentContent.value = contentModule.default || contentModule.pageContents
        break
      case '/newPage':
        contentModule = await import('@/utils/newPageContent.js')
        currentContent.value = contentModule.default || contentModule.newPageContents
        break
      default:
        // 尝试通用模式导入
        const pageName = path.substring(1) // 移除开头的 '/'
        try {
          contentModule = await import(`@/utils/${pageName}Content.js`)
          currentContent.value = contentModule.default
        } catch (e) {
          // 如果特定内容文件不存在，尝试默认命名
          try {
            contentModule = await import(`@/utils/${pageName}.js`)
            currentContent.value = contentModule.default
          } catch (e2) {
            currentContent.value = []
          }
        }
    }
  } catch (error) {
    console.error('Failed to load content for path:', path, error)
    currentContent.value = []
  }
}

// 初始化页面列表
const initPages = () => {
  pages.value = pageService.getPages()
}

// 监听路由变化
watch(() => route.path, async (newPath) => {
  await updateCurrentContent(newPath)
})

onMounted(async () => {
  checkIsMobile()
  window.addEventListener('resize', handleResize)
  initPages()
  await updateCurrentContent(route.path)

  // 订阅页面服务变化
  pageService.subscribe((updatedPages) => {
    pages.value = updatedPages
  })
})

// 暴露方法给父组件
defineExpose({
  openDrawer
})
</script>

<style scoped>
.nav-toggle-button {
  margin-bottom: 20px;
  width: 100%;
}

.page-nav-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pages-section,
.anchors-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-secondary);
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.page-menu {
  border: none;
}

:deep(.page-menu .el-menu-item) {
  border-radius: var(--border-radius-small);
  margin-bottom: 4px;
}

:deep(.page-menu .el-menu-item:hover) {
  background-color: var(--color-surface);
}

:deep(.page-menu .el-menu-item.is-active) {
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--color-primary);
}

.anchor-scrollbar {
  height: calc(100vh - 300px);
}

.anchor-tree {
  background: transparent;
  min-height: 100px;
}

:deep(.anchor-tree .el-tree-node) {
  margin-bottom: 6px;
}

:deep(.anchor-tree .el-tree-node__content) {
  border-radius: var(--border-radius-small);
  padding: 8px 12px;
  font-size: var(--font-size-sm);
}

:deep(.anchor-tree .el-tree-node__content:hover) {
  background-color: var(--color-surface);
  color: var(--color-primary);
}

/* 桌面端抽屉样式优化 */
:deep(.page-navigation-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.page-navigation-drawer .el-drawer__body) {
  padding: 16px 24px;
}

/* 移动端抽屉样式 */
:deep(.mobile-page-navigation-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.mobile-page-navigation-drawer .el-drawer__body) {
  padding: 16px 24px;
}

.mobile-anchor-tree {
  width: 100%;
  background: transparent;
}

:deep(.mobile-anchor-tree .el-tree-node) {
  margin-bottom: 8px;
}

:deep(.mobile-anchor-tree .el-tree-node__content) {
  border-radius: var(--border-radius-small);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px 16px;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  position: relative;
}

:deep(.mobile-anchor-tree .el-tree-node__content:hover) {
  background-color: var(--color-surface);
  color: var(--color-primary);
}

:deep(.mobile-anchor-tree .el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--color-primary);
  font-weight: 600;
  border-left: 3px solid var(--color-primary);
}

:deep(.mobile-anchor-tree .el-tree-node.is-current > .el-tree-node__content:hover) {
  background-color: rgba(37, 99, 235, 0.15);
}

/* 桌面端适配 */
@media (max-width: 768px) {
  :deep(.page-navigation-drawer .el-drawer__body) {
    padding: 12px 16px;
  }

  .anchor-scrollbar {
    height: calc(100vh - 250px);
  }
}
</style>
