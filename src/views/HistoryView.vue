<template>
  <div class="history-view">
    <div class="history-list">
      <div v-for="(record, index) in records" :key="index" class="history-item">
        <div class="time">{{ record.time }}</div>
        <div class="event">{{ record.event }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryView',
  data() {
    return {
      records: [
        { time: '2023-12-24 15:30', event: '设备启动' },
        { time: '2023-12-24 15:35', event: '开始录制' },
        { time: '2023-12-24 16:00', event: '停止录制' }
      ]
    }
  }
}
</script>

<style scoped>
.history-view {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.8);
}

.history-list {
  color: white;
}

.history-item {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.time {
  font-size: 12px;
  color: #888;
}

.event {
  margin-top: 4px;
}
</style> 