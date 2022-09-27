<template>
  <div class="container">
    <div class="content">
      <div>离下班还有：</div>
      <div class="time">{{computedTime}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from 'vue-router'
const remainTime = ref(0)
const computedTime = computed(() => {
  let time = remainTime.value
  let isNegative = false
  if (time < 0) {
    time = -time
    isNegative = true
  }
  let h = Math.floor(time / 3600)
  let m = Math.floor((time - (h * 3600)) / 60)
  let s = Math.floor((time) % 60)

  let hh = h.toString().padStart(2, '0')
  let mm = m.toString().padStart(2, '0')
  let ss = s.toString().padStart(2, '0')
  return `${isNegative ? '-' : ''}${hh}:${mm}:${ss}`;
})
const route = useRoute()
const customTime = route.query.t || '18:00:00'
const now = Math.floor(Date.now()/1000)

const today = (new Date()).toDateString()
const xbTime = +new Date(today + ' ' + customTime)

remainTime.value = Math.floor(xbTime/1000) - now
let timer: number | undefined

onMounted(() => {
  document.title = '下班！'
  timer = setInterval(() => {
    remainTime.value--
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer)
})

</script>

<style scoped>
.container{
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Monaco,Menlo;
}
.content{
}
.time{
  font-size: 18vw;
  color: #fff;
}
@media screen and (max-width: 768px){
  .content{
    transform: rotate(90deg);
    transform-origin: 50% 50%;
  }
  .time{
    font-size: 18vh;

  }
}
</style>