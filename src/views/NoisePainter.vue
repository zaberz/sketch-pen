<template>
  <div class="noise-painter-container">
    <div ref="painter" class="canvas-container">
      <button @click="exportVideo" class="export-btn" v-if="showExport">下载视频({{fileExt}})</button>

    </div>

  </div>
</template>

<script setup lang="ts">
import P5 from 'p5'
import {useRoute} from "vue-router";
import {onMounted, ref} from 'vue'

function getImageUrl(): string {
  const route = useRoute()
  return (route.query.url || '') as string
}

const painter = ref()
const showExport = ref(false)
const drawLength = 1000;
const noiseScale = 0.005;
const strokeLength = 35;

let frame = 0
let pic: P5.Image
let sca = 1
let loaded = false
const sketch = (p: P5) => {
  p.setup = async () => {
    p.background(255)
    pic = await loadImage(p)
    p.frameRate(120)
    const {width, height} = getCanvasSize(pic)
    p.createCanvas(width, height)
    startRecord()
  }
  p.draw = () => {
    if (!loaded) return;

    if (frame > drawLength ){
      showExport.value = true
      return
    }
    pic.loadPixels();

    if (pic.height > p.height || pic.width > p.width) {
      sca = Math.min(p.height / pic.height, p.width / pic.width);
    }
    p.scale(sca);
    // p.translate(p.width / 2 - pic.width * sca / 2, p.height / 2 - pic.height * sca / 2);
    let count = p.map(frame, 0, drawLength, 2, 160);
    for (let i = 0; i < count; i++) {
      let x = p.int(p.random(pic.width))
      let y = p.int(p.random(pic.height))

      let index = (y * pic.width + x) * 4

      let r = pic.pixels[index];
      let g = pic.pixels[index + 1];
      let b = pic.pixels[index + 2];
      let a = pic.pixels[index + 3];

      p.stroke(r, g, b, a)
      let sw = p.map(frame, 0, drawLength, 25, 2);
      p.strokeWeight(sw)
      p.push()
      p.translate(x, y)
      let n = p.noise(x * noiseScale, y * noiseScale)
      p.rotate(p.radians(p.map(n, 0, 1, -180, 180)))
      let sl = p.map(frame, 0, drawLength, strokeLength, 2)
      let lengthVariation = p.random(0.75, 1.25);
      p.line(0, 0, sl * lengthVariation, 0)

      // Draw a highlight for more detail.
      p.stroke(p.min(r * 3, 255), p.min(g * 3, 255), p.min(b * 3, 255), p.random(100));
      p.strokeWeight(sw * 0.8);
      p.line(0, -sw * 0.15, sl * lengthVariation, -sw * 0.15);
      p.pop();

    }
    frame++

  }
}
const loadImage = (instance) => {
  return new Promise((resolve, reject) => {
    instance.loadImage(getImageUrl(), (pic) => {
      loaded = true
      resolve(pic)
    })
  })
}

const getCanvasSize = (pic: P5.IMAGE) => {
  const picWidth = pic.width
  const picHeight = pic.height
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const rate = Math.min(windowWidth / picWidth, windowHeight / picHeight)
  return {
    width: picWidth * rate,
    height: picHeight * rate
  }
}


onMounted(() => {
  document.title = 'Noise Painter'
  new P5(sketch, painter.value)
})

const chunks = []
let recorder
const isSupportMp4 = MediaRecorder.isTypeSupported('video/mp4')
const fileExt = isSupportMp4 ? 'mp4': 'webm'
const mimeType = isSupportMp4 ? 'video/mp4': 'video/webm'
const outputFileName = `${Date.now()}.${isSupportMp4 ? 'mp4': 'webm'}`
const startRecord = () => {
  let stream = document.querySelector('canvas').captureStream(30)
  recorder = new MediaRecorder(stream, {mimeType: mimeType})

  recorder.start()
}

const exportVideo = () => {
  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      chunks.push(e.data)
      const blob = new Blob(chunks, {
        type: mimeType
      })

      const href = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      aTag.href = href
      aTag.download = outputFileName
      document.body.appendChild(aTag)
      aTag.click()
    }
  }
  recorder.stop()
}

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