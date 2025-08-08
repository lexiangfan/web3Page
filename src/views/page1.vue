<template>
  <ContentPageTemplate :content-data="newPageContents" />
</template>

<script>
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
import newPageContents from '@/utils/page1.js'
import searchService from "@/services/searchService.js";
import { onMounted } from "vue";

export default {
  name: 'page1',
  components: {
    ContentPageTemplate
  },
  setup() {
    onMounted(() => {
      searchService.addContents(newPageContents,'/page1')
    })
    return {
      newPageContents
    }
  }
}
</script>

<style scoped>

</style>
