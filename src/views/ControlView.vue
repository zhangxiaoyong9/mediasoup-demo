<template>
  <div class="control-view">
    <div class="control-grid">
      <button class="control-btn" @click="startRecording" :disabled="isRecording">
        <span class="icon">⏺</span>
        <span class="text">开始录制</span>
      </button>
      <button class="control-btn" @click="stopRecording" :disabled="!isRecording">
        <span class="icon">⏹</span>
        <span class="text">停止录制</span>
      </button>
      <button class="control-btn" @click="takeSnapshot">
        <span class="icon">📸</span>
        <span class="text">拍照</span>
      </button>
      <button class="control-btn" @click="toggleSettings">
        <span class="icon">⚙️</span>
        <span class="text">设置</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlView',
  data() {
    return {
      isRecording: false
    }
  },
  methods: {
    startRecording() {
      this.isRecording = true;
      // 实现录制逻辑
    },
    stopRecording() {
      this.isRecording = false;
      // 实现停止录制逻辑
    },
    takeSnapshot() {
      // 实现拍照逻辑
    },
    toggleSettings() {
      // 实现设置面板逻辑
    }
  }
}
</script>

<style scoped>
.control-view {
  width: 100%;
  height: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  height: 100%;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.text {
  font-size: 14px;
}
</style> 