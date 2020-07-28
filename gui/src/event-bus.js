import Vue from 'vue'
import router from './router'

export const EventBus = new Vue()

EventBus
  .$on('routeTo', route => {
    router.push(route.to)
  })
