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
          <!-- 移动端目录按钮 -->
          <div v-if="isMobile" class="mobile-toc-button" @click="showMobileToc = true">
            <el-icon><Menu /></el-icon>
            <span>目录</span>
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
          </div>
        </el-main>
      </el-container>

      <!-- 底部信息 -->
      <el-footer class="page-footer">
        <p>© 2023 Web3 入门指南. All rights reserved.</p>
      </el-footer>
    </el-container>

    <!-- 移动端目录抽窗 -->
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
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { Menu } from '@element-plus/icons-vue'

export default {
  name: 'ContentPageTemplate',
  components: {
    Menu
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
    const pageContent = ref(props.contentData)
    const isMobile = ref(false)
    const showMobileToc = ref(false)
    const isAnchorFixed = ref(false)
    const anchorTop = ref(0)
    const anchorWidth = ref(0)
    const anchorOffset = ref(0)
    const currentNodeKey = ref('')
    const scrollTimeout = ref(null)

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

    // 监听窗口大小变化
    const handleResize = () => {
      checkIsMobile()
      updateAnchorPosition()
    }

    // 更新锚点位置信息
    const updateAnchorPosition = () => {
      if (isMobile.value) return

      const anchorWrapper = document.querySelector('.anchor-wrapper')
      if (anchorWrapper) {
        const rect = anchorWrapper.getBoundingClientRect()
        anchorTop.value = rect.top + window.scrollY
        anchorWidth.value = rect.width

        // 获取导航栏高度作为偏移量
        const navbarHeight = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--navbar-height'), 10) || 60
        anchorOffset.value = navbarHeight
      }
    }

    // 处理滚动事件，控制侧边栏固定
    const handleScroll = () => {
      if (isMobile.value) return

      const anchorWrapper = document.querySelector('.anchor-wrapper')
      if (!anchorWrapper) return

      // 获取导航栏高度
      const navbarHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height'), 10) || 60

      // 当页面滚动超过侧边栏原始位置时，固定侧边栏
      isAnchorFixed.value = window.scrollY >= anchorTop.value - navbarHeight
    }

    // 处理内容区域滚动事件
    const handleContentScroll = () => {
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
      pageContent,
      treeData,
      treeProps,
      isMobile,
      showMobileToc,
      isAnchorFixed,
      fixedAnchorStyle,
      handleNodeClick,
      handleMobileNodeClick,
      currentNodeKey,
      handleContentScroll,
      handleResize,
      handleScroll
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

.mobile-toc-button {
  display: none;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  border-radius: var(--border-radius);
  padding: 8px 16px;
  cursor: pointer;
  font-size: var(--font-size-base);
  color: white;
  transition: var(--transition-base);
  margin: 10px 20px;
  width: fit-content;
}

.mobile-toc-button:hover {
  opacity: 0.9;
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
}

.section {
  padding: 20px 0;
}

.section h3 {
  color: var(--color-secondary);
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: var(--font-size-xl);
  font-weight: 600;
}

.section h4 {
  color: var(--color-secondary);
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: var(--font-size-lg);
  font-weight: 500;
}

.section p {
  font-size: var(--font-size-base);
  line-height: 1.7;
  color: var(--color-text);
  margin-bottom: 16px;
}

.section ul,
.section ol {
  margin-bottom: 24px;
  padding-left: 24px;
}

.section li {
  margin-bottom: 8px;
  line-height: 1.7;
  color: var(--color-text);
}

.page-footer {
  background-color: var(--color-background);
  color: var(--color-text-muted);
  text-align: center;
  padding: 20px;
  border-top: 1px solid var(--color-border);
  height: 70px;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .anchor-aside {
    display: none;
  }

  .mobile-toc-button {
    display: flex;
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
    line-height: 1.6;
  }

  .section ul,
  .section ol {
    margin-bottom: 20px;
    padding-left: 20px;
  }

  .section li {
    margin-bottom: 6px;
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

  .mobile-toc-button {
    margin: 10px 15px;
    padding: 6px 12px;
    font-size: var(--font-size-sm);
  }
}
</style>
