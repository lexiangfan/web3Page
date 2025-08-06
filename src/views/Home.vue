<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Web3 入门指南</h1>
        <p class="hero-subtitle">从基础概念到实战应用，一站式学习平台</p>
        <div class="hero-actions">
          <el-button
              type="primary"
              size="large"
              @click="startLearning"
              class="cta-button"
          >
            开始学习
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
          <el-button
              size="large"
              @click="viewDocs"
              class="docs-button"
          >
            查看文档
          </el-button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-element element-1"></div>
        <div class="visual-element element-2"></div>
        <div class="visual-element element-3"></div>
      </div>
    </div>

    <div class="features-section">
      <div class="section-header">
        <h2>为什么选择我们</h2>
        <p>为您提供最全面的 Web3 学习体验</p>
      </div>
<!--      <div class="features-grid">-->
<!--        <div-->
<!--            v-for="(feature, index) in features"-->
<!--            :key="index"-->
<!--            class="feature-card"-->
<!--        >-->
<!--          <div class="feature-icon">-->
<!--            <i :class="feature.icon"></i>-->
<!--          </div>-->
<!--          <h3 class="feature-title">{{ feature.title }}</h3>-->
<!--          <p class="feature-description">{{ feature.description }}</p>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import router from '@/router/router'

// const features = ref([
//   {
//     icon: 'el-icon-lock',
//     title: '去中心化',
//     description: '深入理解区块链去中心化原理和应用场景'
//   },
//   {
//     icon: 'el-icon-document',
//     title: '智能合约',
//     description: '从基础到高级的智能合约开发教程'
//   },
//   {
//     icon: 'el-icon-wallet',
//     title: '钱包集成',
//     description: '学习如何集成主流加密货币钱包'
//   },
//   {
//     icon: 'el-icon-network',
//     title: '网络协议',
//     description: '掌握各种区块链网络协议和标准'
//   }
// ])

const startLearning = () => {
  router.push('/Page')
}

const viewDocs = () => {
  // 可以跳转到文档页面
  console.log('查看文档')
}
</script>

<style scoped>
.home-container {
  background-color: var(--color-background);
  min-height: calc(100vh - var(--navbar-height));
}

.hero-section {
  display: flex;
  align-items: center;
  padding: 80px 24px;
  max-width: 1400px;
  margin: 0 auto;
  gap: 60px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: var(--font-size-xxxl);
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-secondary);
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 40px;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.cta-button {
  background: var(--color-primary) !important;
  border: none !important;
  border-radius: var(--border-radius-large) !important;
  padding: 16px 32px !important;
  font-size: var(--font-size-base) !important;
  font-weight: 600 !important;
  transition: var(--transition-base);
}

.cta-button:hover {
  background: var(--color-primary-dark) !important;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover) !important;
}

.docs-button {
  border: 1px solid var(--color-border) !important;
  border-radius: var(--border-radius-large) !important;
  padding: 16px 32px !important;
  font-size: var(--font-size-base) !important;
  font-weight: 600 !important;
  color: var(--color-text) !important;
  background: var(--color-background) !important;
  transition: var(--transition-base);
}

.docs-button:hover {
  border-color: var(--color-primary) !important;
  color: var(--color-primary) !important;
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover) !important;
}

.hero-visual {
  flex: 1;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  opacity: 0.1;
  filter: blur(20px);
}

.element-1 {
  width: 200px;
  height: 200px;
  top: 20%;
  left: 20%;
  animation: float 8s infinite ease-in-out;
}

.element-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation: float 8s infinite ease-in-out 1s;
}

.element-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 50%;
  animation: float 8s infinite ease-in-out 2s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, 10px);
  }
}

.features-section {
  padding: 80px 24px;
  max-width: 1400px;
  margin: 0 auto;
  background-color: var(--color-surface);
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: var(--font-size-xxl);
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 16px;
}

.section-header p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.feature-card {
  background: var(--color-background);
  border-radius: var(--border-radius-large);
  padding: 40px 32px;
  text-align: center;
  box-shadow: var(--shadow-base);
  transition: var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.feature-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: var(--color-surface);
  border-radius: 50%;
  font-size: 32px;
  color: var(--color-primary);
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-secondary);
  margin-bottom: 16px;
}

.feature-description {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 60px 24px;
  }

  .hero-content {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-visual {
    width: 100%;
    height: 300px;
  }

  .features-section {
    padding: 60px 24px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: calc(100vh - var(--navbar-height));
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .content {
    min-height: calc(100vh - var(--navbar-height));
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 15px;
    margin-top: 0;
  }

  .hero-title {
    font-size: 32px;
    margin-bottom: 20px;
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
    margin-bottom: 30px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 12px;
  }

  .cta-button,
  .docs-button {
    width: 100%;
    padding: 14px 24px !important;
    font-size: var(--font-size-base) !important;
  }

  .hero-visual {
    height: 250px;
  }

  .element-1 {
    width: 150px;
    height: 150px;
  }

  .element-2 {
    width: 120px;
    height: 120px;
  }

  .element-3 {
    width: 80px;
    height: 80px;
  }

  .features-section {
    padding: 40px 20px;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .section-header h2 {
    font-size: var(--font-size-xl);
    margin-bottom: 12px;
  }

  .section-header p {
    font-size: var(--font-size-base);
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 30px 24px;
  }

  .feature-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
    font-size: 24px;
  }

  .feature-title {
    font-size: var(--font-size-lg);
    margin-bottom: 12px;
  }

  .feature-description {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 576px) {
  .hero-section {
    padding: 30px 15px;
    min-height: calc(100vh - var(--navbar-height));
  }

  .content {
    padding: 0 10px;
  }

  .hero-title {
    font-size: 28px;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: var(--font-size-sm);
    margin-bottom: 24px;
  }

  .cta-button,
  .docs-button {
    padding: 12px 20px !important;
    font-size: var(--font-size-sm) !important;
  }

  .hero-visual {
    height: 200px;
  }

  .element-1 {
    width: 120px;
    height: 120px;
  }

  .element-2 {
    width: 100px;
    height: 100px;
  }

  .element-3 {
    width: 60px;
    height: 60px;
  }

  .features-section {
    padding: 30px 16px;
  }

  .section-header {
    margin-bottom: 30px;
  }

  .section-header h2 {
    font-size: var(--font-size-lg);
  }

  .section-header p {
    font-size: var(--font-size-sm);
  }

  .feature-card {
    padding: 24px 20px;
  }

  .feature-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .feature-title {
    font-size: var(--font-size-base);
  }

  .feature-description {
    font-size: var(--font-size-sm);
  }
}
</style>
