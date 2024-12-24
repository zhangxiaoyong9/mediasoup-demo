<template>
  <div class="video-page">
    <h1>视频流播放</h1>
    <div class="room-input" v-if="!roomId">
      <input 
        v-model="inputRoomId" 
        placeholder="请输入房间ID"
        @keyup.enter="handleJoinRoom"
      >
      <button @click="handleJoinRoom">加入房间</button>
    </div>
    <MediaSoupPlayer
      v-else
      :serverUrl="serverUrl"
      :roomId="roomId"
      :peerId="peerId"
      @connected="handleConnected"
      @disconnected="handleDisconnected"
      @error="handleError"
    />
  </div>
</template>

<script>
import MediaSoupPlayer from '@/components/MediaSoupPlayer.vue'

export default {
  name: 'VideoPage',
  
  components: {
    MediaSoupPlayer
  },
  
  data() {
    return {
      serverUrl: 'wss://flashms.zongmutech.com:4443',
      inputRoomId: '',
      roomId: '',
      peerId: this.generatePeerId()
    }
  },

  created() {
    // 从路由参数中获取roomId
    const { roomId } = this.$route.params;
    if (roomId) {
      this.roomId = roomId;
    }
  },
  
  methods: {
    generatePeerId() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    handleJoinRoom() {
      if (this.inputRoomId.trim()) {
        this.roomId = this.inputRoomId.trim();
        // 更新路由，但不重新加载页面
        this.$router.push({
          name: 'video',
          params: { roomId: this.roomId }
        }, { replace: true });
      }
    },

    handleConnected() {
      console.log('视频流连接成功');
      console.log('当前 PeerId:', this.peerId);
      console.log('当前 RoomId:', this.roomId);
    },
    
    handleDisconnected() {
      console.log('视频流连接断开');
      // 断开连接时清除房间ID
      this.roomId = '';
      this.inputRoomId = '';
      // 更新路由
      this.$router.push({ name: 'video' }, { replace: true });
    },
    
    handleError(error) {
      console.error('发生错误:', error);
      // 发生错误时也清除房间ID
      this.roomId = '';
      this.inputRoomId = '';
      // 更新路由
      this.$router.push({ name: 'video' }, { replace: true });
    }
  }
}
</script>

<style scoped>
.video-page {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.room-input {
  text-align: center;
  margin: 20px 0;
}

.room-input input {
  padding: 8px 12px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.room-input button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.room-input button:hover {
  background-color: #45a049;
}
</style> 