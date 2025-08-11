<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import pageContents from '@/utils/page1.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'


export default {
  name: 'page1',
  components: {
    ContentPageTemplate
  },
  setup() {
    return {
      pageContents
    }
  }
}
</script>


<style scoped>

</style>
