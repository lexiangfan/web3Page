<template>
  <div class="global-search" ref="searchContainerRef">
    <el-input
        v-model="searchText"
        placeholder="搜索文档..."
        clearable
        @input="performSearch"
        @clear="clearSearch"
        @keyup.enter="handleSearch"
        class="global-search-input"
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
      >
        <div
            v-for="result in searchResults"
            :key="result.id"
            class="global-search-result-item"
            @click="jumpToSearchResult(result)"
        >
          <div class="result-title">{{ result.title }}</div>
          <div class="result-content" v-html="result.preview"></div>
        </div>
      </div>

      <div
          v-show="showSearchResults && searchResults.length === 0 && searchText"
          class="no-results"
          :style="searchResultsStyle"
      >
        未找到相关内容
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted} from 'vue'
import { Search } from '@element-plus/icons-vue'
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

    // 监听窗口大小变化
    const handleResize = () => {
      windowWidth.value = window.innerWidth
      // 窗口大小改变时隐藏搜索结果
      showSearchResults.value = false
    }

    // 计算搜索结果面板的位置和样式
    const searchResultsStyle = computed(() => {
      if (!searchContainerRef.value) {
        return {
          position: 'fixed',
          top: '60px',
          left: '10px',
          right: '10px',
          zIndex: '9999'
        }
      }

      const rect = searchContainerRef.value.getBoundingClientRect();

      // 移动端适配
      if (windowWidth.value <= 768) {
        return {
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: '10px',
          right: '10px',
          zIndex: '9999',
          maxWidth: 'none'
        }
      }

      // 中等及以上屏幕
      return {
        position: 'fixed',
        top: rect.bottom + 8 + 'px',
        left: rect.left + 'px',
        width: rect.width + 'px',
        zIndex: '9999'
      }
    })

    // 搜索方法
    const performSearch = () => {
      if (!searchText.value.trim()) {
        searchResults.value = []
        showSearchResults.value = false
        return
      }

      searchResults.value = searchService.search(searchText.value)
      showSearchResults.value = true
    }

    // 清空搜索
    const clearSearch = () => {
      searchText.value = ''
      searchResults.value = []
      showSearchResults.value = false
    }

    // 处理搜索
    const handleSearch = () => {
      if (searchResults.value.length > 0) {
        jumpToSearchResult(searchResults.value[0])
      }
    }

    // 跳转到搜索结果
    const jumpToSearchResult = (result) => {
      showSearchResults.value = false
      searchText.value = ''

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
      if (searchContainerRef.value && !searchContainerRef.value.contains(event.target)) {
        showSearchResults.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })

    return {
      searchText,
      searchResults,
      showSearchResults,
      searchContainerRef,
      searchResultsStyle,
      performSearch,
      clearSearch,
      handleSearch,
      jumpToSearchResult
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
  max-height: 320px;
  overflow-y: auto;
  margin-top: 8px;
  box-sizing: border-box;
}

.global-search-result-item {
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: var(--transition-base);
}

.global-search-result-item:hover {
  background-color: var(--color-surface);
}

.global-search-result-item:last-child {
  border-bottom: none;
}

.result-title {
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 6px;
  font-size: var(--font-size-base);
}

.result-content {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-content :deep(strong) {
  color: var(--color-primary);
  font-weight: 600;
  background-color: rgba(37, 99, 235, 0.1);
  padding: 0 2px;
}

.no-results {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  padding: 20px;
  margin-top: 8px;
  color: var(--color-text-muted);
  text-align: center;
  font-size: var(--font-size-base);
  box-sizing: border-box;
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
}
</style>
