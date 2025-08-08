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
    const processedContents = ref(pageContents)
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

</style>
