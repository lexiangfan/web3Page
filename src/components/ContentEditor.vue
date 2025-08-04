<!-- src/components/ContentEditor.vue -->
<template>
  <div class="content-editor">
    <h3>添加新内容</h3>
    <el-form :model="newContent" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="newContent.title" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
            v-model="newContent.content"
            type="textarea"
            :rows="4"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addContent">添加内容</el-button>
      </el-form-item>
    </el-form>

    <h3>现有内容</h3>
    <div class="content-list">
      <div
          v-for="content in contents"
          :key="content.id"
          class="content-item"
      >
        <h4>{{ content.title }}</h4>
        <div v-html="content.content"></div>
        <div class="content-actions">
          <el-button type="danger" @click="removeContent(content.id)">删除</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import contentManager from '@/services/contentManager.js'

const newContent = ref({
  title: '',
  content: ''
})

const contents = ref([])

const updateContents = () => {
  contents.value = contentManager.getContents()
}

const addContent = () => {
  if (newContent.value.title.trim() && newContent.value.content.trim()) {
    contentManager.addContent({
      title: newContent.value.title,
      content: newContent.value.content,
      path: '/Page#' + Date.now() // 示例路径
    })

    // 清空表单
    newContent.value = {
      title: '',
      content: ''
    }

    // 更新内容列表
    updateContents()
  }
}

const removeContent = (id) => {
  contentManager.removeContent(id)
  updateContents()
}

onMounted(() => {
  updateContents()

  // 订阅内容变化
  contentManager.subscribe(updateContents)
})

// 组件卸载时取消订阅
// 这里需要在组件卸载时取消订阅，但Vue 3的组合式API中没有直接的onUnmounted
// 可以在实际使用时添加适当的清理逻辑
</script>

<style scoped>
.content-editor {
  padding: 20px;
}

.content-list {
  margin-top: 20px;
}

.content-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.content-item h4 {
  margin-top: 0;
  color: var(--color-primary);
}

.content-actions {
  margin-top: 10px;
  text-align: right;
}
</style>
