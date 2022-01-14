<template>
  <div class="noise-painter-container">
    <!--    <div>123213</div>-->
    <div ref="painter"></div>
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
const drawLength = 500;
const noiseScale = 0.005;
const strokeLength = 35;

let frame = 0
let pic: P5.Image
let sca = 1

const sketch = (p: P5) => {
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight)
    p.background(255)
    pic = p.loadImage(getImageUrl())
    p.frameRate(10)
  }
  p.draw = () => {
    if (frame > drawLength) return

    pic.loadPixels();

    if (pic.height > p.height || pic.width > p.width) {
      sca = Math.min( p.height / pic.height, p.width / pic.width);
    }
    p.scale(sca);
    p.translate(p.width / 2 - pic.width * sca / 2, p.height / 2 - pic.height * sca / 2);
    let count = p.map(frame, 0, drawLength, 2, 80);
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
      let sl = p.map(frame, 0 ,drawLength, strokeLength, 5)
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


onMounted(() => {
  document.title='Noise Painter'
  new P5(sketch, painter.value)
})


</script>

<style scoped>
.noise-painter-container {
  vertical-align: top;
  font-size: 0;
}
</style>