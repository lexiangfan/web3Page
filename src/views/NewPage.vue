<!-- src/views/NewPage.vue -->
<template>
  <ContentPageTemplate :content-data="newPageContents" />
</template>

<script>
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import newPageContents from '@/utils/newPageContent.js'
import searchService from "@/services/searchService.js";
import { onMounted } from "vue";

export default {
  name: 'NewPage',
  components: {
    ContentPageTemplate
  },
  setup() {
    onMounted(() => {
      searchService.addContents(newPageContents)
    })
    return {
      newPageContents
    }
  }
}
</script>

<style scoped>
/* 如果需要特定的样式覆盖，可以在这里添加 */
</style>
