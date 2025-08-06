<!-- src/components/GlobalSearch.vue -->
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

    // 计算搜索结果面板的位置和样式
    const searchResultsStyle = computed(() => {
      if (!searchContainerRef.value) {
        return {
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '0px',
          zIndex: '9999'
        }
      }

      const rect = searchContainerRef.value.getBoundingClientRect()
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
      router.push(result.path || '/Page#' + result.id)
    }

    // 点击其他地方隐藏搜索结果
    const handleClickOutside = (event) => {
      if (searchContainerRef.value && !searchContainerRef.value.contains(event.target)) {
        showSearchResults.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
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
  max-width: 300px;
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
  padding-left: 32px !important;
  background: transparent !important;
  color: var(--color-text) !important;
}

:deep(.global-search-input .el-input__inner::placeholder) {
  color: var(--color-text-muted) !important;
}

:deep(.global-search-input .el-input__prefix) {
  left: 12px !important;
  color: var(--color-text-muted) !important;
}

.global-search-results {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  max-height: 320px;
  overflow-y: auto;
  margin-top: 8px;
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
}

/* 响应式设计 */
@media (max-width: 768px) {
  .global-search {
    max-width: 200px;
  }

  :deep(.global-search-input .el-input__inner) {
    font-size: 14px;
    padding: 8px 12px 8px 32px !important;
  }
}

@media (max-width: 576px) {
  .global-search {
    max-width: 150px;
  }
}
</style>
