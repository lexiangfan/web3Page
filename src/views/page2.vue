<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import pageContents from '@/utils/page2.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'


export default {
  name: 'page2',
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
