<!--页面模板-->
<template>
  <ContentPageTemplate :content-data="pageContents" />
</template>

<script>
//导入vue初始化 （不可删）
import {onMounted, ref} from 'vue'
// 页面内容数据 需要自己引入
import pageContents from '@/utils/page2.js'
//导入内容样式模板 （不可删）
import ContentPageTemplate from '@/components/ContentPageTemplate.vue'
//导入搜索引擎服务（不可删）
import searchService from "@/services/searchService.js";

export default {
  name: 'page2',
  components: {
    ContentPageTemplate
  },
  setup() {
    // 如果需要对内容进行特殊处理，可以在这里进行
    const processedContents = ref(pageContents)

    // 在组件挂载时将内容添加到搜索索引
    onMounted(() => {
      searchService.addContents(pageContents,'/page2')//这边是路径引用，需要修改
    })

    return {
      pageContents: processedContents
    }
  }
}
</script>

<style scoped>
/* 如果需要特定的样式覆盖，可以在这里添加 */
</style>
