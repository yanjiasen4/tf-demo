<template>
  <div>
    <v-line :config="configLineL" ref="lineL"></v-line>
    <v-line :config="configLineR" ref="lineR"></v-line>
    <v-rect :config="configRectangle" ref="recR"></v-rect>
  </div>
</template>

<script>
import { Tween } from 'konva'
export default {
  name: 'Flow',
  props: ['flowAttr'],
  data () {
    const size = 6
    const recWidth = 11
    const alpha = Math.atan((this.flowAttr.points[3] - this.flowAttr.points[1]) / (this.flowAttr.points[2] - this.flowAttr.points[0]))
    let newalpha = alpha
    if (alpha < 0) {
      newalpha = Math.PI + alpha
    }
    const x1 = this.flowAttr.points[0] - size * Math.sin(alpha)
    const x2 = this.flowAttr.points[0] + size * Math.sin(alpha)
    const x3 = this.flowAttr.points[2] - size * Math.sin(alpha)
    const x4 = this.flowAttr.points[2] + size * Math.sin(alpha)

    const y1 = this.flowAttr.points[1] + size * Math.cos(alpha)
    const y2 = this.flowAttr.points[1] - size * Math.cos(alpha)
    const y3 = this.flowAttr.points[3] + size * Math.cos(alpha)
    const y4 = this.flowAttr.points[3] - size * Math.cos(alpha)
    let recx = 0
    let recy = 0
    let finalx = 0
    let finaly = 0
    if (newalpha >= Math.PI / 2) {
      recx = x1
      recy = y1
      finalx = x3
      finaly = y3
    } else {
      recx = x2
      recy = y2
      finalx = x4
      finaly = y4
    }
    const newflowPointsL = [x1, y1, x3, y3]
    const newflowPointsR = [x2, y2, x4, y4]
    return {
      configLineL: {
        points: newflowPointsL,
        stroke: 'black',
        strokeWidth: 2
      },
      configLineR: {
        points: newflowPointsR,
        stroke: 'black',
        strokeWidth: 2
      },
      configRectangle: {
        x: recx,
        y: recy,
        width: recWidth,
        height: 4 * size,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4,
        rotation: newalpha * 180 / Math.PI + 90
      },
      finalx: finalx,
      finaly: finaly,
      tween: null
    }
  },
  methods: {
    progress: function (duration, delay) {
      const progressTween = new Tween({
        node: this.$refs.recR.getStage(),
        x: this.finalx,
        y: this.finaly,
        duration: duration
      })
      this.tween = progressTween
      setTimeout(() => {
        this.tween.play()
      }, delay * 1000)
    },
    pause: function () {
      if (this.tween !== null) {
        this.tween.pause()
      }
    },
    reset: function () {
      if (this.tween !== null) {
        this.tween.reverse()
      }
    },
    reverse: function (delay) {
      if (this.tween !== null) {
        setTimeout(() => {
          console.log(`reverse: ${delay}`)
          this.tween.reverse()
        }, delay * 1000)
      }
    }
  }
}
</script>

<style scoped>

</style>
