<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import {onMounted, ref} from 'vue'
import pageContents from '@/utils/page2.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import searchService from "@/services/searchService.js"

export default {
  name: 'page2',
  components: {
    ContentPageTemplate
  },
  setup() {
    const processedContents = ref(pageContents)

    // 在组件挂载时将内容添加到搜索索引
    onMounted(() => {
      // 使用统一的路径格式
      searchService.addContents(pageContents, '/page2','内容第三章')
    })

    return {
      pageContents: processedContents
    }
  }
}
</script>


<style scoped>

</style>
