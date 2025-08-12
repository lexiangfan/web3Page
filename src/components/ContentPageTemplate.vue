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
            <div class="page-nav-button-container">
              <el-button
                  class="page-nav-button"
                  @click="openDesktopPageNavigation"
              >
                <el-icon><Menu /></el-icon>
                <span>页面导航</span>
              </el-button>
            </div>

            <div class="anchor-header">
              <h2>目录</h2>
            </div>
            <el-scrollbar class="anchor-scrollbar">
              <el-tree
                  :data="treeData"
                  :props="treeProps"
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
          <div
              v-if="isMobile"
              class="mobile-buttons"
          >
            <div class="mobile-nav-button" @click="openMobilePageNavigation">
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
              <!-- 如果有直接内容则显示 -->
              <div v-if="chapter.content && chapter.content.trim()" v-html="chapter.content"></div>

              <!-- 渲染子章节 -->
              <div
                  v-for="section in chapter.children"
                  :key="section.id"
                  :id="section.id"
                  class="section"
              >
                <h3>{{ section.title }}</h3>
                <div v-if="section.content && section.content.trim()" v-html="section.content"></div>

                <!-- 如果子章节还有子章节，继续渲染 -->
                <div
                    v-for="subSection in section.children"
                    :key="subSection.id"
                    :id="subSection.id"
                    class="subsection"
                >
                  <h4>{{ subSection.title }}</h4>
                  <div v-if="subSection.content && subSection.content.trim()" v-html="subSection.content"></div>

                  <!-- 支持更多层级 -->
                  <div
                      v-for="subSubSection in subSection.children"
                      :key="subSubSection.id"
                      :id="subSubSection.id"
                      class="subsubsection"
                  >
                    <h5>{{ subSubSection.title }}</h5>
                    <div v-if="subSubSection.content && subSubSection.content.trim()" v-html="subSubSection.content"></div>
                  </div>
                </div>
              </div>
            </div>

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
                <el-col :span="2"></el-col>
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

      <!-- 桌面端页面导航抽屉 -->
      <el-drawer
          v-model="showDesktopPageNav"
          title="页面导航"
          direction="ltr"
          size="300px"
          class="desktop-page-nav-drawer"
      >
        <!-- 在桌面端使用PageNavigationDrawer时，关闭内部的抽屉功能 -->
        <PageNavigationDrawer :show-toggle-button="false" ref="desktopPageNavDrawer" />
      </el-drawer>

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

    <!-- 回到顶部按钮 -->
    <div
        v-if="showBackToTop"
        class="back-to-top"
        @click="scrollToTop"
    >
      <div class="progress-text">{{ readingProgress }}%</div>
      <el-icon class="arrow-up-icon"><ArrowUp /></el-icon>
    </div>
  </div>
</template>


<script>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ArrowLeft, ArrowRight, ArrowUp, Collection, Menu} from '@element-plus/icons-vue'
import PageNavigationDrawer from "@/components/PageNavigationDrawer.vue"
import pageService from '@/services/pageService.js'

export default {
  name: 'ContentPageTemplate',
  components: {
    ArrowUp,
    PageNavigationDrawer,
    Menu,
    Collection,
    ArrowLeft,
    ArrowRight
  },
  props: {
    contentData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const containerRef = ref(null)
    const treeRef = ref(null)
    const mobileTreeRef = ref(null)
    const desktopPageNavDrawer = ref(null)
    const mobilePageNavDrawer = ref(null)
    const pageContent = ref(props.contentData)
    const isMobile = ref(false)
    const showMobileToc = ref(false)
    const showMobilePageNav = ref(false)
    const showDesktopPageNav = ref(false)
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
    const readingProgress = ref(0)
    const showBackToTop = ref(false)

    // 添加响应式数据
    const isMobileButtonsFixed = ref(false)
    // 获取页面列表
    const pages = computed(() => pageService.getPages())
    // 计算当前页面索引
    const currentPageIndex = computed(() => {
      return pages.value.findIndex(page => page && page.path === route.path)
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

    // 计算阅读进度
    const calculateReadingProgress = () => {
      const {value} = containerRef;
      const container = value
      if (!container) return

      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight
      const progress = Math.round((scrollTop / scrollHeight) * 100)

      readingProgress.value = isNaN(progress) ? 0 : progress
      showBackToTop.value = progress > 10
    }

    // 滚动到顶部
    const scrollToTop = () => {
      const {value} = containerRef;
      if (value) {
        value.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }

    // 构建树形数据结构
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

    const treeData = ref(buildTreeData(props.contentData));

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
        currentNodeKey.value = id
      }
    }

    const handleNodeClick = (data) => {
      scrollToElement(data.id)
    }

    const handleMobileNodeClick = (data) => {
      showMobileToc.value = false
      setTimeout(() => {
        scrollToElement(data.id)
      }, 300)
    }

    // 打开桌面端页面导航抽屉
    const openDesktopPageNavigation = () => {
      showDesktopPageNav.value = true
      setTimeout(() => {
        const {value} = desktopPageNavDrawer;
        if (value) {
          value.openDrawer()
        }
      }, 100)
    }

    // 打开移动端页面导航抽屉
    const openMobilePageNavigation = () => {
      showMobilePageNav.value = true
      setTimeout(() => {
        const {value} = mobilePageNavDrawer;
        if (value) {
          value.openDrawer()
        }
      }, 100)
    }

    // 监听窗口大小变化
    const handleResize = () => {
      checkIsMobile()
      updateAnchorPosition()
      if (isMobile.value) {
        nextTick(() => {
          const contentParts = document.querySelectorAll('.content-part');
          contentParts.forEach(part => {
            part.classList.add('visible');
          });
        });
      }
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

      const navbarHeight = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height'), 10) || 60
      // 当页面滚动超过侧边栏原始位置时，固定侧边栏
      isAnchorFixed.value = window.scrollY >= anchorTop.value - navbarHeight
      // 当页面滚动超过目录标题位置时，固定目录标题
      const headerTop = anchorTop.value + 24
      isHeaderFixed.value = window.scrollY >= headerTop - navbarHeight
    }

    // 处理内容区域滚动事件
    const handleContentScroll = () => {
      // 添加进度计算
      calculateReadingProgress()

      // 检查是否需要固定移动端按钮
      const {value} = containerRef;
      if (isMobile.value && value) {
        const scrollTop = value.scrollTop
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
      const {value} = containerRef;
      const scrollContainer = value
      if (!scrollContainer) return

      const scrollTop = scrollContainer.scrollTop
      const scrollHeight = scrollContainer.clientHeight

      // 收集所有章节元素
      const sections = []
      const collectSections = (items) => {
        items.forEach(item => {
          sections.push(item.id);
          if (item.children && Array.isArray(item.children)) {
            collectSections(item.children);
          }
        });
      };

      collectSections(props.contentData);

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
              const {value: value1} = treeRef;
              if (value1) {
                value1.setCurrentKey(sectionId)
              }
              const {value: value2} = mobileTreeRef;
              if (value2) {
                value2.setCurrentKey(sectionId)
              }
            })
            break
          }
        }
      }
    }

    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    onMounted(() => {
      checkIsMobile()
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll)

      // 等待DOM渲染完成后获取位置信息
      setTimeout(() => {
        updateAnchorPosition()
        detectCurrentSection()
        // 初始化进度计算
        calculateReadingProgress()
      }, 100)

      nextTick(() => {
        const contentParts = document.querySelectorAll('.content-part');
        if (window.innerWidth <= 768) {
          contentParts.forEach(part => part.classList.add('visible'));
        } else {
          // 桌面端保留原有的 Intersection Observer 机制
          observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, {
            threshold: 0.1
          });

          contentParts.forEach(part => observer.observe(part));
        }
      });
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout.value) {
        clearTimeout(scrollTimeout.value)
      }
      const contentParts = document.querySelectorAll('.content-part');
      contentParts.forEach(part => observer.unobserve(part));
    })

    return {
      containerRef,
      treeRef,
      mobileTreeRef,
      desktopPageNavDrawer,
      mobilePageNavDrawer,
      pageContent,
      treeData,
      treeProps,
      isMobile,
      showMobileToc,
      showMobilePageNav,
      showDesktopPageNav,
      isAnchorFixed,
      isHeaderFixed,
      fixedAnchorStyle,
      fixedHeaderStyle,
      handleNodeClick,
      handleMobileNodeClick,
      openDesktopPageNavigation,
      openMobilePageNavigation,
      currentNodeKey,
      handleContentScroll,
      handleResize,
      handleScroll,
      prevPage,
      nextPage,
      goToPage,
      isMobileButtonsFixed,
      readingProgress,
      showBackToTop,
      scrollToTop
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

.page-nav-button-container {
  padding: 0 24px 16px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 16px;
}

.page-nav-button {
  width: 100%;
  justify-content: flex-start;
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
  background: transparent;
}

:deep(.anchor-tree .el-tree-node) {
  margin-bottom: 8px;
}

:deep(.anchor-tree .el-tree-node__content) {
  border-radius: var(--border-radius-small);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 12px 16px;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  position: relative;
}

:deep(.anchor-tree .el-tree-node__content:hover) {
  background-color: var(--color-surface);
  color: var(--color-primary);
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
  height: 100%;
  position: relative;
}

.scroll-container {
  height: calc(100vh - var(--navbar-height));
  padding: 40px;
  overflow-y: auto;
  box-sizing: border-box;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

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
  font-size: var(--font-size-xxl);
  margin-bottom: 24px;
  color: var(--color-primary-dark);
  font-weight: 700;
  line-height: 1.3;
  position: relative;
  padding-left: 15px;
}

.content-part h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 80%;
  background: var(--color-primary);
  border-radius: 2px;
}

.section {
  margin-bottom: 32px;
}

.section:last-child {
  margin-bottom: 0;
}

.section h3 {
  font-size: var(--font-size-xl);
  margin-top: 32px;
  margin-bottom: 16px;
  color: var(--color-secondary);
  font-weight: 600;
  border-left: 3px solid var(--color-primary);
  padding-left: 12px;
}

.section h4 {
  font-size: var(--font-size-lg);
  margin-top: 24px;
  margin-bottom: 12px;
  color: var(--color-secondary);
  font-weight: 600;
}

.section p {
  font-size: var(--font-size-base);
  margin-bottom: 16px;
  line-height: 1.8;
  color: var(--color-text);
}

.section ul,
.section ol {
  margin-bottom: 24px;
  padding-left: 24px;
}

.section li {
  margin-bottom: 8px;
  line-height: 1.8;
}

.section a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-primary);
  transition: var(--transition-base);
}

.section a:hover {
  color: var(--color-accent);
  border-bottom-color: var(--color-accent);
}

.section img {
  max-width: 100%;
  height: auto;
  border-radius: var(--border-radius);
  margin: 16px 0;
  box-shadow: var(--shadow-base);
}

.section code {
  background-color: #f7fafc;
  padding: 2px 6px;
  border-radius: var(--border-radius-small);
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: var(--font-size-sm);
  color: #e53e3e;
}

.section pre {
  position: relative;
  background-color: #2d3748;
  border-radius: var(--border-radius);
  padding: 16px;
  overflow: auto;
  margin: 16px 0;
  box-shadow: var(--shadow-base);
}

.section blockquote {
  border-left: 4px solid var(--color-primary);
  padding: 20px 24px;
  margin: 24px 0;
  background-color: rgba(37, 99, 235, 0.05);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  position: relative;
}

.section blockquote::before {
  content: " ";
  font-size: 60px;
  color: var(--color-primary);
  opacity: 0.2;
  position: absolute;
  top: -20px;
  left: 10px;
  font-family: Georgia, serif;
}

.section blockquote p {
  margin-bottom: 0;
  color: var(--color-secondary);
  font-style: italic;
}

.section .table-container {
  margin: var(--spacing-base) 0;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  box-shadow: var(--shadow-base);
}

.section .table-container .table {
  margin: 0;
  box-shadow: none;
  border-radius: 0;
}


.page-navigation {
  padding: 40px 0 20px;
  border-top: 1px solid var(--color-border);
  margin-top: 20px;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
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

.page-footer {
  text-align: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

/* 移动端按钮 */
.mobile-buttons {
  display: flex;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
  transition: transform 0.3s ease;
}

.mobile-buttons.fixed {
  position: fixed;
  width: 100%;
  top: var(--navbar-height);
  left: 0;
  box-shadow: var(--shadow-base);
}

.mobile-nav-button,
.mobile-toc-button {
  padding: 8px 16px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  flex: 1;
  text-align: center;
  margin: 0 5px;
}

.mobile-nav-button:hover,
.mobile-toc-button:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 桌面端页面导航抽屉 */
:deep(.desktop-page-nav-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
}

:deep(.desktop-page-nav-drawer .el-drawer__body) {
  padding: 0;
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
  position: relative;
  bottom: auto;
  left: auto;
  right: auto;
  background-color: transparent;
  box-shadow: none;
  z-index: auto;
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

.back-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-hover);
  transition: var(--transition-base);
  z-index: 100;
}

.back-to-top:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-3px);
}

.progress-text {
  font-size: 10px;
  font-weight: bold;
}

.arrow-up-icon {
  font-size: 18px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .anchor-aside {
    display: none;
  }

  .content-main {
    width: 100%;
  }

  .scroll-container {
    padding: 20px 15px; /* 增加适当的内边距 */
  }

  .content-part {
    padding: 0 0 40px;
    margin-bottom: 40px;
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
    padding: 20px 15px;
  }

  .content-part {
    padding: 0 0 40px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--color-border);
    transform: translateY(0);
    transition: all 0.6s ease-out;
  }

  .content-part.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
  }

  .content-part.animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .content-part.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .content-part h2 {
    font-size: var(--font-size-xl);
    margin-bottom: 20px;
    position: relative;
    padding-left: 12px;
  }

  .content-part h2::before {
    width: 3px;
  }

  .section {
    margin-bottom: 24px;
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

  .section .table-container {
    overflow-x: hidden;
  }

  .section .table {
    table-layout: fixed;
    width: 100%;
  }

  .section .table th,
  .section .table td {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
    word-wrap: break-word;
    word-break: break-word;
  }

  /* 为表格列设置默认宽度 */
  .section .table th:nth-child(1),
  .section .table td:nth-child(1) {
    width: 25%;
  }

  .section .table th:nth-child(2),
  .section .table td:nth-child(2) {
    width: 25%;
  }

  .section .table th:nth-child(3),
  .section .table td:nth-child(3) {
    width: 25%;
  }

  .section .table th:nth-child(4),
  .section .table td:nth-child(4) {
    width: 25%;
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

  .back-to-top {
    bottom: 80px;
    right: 20px;
    width: 45px;
    height: 45px;
  }

  .progress-text {
    font-size: 9px;
  }

  .arrow-up-icon {
    font-size: 16px;
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

  .section .table th,
  .section .table td {
    padding: var(--spacing-xxs) var(--spacing-xs);
    font-size: 11px;
  }

  /* 在超小屏幕上进一步优化 */
  .section .table th:nth-child(1),
  .section .table td:nth-child(1) {
    width: 30%;
  }

  .section .table th:nth-child(2),
  .section .table td:nth-child(2) {
    width: 30%;
  }

  .section .table th:nth-child(3),
  .section .table td:nth-child(3) {
    width: 20%;
  }

  .section .table th:nth-child(4),
  .section .table td:nth-child(4) {
    width: 20%;
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

/* 暗色主题 */
[data-theme="dark"] .section pre {
  background-color: #1e293b;
  color: #e2e8f0;
}

[data-theme="dark"] .section code {
  background-color: #334155;
  color: #f87171;
}

[data-theme="dark"] .section blockquote {
  background-color: rgba(37, 99, 235, 0.15);
}

[data-theme="dark"] .nav-button,
[data-theme="dark"] .mobile-nav-button,
[data-theme="dark"] .mobile-toc-button {
  background-color: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text);
}
</style>
