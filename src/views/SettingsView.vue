<template>
  <div class="settings-view">
    <div class="settings-container">
      <h1>视频流设置</h1>
      
      <div class="form-group">
        <label>房间号</label>
        <input 
          v-model="roomId" 
          type="text" 
          placeholder="请输入房间号"
          @input="updateRoomId"
        >
      </div>

      <div class="form-group">
        <label>视图模式</label>
        <select v-model="viewMode">
          <option value="combined">组合视图（原画面）</option>
          <option value="front">前置摄像头</option>
          <option value="back">后置摄像头</option>
          <option value="left">左侧摄像头</option>
          <option value="right">右侧摄像头</option>
        </select>
      </div>

      <button 
        class="start-button" 
        @click="startViewing" 
        :disabled="!roomId"
      >
        开始观看
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  
  data() {
    return {
      roomId: '',
      viewMode: 'combined'
    }
  },

  methods: {
    updateRoomId(event) {
      // 移除所有空格
      this.roomId = event.target.value.replace(/\s/g, '');
    },

    startViewing() {
      if (!this.roomId) return;
      
      // 存储设置到 localStorage
      localStorage.setItem('roomId', this.roomId);
      
      // 根据选择的模式跳转到相应页面
      if (this.viewMode === 'combined') {
        this.$router.push('/combined');
      } else {
        this.$router.push(`/${this.viewMode}`);
      }
    }
  },

  created() {
    // 从 localStorage 加载上次的房间号
    const savedRoomId = localStorage.getItem('roomId');
    if (savedRoomId) {
      this.roomId = savedRoomId;
    }
  }
}
</script>

<style scoped>
.settings-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #000;
  padding: 20px;
}

.settings-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
}

h1 {
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  color: white;
  margin-bottom: 8px;
  font-size: 16px;
}

input, select {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

select {
  cursor: pointer;
}

option {
  background: #1a1a1a;
  color: white;
}

.start-button {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background: #45a049;
}

.start-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style> 