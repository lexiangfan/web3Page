<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import pageContents from '@/utils/pageTemplate.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'


export default {
  name: 'pageTemplate',
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
