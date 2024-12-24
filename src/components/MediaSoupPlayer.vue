<template>
  <div class="video-container">
    <div class="video-grid">
      <div class="video-cell">
        <div class="video-title">实时视频</div>
        <router-view name="video"></router-view>
      </div>
      <div class="video-cell">
        <div class="video-title">历史记录</div>
        <router-view name="history"></router-view>
      </div>
      <div class="video-cell">
        <div class="video-title">设备状态</div>
        <router-view name="status"></router-view>
      </div>
      <div class="video-cell">
        <div class="video-title">控制面板</div>
        <router-view name="control"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaSoupPlayer'
}
</script>

<style scoped>
.video-container {
  width: 100%;
  max-width: 1200px;
  margin: 20px auto;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
  background: #000;
  padding: 10px;
  border-radius: 8px;
  aspect-ratio: 2/1;
}

.video-cell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #333;
  border-radius: 4px;
}

.video-title {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  z-index: 1;
  font-size: 14px;
}
</style> 