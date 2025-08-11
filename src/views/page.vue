<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import pageContents from '@/utils/page.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'


export default {
  name: 'page',
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
