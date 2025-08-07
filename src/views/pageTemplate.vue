<!--页面模板-->
<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import { ref } from 'vue'
import pageTemplate from "@/utils/pageTemplate.js";
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'

export default {
  name: 'PageTemplate',
  components: {
    ContentPageTemplate
  },
  setup() {
    // 如果需要对内容进行特殊处理，可以在这里进行
    const processedContents = ref(pageTemplate)

    return {
      pageTemplate: processedContents,
    }
  }
}
</script>

<style scoped>
/* 如果需要特定的样式覆盖，可以在这里添加 */
</style>
