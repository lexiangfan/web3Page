<template>
  <div class="global-search" ref="searchContainerRef">
    <el-input
        v-model="searchText"
        placeholder="搜索文档..."
        clearable
        @input="performSearch"
        @clear="clearSearch"
        @keyup.enter="handleSearch"
        @focus="onSearchFocus"
        class="global-search-input"
        :suffix-icon="searchLoading ? 'Loading' : ''"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
    </el-input>

    <Teleport to="body">
      <div
          v-show="showSearchResults && searchResults.length > 0"
          class="global-search-results"
          :style="searchResultsStyle"
          @mouseenter="onResultsHover"
          @mouseleave="onResultsLeave"
      >
        <div
            v-for="(result, index) in searchResults"
            :key="result.id"
            class="global-search-result-item"
            :class="{ 'active': activeResultIndex === index }"
            @click="jumpToSearchResult(result)"
            @mouseenter="activeResultIndex = index"
        >
          <div class="result-title">{{ result.title }}</div>
          <div class="result-content" v-html="result.preview"></div>
          <div class="result-path">{{ result.pagePath }}</div>
        </div>
      </div>

      <div
          v-show="showSearchResults && searchResults.length === 0 && searchText"
          class="no-results"
          :style="searchResultsStyle"
      >
        <el-icon class="no-results-icon"><Search /></el-icon>
        <div class="no-results-text">未找到相关内容</div>
        <div class="no-results-hint">试试其他关键词</div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {Search} from '@element-plus/icons-vue'
import searchService from '@/services/searchService.js'
import router from '@/router/router.js'

export default {
  name: 'GlobalSearch',
  setup() {
    const searchText = ref('')
    const searchResults = ref([])
    const showSearchResults = ref(false)
    const searchContainerRef = ref(null)
    const windowWidth = ref(window.innerWidth)
    const activeResultIndex = ref(-1)
    const isResultsHovered = ref(false)
    const searchLoading = ref(false)
    const searchResultsPosition = ref({})

    // 监听窗口大小变化
    const handleResize = () => {
      windowWidth.value = window.innerWidth
      // 更新搜索结果框位置
      updateSearchResultsPosition()
      // 窗口大小改变时隐藏搜索结果
      showSearchResults.value = false
    }

    // 更新搜索结果框位置
    const updateSearchResultsPosition = () => {
      if (!searchContainerRef.value) {
        searchResultsPosition.value = {
          position: 'fixed',
          top: '60px',
          left: '10px',
          right: '10px',
          zIndex: '9999'
        }
        return
      }

      const rect = searchContainerRef.value.getBoundingClientRect()
      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        // 移动端 - 横向铺满屏幕，位置固定
        searchResultsPosition.value = {
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: '10px',
          right: '10px',
          zIndex: '9999',
          maxWidth: 'none'
        }
      } else {
        // 中等及以上屏幕 - 宽度与搜索框保持一致，并跟随搜索框位置
        searchResultsPosition.value = {
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: rect.left + 'px',
          width: rect.width + 'px',
          zIndex: '9999'
        }
      }
    }

    // 计算搜索结果面板的位置和样式
    const searchResultsStyle = computed(() => {
      return searchResultsPosition.value
    })

    // 搜索方法
    const performSearch = () => {
      const text = searchText.value;
      if (!text || typeof text !== 'string' || !text.trim()) {
        searchResults.value = [];
        showSearchResults.value = false;
        activeResultIndex.value = -1;
        return;
      }

      searchLoading.value = true
      // 模拟异步搜索
      setTimeout(() => {
        searchResults.value = searchService.search(text);
        showSearchResults.value = true;
        activeResultIndex.value = -1;
        searchLoading.value = false
      }, 100)
    };

    // 清空搜索
    const clearSearch = () => {
      searchText.value = ''
      searchResults.value = []
      showSearchResults.value = false
      activeResultIndex.value = -1
    }

    // 处理搜索
    const handleSearch = () => {
      if (activeResultIndex.value >= 0 && activeResultIndex.value < searchResults.value.length) {
        jumpToSearchResult(searchResults.value[activeResultIndex.value])
      } else if (searchResults.value.length > 0) {
        jumpToSearchResult(searchResults.value[0])
      }
    }

    // 处理键盘事件
    const handleKeyDown = (event) => {
      if (!showSearchResults.value) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (searchResults.value.length > 0) {
            activeResultIndex.value = (activeResultIndex.value + 1) % searchResults.value.length;
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (searchResults.value.length > 0) {
            activeResultIndex.value = activeResultIndex.value <= 0
                ? searchResults.value.length - 1
                : activeResultIndex.value - 1;
          }
          break;
        case 'Escape':
          showSearchResults.value = false;
          activeResultIndex.value = -1;
          break;
      }
    }

    // 跳转到搜索结果
    const jumpToSearchResult = (result) => {
      showSearchResults.value = false
      searchText.value = ''
      activeResultIndex.value = -1

      // 获取目标页面路径，如果没有则默认为/Page
      const targetPage = result.pagePath || '/Page'

      // 跳转到对应页面并滚动到对应元素
      router.push(targetPage).then(() => {
        // 等待页面加载完成后滚动到目标元素
        setTimeout(() => {
          const targetElement = document.getElementById(result.id)
          if (targetElement) {
            // 使用平滑滚动
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 300)
      }).catch(err => {
        // 如果已经在目标页面，则直接滚动
        if (err.name === 'NavigationDuplicated') {
          const targetElement = document.getElementById(result.id)
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      })
    }

    // 点击其他地方隐藏搜索结果
    const handleClickOutside = (event) => {
      if (searchContainerRef.value && !searchContainerRef.value.contains(event.target) && !isResultsHovered.value) {
        showSearchResults.value = false
        activeResultIndex.value = -1
      }
    }

    // 搜索框聚焦事件
    const onSearchFocus = () => {
      if (searchText.value && searchResults.value.length > 0) {
        showSearchResults.value = true
      }
    }

    // 鼠标进入搜索结果
    const onResultsHover = () => {
      isResultsHovered.value = true
    }

    // 鼠标离开搜索结果
    const onResultsLeave = () => {
      isResultsHovered.value = false
    }

    // 监听搜索框位置变化
    const observeSearchContainer = () => {
      if (!searchContainerRef.value) return

      const observer = new MutationObserver(() => {
        // 当搜索框位置发生变化时更新结果框位置
        if (showSearchResults.value) {
          updateSearchResultsPosition()
        }
      })

      observer.observe(searchContainerRef.value, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: false,
        subtree: false
      })

      return observer
    }

    let mutationObserver = null

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
      document.addEventListener('keydown', handleKeyDown)

      // 初始更新位置
      updateSearchResultsPosition()

      // 监听搜索框变化
      mutationObserver = observeSearchContainer()
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleKeyDown)

      if (mutationObserver) {
        mutationObserver.disconnect()
      }
    })

    // 当搜索结果显示状态改变时更新位置
    watch(showSearchResults, (newVal) => {
      if (newVal) {
        // 延迟一小段时间确保DOM已经更新
        setTimeout(() => {
          updateSearchResultsPosition()
        }, 0)
      }
    })

    return {
      searchText,
      searchResults,
      showSearchResults,
      searchContainerRef,
      searchResultsStyle,
      activeResultIndex,
      performSearch,
      clearSearch,
      handleSearch,
      jumpToSearchResult,
      onSearchFocus,
      onResultsHover,
      onResultsLeave,
      searchLoading,
    }
  },
  components: {
    Search
  }
}
</script>

<style scoped>
.global-search {
  position: relative;
  width: 100%;
  max-width: 350px;
}

.global-search-input {
  width: 100%;
}

:deep(.global-search-input .el-input__wrapper) {
  border-radius: var(--border-radius-large) !important;
  background-color: var(--color-surface) !important;
  box-shadow: var(--shadow-base) !important;
  border: 1px solid var(--color-border) !important;
  transition: var(--transition-base);
  min-height: 36px;
}

:deep(.global-search-input .el-input__wrapper:hover) {
  box-shadow: var(--shadow-hover) !important;
  border-color: var(--color-primary) !important;
}

:deep(.global-search-input .el-input__wrapper.is-focus) {
  box-shadow: var(--shadow-hover) !important;
  border-color: var(--color-primary) !important;
}

:deep(.global-search-input .el-input__inner) {
  border: none !important;
  padding-left: 36px !important;
  background: transparent !important;
  color: var(--color-text) !important;
  min-width: 80px;
  font-size: var(--font-size-base);
  height: 36px;
  line-height: 36px;
}

:deep(.global-search-input .el-input__inner::placeholder) {
  color: var(--color-text-muted) !important;
  font-size: var(--font-size-sm);
}

:deep(.global-search-input .el-input__prefix) {
  left: 14px !important;
  color: var(--color-text-muted) !important;
  font-size: 16px;
}

.global-search-results {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  max-height: 400px;
  overflow-y: auto;
  margin-top: 8px;
  box-sizing: border-box;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.global-search-result-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition-base);
  position: relative;
}

.global-search-result-item:last-child {
  border-bottom: none;
}

.global-search-result-item:hover,
.global-search-result-item.active {
  background-color: var(--color-surface);
}

.global-search-result-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--color-primary);
}

.result-title {
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 6px;
  font-size: var(--font-size-base);
  display: flex;
  align-items: center;
}

.result-content {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.result-content :deep(strong) {
  color: var(--color-primary);
  font-weight: 600;
  background-color: rgba(37, 99, 235, 0.1);
  padding: 0 2px;
  border-radius: 2px;
}

.result-path {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: 4px;
}

.no-results {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  padding: 30px 20px;
  margin-top: 8px;
  text-align: center;
  box-sizing: border-box;
  animation: slideDown 0.2s ease-out;
}

.no-results-icon {
  font-size: 48px;
  color: var(--color-text-muted);
  margin-bottom: 12px;
}

.no-results-text {
  font-size: var(--font-size-base);
  color: var(--color-text);
  margin-bottom: 8px;
  font-weight: 500;
}

.no-results-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .global-search {
    max-width: 200px;
    margin-right: 4px;
    min-width: 150px;
  }

  :deep(.global-search-input .el-input__inner) {
    font-size: 14px;
    padding: 8px 10px 8px 32px !important;
    min-width: 100px;
    height: 34px;
    line-height: 34px;
  }

  :deep(.global-search-input .el-input__prefix) {
    left: 10px !important;
    font-size: 15px;
  }

  /* 在移动端，搜索结果框需要特殊处理 */
  .global-search-results,
  .no-results {
    left: 10px !important;
    right: 10px !important;
    width: auto !important;
    max-width: none !important;
  }
}

@media (max-width: 576px) {
  .global-search {
    max-width: 160px;
    margin-right: 2px;
    min-width: 130px;
  }

  :deep(.global-search-input .el-input__inner) {
    font-size: 13px;
    padding: 6px 8px 6px 28px !important;
    min-width: 90px;
    height: 32px;
    line-height: 32px;
  }

  :deep(.global-search-input .el-input__prefix) {
    left: 8px !important;
    font-size: 14px;
  }

  .result-title {
    font-size: var(--font-size-sm);
  }

  .result-content {
    font-size: var(--font-size-xs);
  }

  .global-search-results {
    max-height: 250px;
  }
}

@media (max-width: 400px) {
  .global-search {
    max-width: 130px;
    min-width: 110px;
  }

  :deep(.global-search-input .el-input__inner) {
    font-size: 12px;
    padding: 5px 6px 5px 26px !important;
    min-width: 80px;
    height: 30px;
    line-height: 30px;
  }

  :deep(.global-search-input .el-input__prefix) {
    left: 7px !important;
    font-size: 13px;
  }

  .no-results {
    padding: 20px 15px;
  }

  .no-results-icon {
    font-size: 36px;
  }
}
</style>
