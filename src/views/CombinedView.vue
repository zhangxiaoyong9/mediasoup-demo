<template>
  <div class="combined-view">
    <BaseVideoPlayer camera-type="combined" />
  </div>
</template>

<script>
import BaseVideoPlayer from '@/components/BaseVideoPlayer.vue'

export default {
  name: 'CombinedView',
  components: {
    BaseVideoPlayer
  }
}
</script>

<style scoped>
.combined-view {
  width: 100%;
  height: 100%;
}
</style> 