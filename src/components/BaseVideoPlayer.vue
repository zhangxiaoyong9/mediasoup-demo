<template>
  <div class="video-view">
    <div class="title">{{ getTitle }}</div>
    <div class="video-container">
      <video ref="videoPlayer" autoplay playsinline :style="videoStyle"></video>
      <div class="controls">
        <button @click="startStream" :disabled="isStreaming">开始</button>
        <button @click="stopStream" :disabled="!isStreaming">停止</button>
        <span class="status" :class="{ 'status-connected': isStreaming }">
          {{ isStreaming ? '已连接' : '未连接' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'BaseVideoPlayer',
  
  props: {
    cameraType: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapState(['isStreaming', 'stream']),
    
    getTitle() {
      const titles = {
        front: '前置摄像头',
        back: '后置摄像头',
        left: '左侧摄像头',
        right: '右侧摄像头',
        combined: '组合视图'
      };
      return titles[this.cameraType] || this.cameraType;
    },

    videoStyle() {
      if (this.cameraType === 'combined') {
        return {};
      }
      
      const styles = {
        front: {
          transform: 'scale(2)',
          transformOrigin: 'top left'
        },
        back: {
          transform: 'scale(2)',
          transformOrigin: 'bottom left'
        },
        left: {
          transform: 'scale(2)',
          transformOrigin: 'top right'
        },
        right: {
          transform: 'scale(2)',
          transformOrigin: 'bottom right'
        }
      };
      return styles[this.cameraType] || {};
    }
  },

  methods: {
    ...mapActions(['startStream', 'stopStream']),

    updateVideoStream() {
      if (this.stream && this.$refs.videoPlayer) {
        this.$refs.videoPlayer.srcObject = this.stream;
      }
    }
  },

  watch: {
    stream: {
      handler: 'updateVideoStream',
      immediate: true
    }
  },

  mounted() {
    if (!this.isStreaming) {
      this.startStream();
    } else {
      this.updateVideoStream();
    }
  }
}
</script>

<style scoped>
.video-view {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.title {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  text-align: center;
  font-size: 14px;
  z-index: 2;
}

.video-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
  position: absolute;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

button {
  padding: 5px 15px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  color: #ff4444;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 68, 68, 0.1);
}

.status-connected {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}
</style> 