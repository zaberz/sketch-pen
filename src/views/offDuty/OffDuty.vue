<template>
  <div class="container" @click="toggleFullScreen" ref="containerRef">
    <canvas style="position:absolute; width:100vw;height: 100vh" ref="canvasRef"></canvas>

    <div class="content">
      <div>离下班还有：</div>
      <div class="time">{{computedTime}}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useRoute} from 'vue-router'
import start from './script.js'

const remainTime = ref(0)
const canvasRef = ref()
const containerRef = ref()

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
let timer

onMounted(() => {
  document.title = '下班！'
  timer = setInterval(() => {
    remainTime.value--
  }, 1000)
  start(canvasRef.value)
})
onUnmounted(() => {
  clearInterval(timer)
})

const toggleFullScreen = () => {
  if (isFullScreen()) {
    closeFullscreen()
  }else {
    openFullscreen(containerRef.value)
  }
}

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }

}


const docWithBrowsersExitFunctions = document as Document & {
  mozCancelFullScreen(): Promise<void>;
  webkitExitFullscreen(): Promise<void>;
  msExitFullscreen(): Promise<void>;
  isFullScreen: Boolean;
  mozIsFullScreen: Boolean;
  webkitIsFullScreen: Boolean
};
/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
    docWithBrowsersExitFunctions.mozCancelFullScreen();
  } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    docWithBrowsersExitFunctions.webkitExitFullscreen();
  } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
    docWithBrowsersExitFunctions.msExitFullscreen();
  }
}

function isFullScreen() {
  return document.fullscreenElement || docWithBrowsersExitFunctions.isFullScreen || docWithBrowsersExitFunctions.mozIsFullScreen || docWithBrowsersExitFunctions.webkitIsFullScreen
}

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
  color: #fff;
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