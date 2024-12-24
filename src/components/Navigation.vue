<template>
  <nav class="navigation" v-if="!isSettingsPage">
    <router-link to="/front" class="nav-link">前置摄像头</router-link>
    <router-link to="/back" class="nav-link">后置摄像头</router-link>
    <router-link to="/left" class="nav-link">左侧摄像头</router-link>
    <router-link to="/right" class="nav-link">右侧摄像头</router-link>
    <router-link to="/combined" class="nav-link">组合视图</router-link>
    <router-link to="/" class="nav-link settings-link">设置</router-link>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  computed: {
    isSettingsPage() {
      return this.$route.path === '/';
    }
  }
}
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  z-index: 100;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.settings-link {
  position: absolute;
  right: 20px;
}
</style> 