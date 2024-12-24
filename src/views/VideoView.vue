<template>
  <div class="video-view">
    <video ref="videoPlayer" autoplay playsinline></video>
    <div class="controls">
      <button @click="startStream" :disabled="isStreaming">开始</button>
      <button @click="stopStream" :disabled="!isStreaming">停止</button>
    </div>
  </div>
</template>

<script>
import { Peer, WebSocketTransport } from 'protoo-client';
import * as mediasoupClient from 'mediasoup-client';

export default {
  name: 'VideoView',
  data() {
    return {
      isStreaming: false,
      device: null,
      transport: null,
      consumer: null,
      protoo: null,
      serverUrl: 'wss://flashms.zongmutech.com:4443',
      roomId: 'channel__LCTCDBDCXRJ000196__group'
    }
  },
  computed: {
    protooUrl() {
      const peerId = Math.random().toString(36).substring(7);
      return `${this.serverUrl}/?roomId=${this.roomId}&peerId=${peerId}`;
    }
  },
  methods: {
    async startStream() {
      if (this.isStreaming) return;
      
      try {
        await this.connectProtoo();
        await this.initializeDevice();
        this.isStreaming = true;
      } catch (error) {
        console.error('启动流失败:', error);
        this.stopStream();
      }
    },

    stopStream() {
      if (this.consumer) {
        this.consumer.close();
        this.consumer = null;
      }

      if (this.$refs.videoPlayer.srcObject) {
        this.$refs.videoPlayer.srcObject.getTracks().forEach(track => track.stop());
        this.$refs.videoPlayer.srcObject = null;
      }

      if (this.protoo) {
        this.protoo.close();
        this.protoo = null;
      }

      this.isStreaming = false;
    },

    connectProtoo() {
      return new Promise((resolve, reject) => {
        const transport = new WebSocketTransport(this.protooUrl);
        this.protoo = new Peer(transport);

        this.protoo.on('open', () => {
          console.log('Protoo 连接已建立');
          resolve();
        });

        this.protoo.on('close', () => {
          console.log('Protoo 连接已关闭');
          this.stopStream();
        });

        this.protoo.on('failed', (error) => {
          console.error('Protoo 连接失败:', error);
          reject(error);
        });

        this.protoo.on('disconnected', () => {
          console.log('Protoo 连接断开');
          this.stopStream();
        });

        this.protoo.on('request', this.handleRequest);
        this.protoo.on('notification', this.handleNotification);

        // 设置连接超时
        setTimeout(() => {
          if (!this.isStreaming) {
            reject(new Error('连接超时'));
          }
        }, 10000);
      });
    },

    async initializeDevice() {
      try {
        this.device = new mediasoupClient.Device();
        
        const routerRtpCapabilities = await this.protoo.request('getRouterRtpCapabilities');
        await this.device.load({ routerRtpCapabilities });

        const transportInfo = await this.protoo.request('createWebRtcTransport', {
          forceTcp: false,
          producing: false,
          consuming: true
        });

        this.transport = this.device.createRecvTransport({
          id: transportInfo.id,
          iceParameters: transportInfo.iceParameters,
          iceCandidates: transportInfo.iceCandidates,
          dtlsParameters: transportInfo.dtlsParameters
        });

        this.transport.on('connect', ({ dtlsParameters }, callback, errback) => {
          this.protoo.request('connectWebRtcTransport', {
            transportId: this.transport.id,
            dtlsParameters
          })
          .then(callback)
          .catch(errback);
        });

        await this.protoo.request('join', {
          displayName: 'Consumer_' + Math.random().toString(36).substring(7),
          device: {
            name: 'Chrome',
            version: '89.0.4389.82'
          },
          rtpCapabilities: this.device.rtpCapabilities
        });

      } catch (error) {
        console.error('初始化设备失败:', error);
        throw error;
      }
    },

    async handleRequest(request, accept, reject) {
      try {
        switch (request.method) {
          case 'newConsumer': {
            const {
              peerId,
              producerId,
              id,
              kind,
              rtpParameters,
              type,
              appData,
              producerPaused
            } = request.data;

            this.consumer = await this.transport.consume({
              id,
              producerId,
              kind,
              rtpParameters
            });

            const stream = new MediaStream([this.consumer.track]);
            this.$refs.videoPlayer.srcObject = stream;

            accept();

            await this.protoo.request('resumeConsumer', { 
              consumerId: this.consumer.id 
            });
            break;
          }
          default:
            accept();
        }
      } catch (error) {
        console.error('处理请求失败:', error);
        reject(error);
      }
    },

    handleNotification(notification) {
      console.log('收到通知:', notification);
    }
  },

  beforeDestroy() {
    this.stopStream();
  }
}
</script>

<style scoped>
.video-view {
  width: 100%;
  height: 100%;
  position: relative;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1;
}

button {
  margin: 0 5px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: rgba(0, 0, 0, 0.8);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 