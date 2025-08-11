<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
import pageContents from '@/utils/about.js'
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'


export default {
  name: 'about',
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
