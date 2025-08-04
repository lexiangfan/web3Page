<!-- src/components/GlobalSearch.vue -->
<template>
  <div class="global-search" ref="searchContainerRef">
    <el-input
        v-model="searchText"
        placeholder="全局搜索..."
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
        top: rect.bottom + 'px',
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
  width: 300px;
  margin: 0 20px;
}

.global-search-input {
  width: 100%;
}

:deep(.global-search-input .el-input__wrapper) {
  border-radius: 20px !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

:deep(.global-search-input .el-input__inner) {
  border: none !important;
  padding-left: 30px !important;
  background: transparent;
}

:deep(.global-search-input .el-input__prefix) {
  left: 10px !important;
}

.global-search-results {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  margin-top: 5px;
}

.global-search-result-item {
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.global-search-result-item:hover {
  background-color: #f5f7fa;
}

.global-search-result-item:last-child {
  border-bottom: none;
}

.result-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.result-content {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-content :deep(strong) {
  color: var(--color-primary);
  font-weight: bold;
}

.no-results {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-top: 5px;
  color: #999;
  text-align: center;
}

@media (max-width: 768px) {
  .global-search {
    width: 150px;
  }

  :deep(.global-search-input .el-input__inner) {
    font-size: 14px;
  }
}

@media (max-width: 576px) {
  .global-search {
    width: 120px;
  }
}
</style>
