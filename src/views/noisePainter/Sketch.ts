import P5 from "p5";
import {startRecord, exportVideo} from "./Recorder";
import {useRoute} from "vue-router";

interface progressCallback {
  (progress: number): void;
}

const drawLength = 1000;
const noiseScale = 0.005;
const strokeLength = 35;
let frame = 0
let pic: P5.Image
let sca = 1
let loaded = false
let noop = () => {}
let progressCallback:progressCallback
let mountElement: HTMLElement;
let canvasElm:HTMLCanvasElement;

const createSetup = (p:P5) => {
  return async function setup () {
    pic = await loadImage(p)

    const {width, height} = getCanvasSize(pic)
    p.createCanvas(width, height)
    p.background(255)
    p.frameRate(30)
    canvasElm = mountElement.getElementsByTagName("canvas")[0]
    startRecord(canvasElm)
  }
}
const createDraw = (p: P5) => {
  return function draw () {
    if (!loaded) return;

    if (frame > drawLength ){
      // end
      return
    }
    if(typeof progressCallback === 'function') {
      progressCallback(frame/drawLength)
    }

    pic.loadPixels();

    if (pic.height > p.height || pic.width > p.width) {
      sca = Math.min(p.height / pic.height, p.width / pic.width);
    }
    p.scale(sca);
    // p.translate(p.width / 2 - pic.width * sca / 2, p.height / 2 - pic.height * sca / 2);
    let count = p.map(frame, 0, drawLength, 2, 160);
    for (let i = 0; i < count; i++) {
      printSingPoint(p, pic)
    }
    frame++
  }

}

const getImageUrl = (): string => {
  const route = useRoute()
  return (route.query.url || '') as string
}

const loadImage = (instance:P5):Promise<P5.Image> => {
  return new Promise((resolve, reject) => {
    instance.loadImage(getImageUrl(), (pic) => {
      loaded = true
      resolve(pic)
    })
  })
}

/**
 * 获取canvas初始化的宽高
 * @param pic - P5加载的image，根据它和屏幕尺寸计算canvas宽高
 * @returns width - 宽
 * @returns height - 高
 * */
const getCanvasSize = (pic: P5.Image): {width: number, height: number} => {
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

/**
 * 随机绘制图片中一个点
 * @param p - P5实例
 * @param pic - P5加载的Image
 * */
const printSingPoint = (p:P5, pic:P5.Image) => {
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

const sketch = (p: P5) => {
  p.setup = createSetup(p)
  p.draw = createDraw(p)
}

const start = (mountElm:HTMLElement, onProgress:progressCallback=noop) => {
  progressCallback = onProgress
  mountElement = mountElm
  return new P5(sketch, mountElm)
}
export {
  start, exportVideo
}