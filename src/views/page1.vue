<template>
  <ContentPageTemplate :content-data="newPageContent" />
</template>

<script>
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import newPageContent from '@/utils/page1.js'
import searchService from "@/services/searchService.js";
import { onMounted,ref } from "vue";

export default {
  name: 'page1',
  components: {
    ContentPageTemplate
  },
  setup() {
    const newPageContents = ref(newPageContent)
    onMounted(() => {
      searchService.addContents(newPageContents,'/page1','内容第二章')
    })
    return {
      newPageContent: newPageContents
    }
  }
}
</script>

<style scoped>

</style>
