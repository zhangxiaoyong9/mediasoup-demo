import { createStore } from 'vuex'
import { Peer, WebSocketTransport } from 'protoo-client'
import * as mediasoupClient from 'mediasoup-client'

export default createStore({
  state: {
    isStreaming: false,
    device: null,
    transport: null,
    consumer: null,
    protoo: null,
    stream: null,
    serverUrl: process.env.VUE_APP_SERVER_URL || 'ws://localhost:8000',
    roomId: localStorage.getItem('roomId') || ''
  },

  mutations: {
    setIsStreaming(state, value) {
      state.isStreaming = value;
    },
    setDevice(state, device) {
      state.device = device;
    },
    setTransport(state, transport) {
      state.transport = transport;
    },
    setConsumer(state, consumer) {
      state.consumer = consumer;
    },
    setProtoo(state, protoo) {
      state.protoo = protoo;
    },
    setStream(state, stream) {
      state.stream = stream;
    },
    setRoomId(state, roomId) {
      state.roomId = roomId;
      localStorage.setItem('roomId', roomId);
    }
  },

  actions: {
    async startStream({ state, commit }) {
      if (state.isStreaming) return;

      try {
        // 连接 Protoo
        const peerId = Math.random().toString(36).substring(7);
        const protooUrl = `${state.serverUrl}/?roomId=${state.roomId}&peerId=${peerId}&camera=combined`;
        
        const transport = new WebSocketTransport(protooUrl);
        const protoo = new Peer(transport);

        await new Promise((resolve, reject) => {
          protoo.on('open', () => {
            console.log('Protoo 连接已建立');
            resolve();
          });

          protoo.on('failed', (error) => {
            console.error('Protoo 连接失败:', error);
            reject(error);
          });

          protoo.on('disconnected', () => {
            console.log('Protoo 连接断开');
            this.dispatch('stopStream');
          });

          protoo.on('close', () => {
            console.log('Protoo 连接已关闭');
            this.dispatch('stopStream');
          });

          setTimeout(() => {
            if (!state.isStreaming) {
              reject(new Error('连接超时'));
            }
          }, 10000);
        });

        commit('setProtoo', protoo);

        // 初始化设备
        const device = new mediasoupClient.Device();
        const routerRtpCapabilities = await protoo.request('getRouterRtpCapabilities');
        await device.load({ routerRtpCapabilities });
        commit('setDevice', device);

        // 创建传输
        const transportInfo = await protoo.request('createWebRtcTransport', {
          forceTcp: false,
          producing: false,
          consuming: true
        });

        const recvTransport = device.createRecvTransport({
          id: transportInfo.id,
          iceParameters: transportInfo.iceParameters,
          iceCandidates: transportInfo.iceCandidates,
          dtlsParameters: transportInfo.dtlsParameters
        });

        recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
          protoo.request('connectWebRtcTransport', {
            transportId: recvTransport.id,
            dtlsParameters
          })
          .then(callback)
          .catch(errback);
        });

        commit('setTransport', recvTransport);

        // 加入房间
        await protoo.request('join', {
          displayName: `Consumer_${Math.random().toString(36).substring(7)}`,
          device: {
            name: 'Chrome',
            version: '89.0.4389.82'
          },
          rtpCapabilities: device.rtpCapabilities
        });

        // 处理新的消费者
        protoo.on('request', async (request, accept, reject) => {
          try {
            if (request.method === 'newConsumer') {
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

              const consumer = await recvTransport.consume({
                id,
                producerId,
                kind,
                rtpParameters
              });

              const stream = new MediaStream([consumer.track]);
              commit('setConsumer', consumer);
              commit('setStream', stream);

              accept();

              await protoo.request('resumeConsumer', { 
                consumerId: consumer.id 
              });
            } else {
              accept();
            }
          } catch (error) {
            console.error('处理请求失败:', error);
            reject(error);
          }
        });

        commit('setIsStreaming', true);
      } catch (error) {
        console.error('启动流失败:', error);
        this.dispatch('stopStream');
        throw error;
      }
    },

    stopStream({ state, commit }) {
      if (state.consumer) {
        state.consumer.close();
        commit('setConsumer', null);
      }

      if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
        commit('setStream', null);
      }

      if (state.protoo) {
        state.protoo.close();
        commit('setProtoo', null);
      }

      if (state.transport) {
        state.transport.close();
        commit('setTransport', null);
      }

      commit('setDevice', null);
      commit('setIsStreaming', false);
    }
  }
}) 