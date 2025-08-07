<!-- src/views/page.vue -->
<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import {onMounted, ref} from 'vue'
import pageContents from '@/utils/page.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import searchService from "@/services/searchService.js";

export default {
  name: 'Page',
  components: {
    ContentPageTemplate
  },
  setup() {
    // 如果需要对内容进行特殊处理，可以在这里进行
    const processedContents = ref(pageContents)

    // 在组件挂载时将内容添加到搜索索引
    onMounted(() => {
      searchService.addContents(pageContents,'/Page')
    })

    return {
      pageContents: processedContents
    }
  }
}
</script>

<style scoped>
/* 如果需要特定的样式覆盖，可以在这里添加 */
</style>
