<template>
  <div class="noise-painter-container">
    <div ref="painter" class="canvas-container">
      <button @click="exportVideo" v-if="showExport" class="export-btn" >下载视频</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {start, exportVideo} from "./Sketch";

const painter = ref()
const showExport = ref(false)

const onProgress = (rate:number) => {
  if (rate === 1) {
    showExport.value = true
  }
}
onMounted(() => {
  document.title = 'Noise Painter'
  start(painter.value,onProgress)
})


</script>

<style scoped>
.noise-painter-container {
  vertical-align: top;
  font-size: 0;
}
.canvas-container{
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-btn{
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 500px;
  font-size: 1.5rem;
}
</style>