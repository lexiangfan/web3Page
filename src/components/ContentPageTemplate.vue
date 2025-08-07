<!-- src/components/ContentPageTemplate.vue -->
<!-- src/components/ContentPageTemplate.vue -->
<template>
  <div class="common-layout">
    <el-container class="page-container">
      <el-container>
        <!-- 侧边栏 (移动端隐藏) -->
        <el-aside
            width="240px"
            class="anchor-aside"
            v-show="!isMobile"
        >
          <div
              class="anchor-wrapper"
              :class="{ 'fixed-anchor': isAnchorFixed }"
              :style="fixedAnchorStyle"
          >
            <div class="anchor-header">
              <h2>目录</h2>
            </div>
            <el-scrollbar class="anchor-scrollbar">
              <el-tree
                  :data="treeData"
                  :props="treeProps"
                  :default-expand-all="true"
                  node-key="id"
                  ref="treeRef"
                  @node-click="handleNodeClick"
                  class="anchor-tree"
                  :current-node-key="currentNodeKey"
              />
            </el-scrollbar>
          </div>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="content-main">
          <!-- 移动端页面导航和目录按钮 -->
          <div
              v-if="isMobile"
              class="mobile-buttons"
          >
            <div class="mobile-nav-button" @click="openPageNavigation">
              页面导航
            </div>
            <div class="mobile-toc-button" @click="showMobileToc = true">
              目录
            </div>
          </div>

          <div ref="containerRef" class="scroll-container" @scroll="handleContentScroll">
            <div
                v-for="chapter in pageContent"
                :key="chapter.id"
                :id="chapter.id"
                class="content-part"
            >
              <h2>{{ chapter.title }}</h2>
              <div
                  v-for="section in chapter.children"
                  :key="section.id"
                  :id="section.id"
                  class="section"
              >
                <h3>{{ section.title }}</h3>
                <div v-html="section.content"></div>
              </div>
            </div>

            <!-- 页面导航组件 -->
            <div class="page-navigation">
              <el-row justify="space-between" align="middle">
                <el-col :span="11">
                  <el-button
                      v-if="prevPage"
                      class="nav-button prev-button"
                      @click="goToPage(prevPage.path)"
                      round
                  >
                    <el-icon><ArrowLeft /></el-icon>
                    <span class="button-text">{{ prevPage.title }}</span>
                  </el-button>
                </el-col>
                <el-col :span="2"></el-col> <!-- 间隔 -->
                <el-col :span="11">
                  <el-button
                      v-if="nextPage"
                      class="nav-button next-button"
                      @click="goToPage(nextPage.path)"
                      round
                  >
                    <span class="button-text">{{ nextPage.title }}</span>
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </el-col>
              </el-row>
            </div>

            <!-- 页脚 -->
            <div class="page-footer">
              <p>© 2025 Web3 入门指南. All rights reserved.</p>
            </div>
          </div>
        </el-main>
      </el-container>

      <!-- 移动端目录抽屉 -->
      <el-drawer
          v-model="showMobileToc"
          title="目录"
          direction="btt"
          size="70%"
          class="mobile-toc-drawer"
      >
        <el-tree
            :data="treeData"
            :props="treeProps"
            node-key="id"
            ref="mobileTreeRef"
            @node-click="handleMobileNodeClick"
            class="mobile-anchor-tree"
            :current-node-key="currentNodeKey"
        />
      </el-drawer>

      <!-- 移动端页面导航抽屉 -->
      <el-drawer
          v-model="showMobilePageNav"
          title="页面导航"
          direction="btt"
          size="70%"
          class="mobile-page-nav-drawer"
      >
        <PageNavigationDrawer ref="mobilePageNavDrawer" />
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import {Collection, Menu} from '@element-plus/icons-vue'
import PageNavigationDrawer from "@/components/PageNavigationDrawer.vue"
import pageService from '@/services/pageService.js'

export default {
  name: 'ContentPageTemplate',
  components: {
    PageNavigationDrawer,
    Menu,
    Collection,
    ArrowLeft,
    ArrowRight
  },
  props: {
    // 页面内容数据
    contentData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const containerRef = ref(null)
    const treeRef = ref(null)
    const mobileTreeRef = ref(null)
    const pageNavDrawer = ref(null) // 引用PageNavigationDrawer组件
    const mobilePageNavDrawer = ref(null) // 移动端页面导航抽屉引用
    const pageContent = ref(props.contentData)
    const isMobile = ref(false)
    const showMobileToc = ref(false)
    const showMobilePageNav = ref(false) // 控制移动端页面导航抽屉显示
    const isAnchorFixed = ref(false)
    const isHeaderFixed = ref(false)
    const anchorTop = ref(0)
    const anchorWidth = ref(0)
    const anchorOffset = ref(0)
    const headerHeight = ref(0)
    const currentNodeKey = ref('')
    const scrollTimeout = ref(null)
    const router = useRouter()
    const route = useRoute()

    // 添加响应式数据
    const isMobileButtonsFixed = ref(false)

    // 获取页面列表
    const pages = computed(() => pageService.getPages())

    // 计算当前页面索引
    const currentPageIndex = computed(() => {
      return pages.value.findIndex(page => page.path === route.path)
    })

    // 上一页
    const prevPage = computed(() => {
      if (currentPageIndex.value > 0) {
        return pages.value[currentPageIndex.value - 1]
      }
      return null
    })

    // 下一页
    const nextPage = computed(() => {
      if (currentPageIndex.value < pages.value.length - 1) {
        return pages.value[currentPageIndex.value + 1]
      }
      return null
    })

    // 跳转到指定页面
    const goToPage = (path) => {
      router.push(path)
    }

    // 构建树形数据结构
    const treeData = ref(props.contentData.map(chapter => ({
      id: chapter.id,
      label: chapter.title,
      children: chapter.children ? chapter.children.map(section => ({
        id: section.id,
        label: section.title
      })) : []
    })))

    // 使用符合 Element Plus 类型要求的 props 定义
    const treeProps = {
      label: 'label',
      children: 'children'
    }
    // 固定侧边栏的样式
    const fixedAnchorStyle = computed(() => {
      if (isAnchorFixed.value) {
        return {
          width: anchorWidth.value + 'px',
          top: anchorOffset.value + 'px'
        }
      }
      return {}
    })

    // 固定目录标题的样式
    const fixedHeaderStyle = computed(() => {
      if (isHeaderFixed.value) {
        return {
          width: anchorWidth.value + 'px',
          top: anchorOffset.value + 'px'
        }
      }
      return {}
    })

    // 检查是否为移动设备
    const checkIsMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    // 滚动到指定元素
    const scrollToElement = (id) => {
      const targetElement = document.getElementById(id)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
        // 更新当前节点
        currentNodeKey.value = id
      }
    }

    const handleNodeClick = (data) => {
      // 滚动到对应的锚点
      scrollToElement(data.id)
    }

    const handleMobileNodeClick = (data) => {
      showMobileToc.value = false
      // 延迟执行滚动，确保抽屉关闭后再滚动
      setTimeout(() => {
        scrollToElement(data.id)
      }, 300)
    }

    // 打开页面导航抽屉
    const openPageNavigation = () => {
      if (isMobile.value) {
        // 在移动端，打开底部抽屉
        showMobilePageNav.value = true
        // 确保抽屉内的组件也打开
        setTimeout(() => {
          if (mobilePageNavDrawer.value) {
            mobilePageNavDrawer.value.openDrawer()
          }
        }, 100)
      } else {
        // 在桌面端，直接调用PageNavigationDrawer组件的openDrawer方法
        if (pageNavDrawer.value) {
          pageNavDrawer.value.openDrawer()
        }
      }
    }

    // 监听窗口大小变化
    const handleResize = () => {
      checkIsMobile()
      updateAnchorPosition()
    }

    // 更新锚点位置信息
    const updateAnchorPosition = () => {
      if (isMobile.value) return

      const anchorWrapper = document.querySelector('.anchor-wrapper')
      const anchorHeader = document.querySelector('.anchor-header')

      if (anchorWrapper && anchorHeader) {
        const rect = anchorWrapper.getBoundingClientRect()
        const headerRect = anchorHeader.getBoundingClientRect()

        anchorTop.value = rect.top + window.scrollY
        anchorWidth.value = rect.width
        headerHeight.value = headerRect.height

        // 获取导航栏高度作为偏移量
        anchorOffset.value = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--navbar-height'), 10) || 60
      }
    }

    // 处理滚动事件，控制侧边栏固定和目录标题固定
    const handleScroll = () => {
      if (isMobile.value) return

      const anchorWrapper = document.querySelector('.anchor-wrapper')
      const anchorHeader = document.querySelector('.anchor-header')

      if (!anchorWrapper || !anchorHeader) return

      // 获取导航栏高度
      const navbarHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height'), 10) || 60

      // 当页面滚动超过侧边栏原始位置时，固定侧边栏
      isAnchorFixed.value = window.scrollY >= anchorTop.value - navbarHeight

      // 当页面滚动超过目录标题位置时，固定目录标题
      const headerTop = anchorTop.value + 24 // 24px是anchor-wrapper的padding-top
      isHeaderFixed.value = window.scrollY >= headerTop - navbarHeight
    }

    // 处理内容区域滚动事件
    const handleContentScroll = () => {
      // 检查是否需要固定移动端按钮
      if (isMobile.value && containerRef.value) {
        const scrollTop = containerRef.value.scrollTop
        // 当滚动超过一定距离时固定按钮
        isMobileButtonsFixed.value = scrollTop > 10
      }

      // 防抖处理，避免频繁计算
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
      }

      scrollTimeout.value = setTimeout(() => {
        detectCurrentSection()
      }, 100)
    }

    // 检测当前可视区域的章节
    const detectCurrentSection = () => {
      const scrollContainer = containerRef.value
      if (!scrollContainer) return

      const scrollTop = scrollContainer.scrollTop
      const scrollHeight = scrollContainer.clientHeight

      // 收集所有章节元素
      const sections = []
      pageContent.value.forEach(chapter => {
        sections.push(chapter.id)
        if (chapter.children) {
          chapter.children.forEach(section => {
            sections.push(section.id)
          })
        }
      })

      // 查找当前可视区域的章节
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i]
        const element = document.getElementById(sectionId)

        if (element) {
          const offsetTop = element.offsetTop
          // 如果元素顶部在可视区域内，或者元素高度很大占据了可视区域，则认为是当前章节
          if (offsetTop <= scrollTop + scrollHeight * 0.3) {
            currentNodeKey.value = sectionId
            // 更新树节点的选中状态
            nextTick(() => {
              if (treeRef.value) {
                treeRef.value.setCurrentKey(sectionId)
              }
              if (mobileTreeRef.value) {
                mobileTreeRef.value.setCurrentKey(sectionId)
              }
            })
            break
          }
        }
      }
    }

    onMounted(() => {
      checkIsMobile()
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll)

      // 等待DOM渲染完成后获取位置信息
      setTimeout(() => {
        updateAnchorPosition()
        // 初始化检测当前章节
        detectCurrentSection()
      }, 100)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
      }
    })

    return {
      containerRef,
      treeRef,
      mobileTreeRef,
      pageNavDrawer,
      mobilePageNavDrawer,
      pageContent,
      treeData,
      treeProps,
      isMobile,
      showMobileToc,
      showMobilePageNav,
      isAnchorFixed,
      isHeaderFixed,
      fixedAnchorStyle,
      fixedHeaderStyle,
      handleNodeClick,
      handleMobileNodeClick,
      openPageNavigation,
      currentNodeKey,
      handleContentScroll,
      handleResize,
      handleScroll,
      prevPage,
      nextPage,
      goToPage,
      isMobileButtonsFixed
    }
  }
}
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.page-container {
  height: 100%;
}

.anchor-aside {
  background-color: var(--color-background);
  border-right: 1px solid var(--color-border);
  height: 100vh;
  position: relative;
}

.anchor-wrapper {
  height: 100%;
  padding: 24px 0;
  box-sizing: border-box;
  position: sticky;
  top: 0;
}

.anchor-wrapper.fixed-anchor {
  position: fixed;
  height: 100vh;
  z-index: 99;
  padding: 24px 0;
  box-sizing: border-box;
  background-color: var(--color-background);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.anchor-header {
  padding: 0 24px 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
  background-color: var(--color-background);
  z-index: 10;
}

.anchor-header.fixed-header {
  position: fixed;
  padding: 0 24px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.anchor-header h2 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-secondary);
}

.anchor-scrollbar {
  height: calc(100% - 60px);
}

.anchor-tree {
  width: 100%;
  border: none;
  padding: 0 16px;
  box-sizing: border-box;
  background: transparent;
}

:deep(.anchor-tree .el-tree-node) {
  margin-bottom: 4px;
}

:deep(.anchor-tree .el-tree-node__content) {
  border-radius: var(--border-radius-small);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px 16px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  position: relative;
  overflow: hidden;
}

:deep(.anchor-tree .el-tree-node__content:hover) {
  background-color: var(--color-surface);
  color: var(--color-primary);
  transform: translateX(2px);
}

:deep(.anchor-tree .el-tree-node.is-current > .el-tree-node__content) {
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--color-primary);
  font-weight: 600;
  border-left: 3px solid var(--color-primary);
}

:deep(.anchor-tree .el-tree-node.is-current > .el-tree-node__content:hover) {
  background-color: rgba(37, 99, 235, 0.15);
}

.content-main {
  padding: 0;
  background-color: #ffffff;
}

.mobile-buttons {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.mobile-nav-button,
.mobile-toc-button {
  cursor: pointer;
  padding: 8px 16px;
}

.mobile-nav-button:hover,
.mobile-toc-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.scroll-container {
  height: calc(100vh - 70px); /* 减去 footer 高度 */
  overflow-y: auto;
  padding: 30px 40px;
  box-sizing: border-box;
  background-color: #ffffff;

  /* 隐藏滚动条 - Webkit浏览器 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* 隐藏Webkit浏览器滚动条 */
.scroll-container::-webkit-scrollbar {
  display: none;
}

.content-part {
  padding: 0 0 40px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--color-border);
}

.content-part:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.content-part h2 {
  color: var(--color-secondary);
  margin-top: 0;
  margin-bottom: 24px;
  font-size: var(--font-size-xxl);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

/* 章节标题样式 */
.section {
  padding: 20px 0;
}

.section h3 {
  color: var(--color-secondary);
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: var(--font-size-xl);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.section h4 {
  color: var(--color-secondary);
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: var(--font-size-lg);
  font-weight: 600;
  line-height: 1.5;
}

/* 段落样式 */
.section p {
  font-size: var(--font-size-base);
  line-height: 1.75;
  color: var(--color-text);
  margin-bottom: 16px;
  letter-spacing: 0.01em;
}

/* 列表样式 */
.section ul,
.section ol {
  margin-bottom: 24px;
  padding-left: 24px;
}

.section ul li,
.section ol li {
  margin-bottom: 8px;
  line-height: 1.75;
  color: var(--color-text);
  letter-spacing: 0.01em;
}

/* 代码块样式 */
.section code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  background-color: var(--color-surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: var(--font-size-sm);
  color: var(--color-accent);
}

/* 引用块样式 */
.section blockquote {
  border-left: 4px solid var(--color-primary);
  padding: 8px 20px;
  margin: 20px 0;
  background-color: var(--color-surface);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

.section blockquote p {
  margin: 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* 链接样式 */
.section a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dotted var(--color-primary);
  transition: var(--transition-base);
}

.section a:hover {
  color: var(--color-accent);
  border-bottom-style: solid;
}

/* 表格样式 */
.section table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: var(--font-size-base);
}

.section table th,
.section table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.section table th {
  background-color: var(--color-surface);
  font-weight: 600;
  color: var(--color-secondary);
}

.section table tr:hover {
  background-color: var(--color-surface);
}

.page-footer {
  background-color: var(--color-background);
  color: var(--color-text-muted);
  text-align: center;
  padding: 20px;
  border-top: 1px solid var(--color-border);
  /* 移除固定定位相关样式 */
  position: relative;
  bottom: auto;
  left: auto;
  right: auto;
  width: auto;
  height: auto; /* 改为 auto，让高度根据内容自适应 */
  box-shadow: none;
  z-index: auto;
  margin-top: 20px;
}

.page-footer p {
  margin: 0;
  font-size: var(--font-size-sm);
}


/* 移动端目录抽屉 */
:deep(.mobile-toc-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.mobile-toc-drawer .el-drawer__body) {
  padding: 16px 24px;
}

/* 移动端页面导航抽屉 */
:deep(.mobile-page-nav-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.mobile-page-nav-drawer .el-drawer__body) {
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

.page-navigation {
  padding: 40px 20px 20px;
  border-top: 1px solid var(--color-border);
  margin-top: 20px;
  position: relative; /* 移除 fixed 定位 */
  bottom: auto; /* 重置底部定位 */
  left: auto;
  right: auto;
  background-color: transparent; /* 移除背景色 */
  box-shadow: none; /* 移除阴影 */
  z-index: auto; /* 重置层级 */
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-weight: 500;
  transition: var(--transition-base);
}

.nav-button:hover {
  background-color: var(--color-background);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}

.nav-button:active {
  transform: translateY(0);
}

.prev-button {
  justify-content: flex-start;
}

.next-button {
  justify-content: flex-end;
}

.button-text {
  flex: 1;
  text-align: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .anchor-aside {
    display: none;
  }

  .mobile-buttons {
    padding: 10px 15px;
  }

  .mobile-nav-button,
  .mobile-toc-button {
    padding: 8px 16px;
    font-size: var(--font-size-sm);
  }

  .scroll-container {
    height: calc(100vh - 70px);
    padding: 20px 15px;
  }

  .content-part {
    padding: 0 0 30px;
    margin-bottom: 30px;
  }

  .content-part h2 {
    font-size: var(--font-size-xl);
    margin-bottom: 20px;
  }

  .section h3 {
    font-size: var(--font-size-lg);
    margin-top: 28px;
    margin-bottom: 14px;
  }

  .section h4 {
    font-size: var(--font-size-base);
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .section p {
    font-size: var(--font-size-base);
    margin-bottom: 14px;
    line-height: 1.7;
  }

  .section ul,
  .section ol {
    margin-bottom: 20px;
    padding-left: 20px;
  }

  .section li {
    margin-bottom: 6px;
  }

  .page-navigation {
    padding: 20px 10px;
  }

  .nav-button {
    padding: 12px 16px;
    font-size: var(--font-size-sm);
  }

  .button-text {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 576px) {
  .scroll-container {
    padding: 15px 10px;
  }

  .content-part {
    padding: 0 0 25px;
    margin-bottom: 25px;
  }

  .content-part h2 {
    font-size: var(--font-size-lg);
    margin-bottom: 16px;
  }

  .section h3 {
    font-size: var(--font-size-base);
    margin-top: 24px;
    margin-bottom: 12px;
  }

  .section h4 {
    font-size: var(--font-size-sm);
    margin-top: 20px;
    margin-bottom: 8px;
  }

  .section p {
    font-size: var(--font-size-sm);
    margin-bottom: 12px;
  }

  .section ul,
  .section ol {
    margin-bottom: 16px;
    padding-left: 16px;
  }

  .section li {
    margin-bottom: 5px;
    font-size: var(--font-size-sm);
  }

  .mobile-buttons {
    padding: 8px 10px;
  }

  .mobile-nav-button,
  .mobile-toc-button {
    padding: 6px 12px;
    font-size: var(--font-size-sm);
  }

  .page-navigation {
    padding: 15px 5px;
  }
}
</style>
