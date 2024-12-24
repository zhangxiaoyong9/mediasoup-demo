<template>
  <div class="status-view">
    <div class="status-grid">
      <div class="status-item">
        <div class="label">CPU使用率</div>
        <div class="value">{{ cpuUsage }}%</div>
        <div class="chart">
          <div class="bar" :style="{ width: cpuUsage + '%' }"></div>
        </div>
      </div>
      <div class="status-item">
        <div class="label">内存使用</div>
        <div class="value">{{ memoryUsage }}%</div>
        <div class="chart">
          <div class="bar" :style="{ width: memoryUsage + '%' }"></div>
        </div>
      </div>
      <div class="status-item">
        <div class="label">网络状态</div>
        <div class="value">{{ networkStatus }}</div>
      </div>
      <div class="status-item">
        <div class="label">运行时间</div>
        <div class="value">{{ uptime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusView',
  data() {
    return {
      cpuUsage: 45,
      memoryUsage: 60,
      networkStatus: '良好',
      uptime: '24小时36分'
    }
  }
}
</script>

<style scoped>
.status-view {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.status-item {
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.label {
  font-size: 12px;
  color: #888;
}

.value {
  font-size: 18px;
  margin: 5px 0;
}

.chart {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}
</style> 