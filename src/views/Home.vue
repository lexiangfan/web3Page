<!-- src/views/Home.vue -->
<template>
  <div class="container" @mousemove="handleMouseMove">
    <div class="content">
      <h1 class="title" ref="title">WEB3入门必看</h1>
      <div class="button-container">
        <RouterLink to="/Page">
          <button class="action-button">
            开始探索
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    handleMouseMove(event) {
      const title = this.$refs.title;
      const container = event.currentTarget;

      // 获取容器中心点坐标
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const centerY = containerRect.top + containerRect.height / 2;

      // 计算鼠标相对于中心点的位置
      const mouseX = event.clientX - centerX;
      const mouseY = event.clientY - centerY;

      // 计算旋转角度（可以根据需要调整系数来控制敏感度）
      const rotateX = -(mouseY / containerRect.height) * 30; // 围绕X轴旋转
      const rotateY = (mouseX / containerRect.width) * 30;   // 围绕Y轴旋转

      // 应用3D变换
      title.style.transform = `scale(1.5) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--navbar-height));
  width: 100%;
  perspective: 1000px;
  position: relative;
  overflow: hidden;
}

/* 添加边缘模糊效果 */
.container::before {
  content: '';
  position: absolute;
  top: -50px;
  left: -50px;
  right: -50px;
  bottom: -50px;
  background: var(--color-gradient);
  background-size: cover;
  background-position: center;
  z-index: -1;
  filter: blur(20px);
  transform: scale(1.1);
}

.content {
  text-align: center;
  margin-top: -100px;
  position: relative;
  z-index: 0;
  padding: 0 20px; /* 添加内边距防止内容贴边 */
  box-sizing: border-box;
}

.title {
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.7);
  transform: scale(1.5);
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
  letter-spacing: 2px;
  word-break: break-word; /* 防止长文本溢出 */
}

.button-container {
  margin-top: 2rem;
}

.action-button {
  background: linear-gradient(135deg, #2193b0 0%, #4facfe 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
  min-width: 200px; /* 设置最小宽度 */
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #1a7a99 0%, #3a8cce 100%);
}

.action-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .content {
    margin-top: -50px;
    padding: 0 15px;
  }

  .title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .action-button {
    padding: 12px 30px;
    font-size: 1rem;
    min-width: 160px;
  }
}

@media (max-width: 480px) {
  .content {
    margin-top: -30px;
    padding: 0 10px;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 0.8rem;
    letter-spacing: 1px;
  }

  .action-button {
    padding: 10px 25px;
    font-size: 0.9rem;
    min-width: 140px;
  }
}

/* 超大屏幕适配 */
@media (min-width: 1200px) {
  .title {
    font-size: 5rem;
  }

  .action-button {
    padding: 18px 45px;
    font-size: 1.3rem;
  }
}

/* 高度较小的屏幕适配 */
@media (max-height: 600px) {
  .content {
    margin-top: 0;
  }

  .title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .action-button {
    padding: 10px 25px;
    font-size: 1rem;
  }
}
</style>
