<template>
  <div class="home-container">
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge animate__animated animate__fadeInUp">
          <span class="badge-text">Web3新手小白手册</span>
        </div>
        <h1 class="hero-title">
          <span class="title-line animate__animated animate__fadeInUp" data-animate-delay="200">
            新手入门必备
          </span>
          <span class="title-line gradient-text animate__animated animate__fadeInUp" data-animate-delay="400">
            web3世界手册
          </span>
        </h1>
        <p class="hero-description animate__animated animate__fadeInUp" data-animate-delay="600">
          区块链基础，新手学习平台。
          掌握未来科技，开启数字新纪元。
        </p>
        <div class="hero-actions animate__animated animate__fadeInUp" data-animate-delay="800">
          <el-button
              type="primary"
              size="large"
              @click="startLearning"
              class="primary-button"
          >
            开始学习
            <el-icon class="button-icon"><ArrowRight /></el-icon>
          </el-button>
          <el-button
              size="large"
              class="secondary-button"
              @click="goToImKey"
          >
            查看官网
          </el-button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="visual-container">
          <div class="cube-wrapper animate__animated animate__zoomIn" data-animate-delay="1000">
            <div class="cube">
              <div class="cube-face front"></div>
              <div class="cube-face back"></div>
              <div class="cube-face right"></div>
              <div class="cube-face left"></div>
              <div class="cube-face top"></div>
              <div class="cube-face bottom"></div>
            </div>
          </div>
          <div class="floating-elements">
            <div class="floating-element element-1 animate__animated animate__zoomIn" data-animate-delay="1200"></div>
            <div class="floating-element element-2 animate__animated animate__zoomIn" data-animate-delay="1400"></div>
            <div class="floating-element element-3 animate__animated animate__zoomIn" data-animate-delay="1600"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
<!--    <section class="stats-section">-->
<!--      <div class="stats-container">-->
<!--        <div-->
<!--            v-for="(stat, index) in stats"-->
<!--            :key="index"-->
<!--            class="stat-item animate__animated animate__fadeInUp"-->
<!--            :data-animate-delay="index * 200"-->
<!--        >-->
<!--          <div class="stat-number">{{ stat.number }}</div>-->
<!--          <div class="stat-label">{{ stat.label }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->

    <section class="features-section">
      <div class="section-header">
        <h2>为什么选择我们</h2>
        <p>为您提供最全面的 Web3 学习体验</p>
      </div>
      <div class="features-grid">
        <div
            v-for="(feature, index) in features"
            :key="index"
            class="feature-card animate__animated animate__fadeInUp"
            :data-animate-delay="index * 200"
        >
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router/router'
import { ArrowRight } from '@element-plus/icons-vue'

// const stats = ref([
//   { number: '50+', label: '课程模块' },
//   { number: '1000+', label: '学习者' },
//   { number: '50+', label: '实战项目' },
//   { number: '24/7', label: '技术支持' }
// ])

const features = ref([
  {
    icon: 'el-icon-lock',
    title: '去中心化',
    description: '理解区块链去中心化原理和应用场景'
  },
  {
    icon: 'el-icon-document',
    title: '智能合约',
    description: '基础的智能合约开发教程'
  },
  {
    icon: 'el-icon-wallet',
    title: '钱包集成',
    description: '学习如何集成主流加密货币钱包'
  },
  {
    icon: 'el-icon-network',
    title: '网络协议',
    description: '学习各种区块链网络协议和标准'
  }
])

const startLearning = () => {
  router.push('/page')
}

const goToImKey = () => {
  window.open('https://imkey.im', '_blank')
}
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #f0f4f8 0%, #e6f0ff 100%);
  min-height: calc(100vh - var(--navbar-height));
  overflow-x: hidden;
}

.hero-section {
  display: flex;
  align-items: center;
  padding: 100px 24px 60px;
  max-width: 1400px;
  margin: 0 auto;
  gap: 80px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-badge {
  display: inline-block;
  background: linear-gradient(135deg, #4f46e5 0%, #3a5bed 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 50px;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(124, 58, 237, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
  }
}

.hero-title {
  font-size: 60px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #0f172a;
}

.title-line {
  display: block;
}

.gradient-text {
  background: linear-gradient(135deg, #4f46e5 0%, #3a5bed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-top: 40px;
}

.primary-button {
  background: linear-gradient(135deg, #4f46e5 0%, #3a5bed 100%) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 18px 32px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: white !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.primary-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
}

.button-icon {
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.primary-button:hover .button-icon {
  transform: translateX(3px);
}

.secondary-button {
  border: 2px solid #cbd5e1 !important;
  border-radius: 12px !important;
  padding: 18px 32px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #475569 !important;
  background: white !important;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  border-color: #3a5bed !important;
  color: #3a5bed !important;
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.hero-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.visual-container {
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cube-wrapper {
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

.cube {
  position: relative;
  width: 150px;
  height: 150px;
  transform-style: preserve-3d;
  animation: rotateCube 20s infinite linear;
}

@keyframes rotateCube {
  0% {
    transform: rotateX(0) rotateY(0) rotateZ(0);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.cube-face {
  position: absolute;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgb(58, 91, 237) 100%);
  border: 2px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  box-shadow: 0 0 20px rgba(79, 70, 229, 0.5);
}

.cube-face.front {
  transform: translateZ(75px);
}

.cube-face.back {
  transform: rotateY(180deg) translateZ(75px);
}

.cube-face.right {
  transform: rotateY(90deg) translateZ(75px);
}

.cube-face.left {
  transform: rotateY(-90deg) translateZ(75px);
}

.cube-face.top {
  transform: rotateX(90deg) translateZ(75px);
}

.cube-face.bottom {
  transform: rotateX(-90deg) translateZ(75px);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.floating-element {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #3a5bed);
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

.stats-section {
  padding: 80px 24px;
  background: white;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
}

.stats-container {
  display: flex;
  justify-content: space-around;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  gap: 30px;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 200px;
}

.stat-number {
  font-size: 48px;
  font-weight: 800;
  color: #3a5bed;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #4f46e5 0%, #3a5bed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 18px;
  color: #64748b;
  font-weight: 500;
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
  border: 1px solid var(--color-border);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  border-color: #3a5bed;
}

.feature-icon {
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 50%;
  font-size: 32px;
  color: #3a5bed;
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

@media (max-width: 992px) {
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 80px 24px 60px;
  }

  .hero-content {
    max-width: 100%;
    width: 100%;
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
  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-section {
    padding: 60px 20px 40px;
    gap: 50px;
  }

  .hero-actions {
    justify-content: center;
    width: 100%;
    display: flex;
  }

  .hero-content {
    text-align: center;
    max-width: 100%;
    padding: 0 20px;
    width: 100%;
  }

  .hero-badge {
    margin-left: auto;
    margin-right: auto;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-description {
    font-size: 16px;
    padding: 0 10px;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    padding: 16px 24px !important;
    font-size: 16px !important;
  }

  .hero-visual {
    height: 250px;
  }

  .visual-container {
    width: 300px;
    height: 300px;
  }

  .cube {
    width: 120px;
    height: 120px;
  }

  .cube-face {
    width: 120px;
    height: 120px;
  }

  .cube-face.front {
    transform: translateZ(60px);
  }

  .cube-face.back {
    transform: rotateY(180deg) translateZ(60px);
  }

  .cube-face.right {
    transform: rotateY(90deg) translateZ(60px);
  }

  .cube-face.left {
    transform: rotateY(-90deg) translateZ(60px);
  }

  .cube-face.top {
    transform: rotateX(90deg) translateZ(60px);
  }

  .cube-face.bottom {
    transform: rotateX(-90deg) translateZ(60px);
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
    padding: 40px 15px;
    gap: 30px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-description {
    font-size: 14px;
  }

  .hero-badge {
    padding: 4px 12px;
    font-size: 12px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 32px;
    margin-bottom: 16px;
  }

  .hero-description {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .primary-button,
  .secondary-button {
    padding: 14px 20px !important;
    font-size: 14px !important;
    width: 100%;
    margin-left: auto !important;
  }

  .hero-visual {
    height: 200px;
  }

  .visual-container {
    width: 250px;
    height: 250px;
  }

  .cube {
    width: 100px;
    height: 100px;
  }

  .cube-face {
    width: 100px;
    height: 100px;
  }

  .cube-face.front {
    transform: translateZ(50px);
  }

  .cube-face.back {
    transform: rotateY(180deg) translateZ(50px);
  }

  .cube-face.right {
    transform: rotateY(90deg) translateZ(50px);
  }

  .cube-face.left {
    transform: rotateY(-90deg) translateZ(50px);
  }

  .cube-face.top {
    transform: rotateX(90deg) translateZ(50px);
  }

  .cube-face.bottom {
    transform: rotateX(-90deg) translateZ(50px);
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

  .features-grid {
    gap: 16px;
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
