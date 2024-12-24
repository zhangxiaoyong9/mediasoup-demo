import { createRouter, createWebHistory } from 'vue-router'
import SettingsView from '@/views/SettingsView.vue'
import FrontVideo from '@/views/video/FrontVideo.vue'
import BackVideo from '@/views/video/BackVideo.vue'
import LeftVideo from '@/views/video/LeftVideo.vue'
import RightVideo from '@/views/video/RightVideo.vue'
import CombinedView from '@/views/CombinedView.vue'

const routes = [
  {
    path: '/',
    name: 'Settings',
    component: SettingsView
  },
  {
    path: '/front',
    name: 'FrontVideo',
    component: FrontVideo
  },
  {
    path: '/back',
    name: 'BackVideo',
    component: BackVideo
  },
  {
    path: '/left',
    name: 'LeftVideo',
    component: LeftVideo
  },
  {
    path: '/right',
    name: 'RightVideo',
    component: RightVideo
  },
  {
    path: '/combined',
    name: 'CombinedView',
    component: CombinedView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 