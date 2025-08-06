<!-- src/views/NewPage.vue -->
<template>
  <ContentPageTemplate :content-data="newPageContents" />
</template>

<script>
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import newPageContents from '@/utils/newPageContent.js'

export default {
  name: 'NewPage',
  components: {
    ContentPageTemplate
  },
  setup() {
    return {
      newPageContents
    }
  }
}
</script>

<style scoped>
/* 如果需要特定的样式覆盖，可以在这里添加 */
</style>
