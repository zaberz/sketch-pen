const isSupportMp4 = MediaRecorder.isTypeSupported('video/mp4')

const fileExt = isSupportMp4 ? 'mp4' : 'webm'
const mimeType = `video/${fileExt}`
let recorder:MediaRecorder
export const startRecord = (canvas: HTMLCanvasElement): MediaRecorder => {
  let stream = canvas.captureStream(30)
  recorder = new MediaRecorder(stream, {mimeType: mimeType})
  recorder.start()
  return recorder
}

export const exportVideo = (): void => {
  recorder.ondataavailable = (e) => {
    if (e.data.size) {
      const blob =e.data
      const href = URL.createObjectURL(blob)
      const aTag = document.createElement('a')
      const outputFileName = `${Date.now()}.${fileExt}`
      aTag.href = href
      aTag.download = outputFileName
      document.body.appendChild(aTag)
      aTag.click()
    }
  }
  recorder.stop()
}