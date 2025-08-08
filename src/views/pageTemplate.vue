<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import {onMounted, ref} from 'vue'
import pageContents from '@/utils/pageTemplate.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import searchService from "@/services/searchService.js"

export default {
  name: 'pageTemplate',
  components: {
    ContentPageTemplate
  },
  setup() {
    const processedContents = ref(pageContents)

    // 在组件挂载时将内容添加到搜索索引
    onMounted(() => {
      // 使用统一的路径格式
      searchService.addContents(pageContents, '/pageTemplate', '页面标题')
    })

    return {
      pageContents: processedContents
    }
  }
}
</script>


<style scoped>

</style>
