<!-- src/views/Page.vue -->
<template>
  <div class="page-container">
    <el-row class="full-height">
      <el-col :span="6" class="anchor-col">
        <div class="anchor-wrapper">
          <el-anchor
              :container="containerRef"
              direction="vertical"
              type="default"
              :offset="30"
              @click="handleClick"
              class="anchor-menu"
          >
            <el-anchor-link
                v-for="item in pageContent"
                :key="item.id"
                :href="'#' + item.id"
                :title="item.title"
            />
          </el-anchor>
        </div>
      </el-col>
      <el-col :span="18" class="content-col">
        <div ref="containerRef" class="scroll-container">
          <div
              v-for="item in pageContent"
              :key="item.id"
              :id="item.id"
              class="content-part"
          >
            <h2>{{ item.title }}</h2>
            <div v-html="item.content"></div>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>

</template>

<script>
import { ref } from 'vue'
import pageContents from '@/utils/page.js'

export default {
  name: 'Page',
  setup() {
    const containerRef = ref(null)
    const pageContent = ref(pageContents)

    const handleClick = (e) => {
      e.preventDefault()
    }

    return {
      containerRef,
      pageContent,
      handleClick
    }
  }
}
</script>

<style scoped>
.page-container {
  height: calc(100vh - var(--navbar-height));
  width: 100%;
  position: relative;
  background: var(--color-gradient);
}

.full-height {
  height: 100%;
}

.content-col {
  height: 100%;
  position: relative;
  background-color: #ffffff;
  overflow: hidden;
}

.scroll-container {
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #ffffff;
  direction: rtl;
  width: 100%;
  overflow-anchor: none;
}

.scroll-container::-webkit-scrollbar {
  width: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  border: none;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.content-part {
  min-height: 100%;
  padding: 20px;
  border-radius: 0;
  background-color: #ffffff;
  box-shadow: none;
  direction: ltr;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.content-part:last-child {
  border-bottom: none;
}

.content-part h2 {
  color: #333;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-primary);
}

.content-part h3 {
  color: #444;
  margin-top: 20px;
}

.content-part p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.content-part ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.content-part li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.anchor-col {
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  background-color: #fafafa;
  border: none;
}

.anchor-wrapper {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.anchor-menu {
  height: 100%;
  width: 100%;
  border: none;
}

:deep(.el-anchor) .el-anchor-link {
  border: none !important;
  border-radius: 6px;
  transition: background-color 0.3s;
  padding: 8px 12px;
  box-shadow: none;
  margin-bottom: 4px;
}

:deep(.el-anchor) .el-anchor-link:hover {
  background-color: #f0f0f0;
  border: none !important;
}

:deep(.el-anchor) .el-anchor-link.is-active {
  background-color: #e6f7ff;
  border: none !important;
  box-shadow: none;
}

@media (max-width: 768px) {
  .anchor-col {
    display: none !important;
  }

  .content-col {
    width: 100% !important;
  }
}
</style>
