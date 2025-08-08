<template>
  <div class="content-manager">
    <div class="content-actions">
      <el-button type="primary" @click="showAddForm = true">
        添加内容
      </el-button>
    </div>

    <el-dialog v-model="showAddForm" title="添加新内容" width="600px">
      <el-form :model="newContent" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="newContent.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
              v-model="newContent.content"
              type="textarea"
              :rows="6"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAddForm = false">取消</el-button>
          <el-button type="primary" @click="addContent">添加</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="content-list">
      <el-card
          v-for="content in contents"
          :key="content.id"
          class="content-card"
      >
        <template #header>
          <div class="card-header">
            <span>{{ content.title }}</span>
            <el-button
                type="danger"
                size="small"
                @click="removeContent(content.id)"
            >
              删除
            </el-button>
          </div>
        </template>
        <div v-html="content.content"></div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted} from 'vue'
import contentManager from '@/services/contentManager.js'
import searchService from "@/services/searchService.js";

export default {
  name: 'ContentManager',
  setup() {
    const showAddForm = ref(false)
    const contents = ref([])
    const newContent = ref({
      title: '',
      content: ''
    })

    const updateContents = () => {
      contents.value = contentManager.getContents()
    }

    const addContent = () => {
      if ((newContent.value.title || '').trim() && (newContent.value.content || '').trim()) {
        // 生成唯一ID（确保与现有内容不重复）
        const newItem = {
          id: 'custom-' + Date.now(),
          title: newContent.value.title,
          content: newContent.value.content
        }

        // 添加到内容管理
        contentManager.addContent(newItem);
        // 同时添加到搜索索引
        searchService.addContent(newItem);

        // 清空表单
        newContent.value = {
          title: '',
          content: ''
        }

        showAddForm.value = false
        updateContents()
      }
    }

    const removeContent = (id) => {
      contentManager.removeContent(id)
      updateContents()
    }

    onMounted(() => {
      updateContents()
    })

    return {
      showAddForm,
      contents,
      newContent,
      addContent,
      removeContent
    }
  }
}
</script>

<style scoped>
.content-manager {
  padding: 20px;
}

.content-actions {
  margin-bottom: 20px;
  text-align: right;
}

.content-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.content-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
