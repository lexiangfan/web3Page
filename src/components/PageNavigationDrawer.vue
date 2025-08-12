<template>
  <div class="page-navigation">
    <!-- 页面导航按钮 (仅在桌面端显示，且作为独立组件使用时) -->
    <el-button
        v-if="!isMobileView && showToggleButton"
        class="nav-toggle-button"
        @click="openDrawer"
    >
      <el-icon><Menu /></el-icon>
      <span>页面导航</span>
    </el-button>

    <!-- 桌面端页面导航抽屉 (仅在作为独立组件使用时显示) -->
    <el-drawer
        v-if="!isMobileView && showToggleButton"
        v-model="drawerVisible"
        title="页面导航"
        direction="ltr"
        size="300px"
        class="page-navigation-drawer"
        @closed="handleDrawerClosed"
    >
      <div class="page-nav-content">
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

    <!-- 移动端直接显示内容，不使用抽屉 -->
    <div v-else-if="isMobileView" class="mobile-page-navigation-content">
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

    <!-- 桌面端嵌入模式 (在ContentPageTemplate中使用) -->
    <div v-else class="desktop-embedded-content">
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
  </div>
</template>

// components/PageNavigationDrawer.vue
<script setup>
import {computed, nextTick, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Document, Menu} from '@element-plus/icons-vue'
import pageService from '@/services/pageService.js'
import searchService from "@/services/searchService.js";
import contentLoader from "@/services/contentLoader.js";


const props = defineProps({
  showToggleButton: {
    type: Boolean,
    default: true
  }
});

const router = useRouter()
const route = useRoute()
const drawerVisible = ref(false)
const pages = ref([])
const currentContent = ref([])
const isMobileView = ref(false)

// 支持多层嵌套的树形结构
const buildTreeData = (contents) => {
  return contents.map(item => {
    const treeNode = {
      id: item.id,
      label: item.title
    };

    // 如果有子节点，递归构建子树
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      treeNode.children = buildTreeData(item.children);
    }

    return treeNode;
  });
};

const treeProps = {
  label: 'label',
  children: 'children',
}

const {path: path1} = route;
const activePage = computed(() => path1)

const anchorTreeData = computed(() => {
  return buildTreeData(currentContent.value);
})


// 检查是否为移动设备
const checkIsMobile = () => {
  isMobileView.value = window.innerWidth <= 768
}

// 监听窗口大小变化
const handleResize = () => {
  checkIsMobile()
}

// 处理抽屉关闭事件
const handleDrawerClosed = () => {
  drawerVisible.value = false
}

// 打开抽屉
const openDrawer = () => {
  checkIsMobile()

  nextTick(() => {
    drawerVisible.value = true
  })
}

// 处理页面选择
const handlePageSelect = async (path) => {
  drawerVisible.value = false
  await router.push(path)
  await updateCurrentContent(path)
}

// 处理锚点点击
const handleAnchorClick = (data) => {
  // 滚动到对应锚点
  const element = document.getElementById(data.id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    if (!isMobileView.value) {
      drawerVisible.value = false
    }
  }
}

// 更新当前页面内容
const updateCurrentContent = async (path) => {
  try {
    // 使用内容加载服务加载页面内容
    const result = await contentLoader.loadPageContent(path);

    if (result && result.content) {
      currentContent.value = Array.isArray(result.content) ? result.content : [result.content];
    } else {
      currentContent.value = [];
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
watch(() => path1, async (newPath) => {
  await updateCurrentContent(newPath)
})

onMounted(async () => {
  checkIsMobile()
  window.addEventListener('resize', handleResize)
  initPages()
  await updateCurrentContent(path1)

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

.desktop-embedded-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-page-navigation-content {
  padding: 16px 0;
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

:deep(.page-menu) .el-menu-item.is-active {
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

:deep(.page-navigation-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.page-navigation-drawer .el-drawer__body) {
  padding: 16px 24px;
}

.mobile-anchor-tree {
  width: 100%;
  background: transparent;
  margin-top: 12px;
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

@media (max-width: 768px) {
  :deep(.page-navigation-drawer .el-drawer__body) {
    padding: 12px 16px;
  }

  .anchor-scrollbar {
    height: calc(100vh - 250px);
  }
}
</style>
