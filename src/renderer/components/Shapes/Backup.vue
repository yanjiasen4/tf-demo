<template>
  <v-layer ref="layer">
    <v-circle :config="configCircle" ref="circle"></v-circle>
    <v-ellipse :config="configEllipseUpper"></v-ellipse>
    <v-ellipse :config="configEllipseMid"></v-ellipse>
    <v-ellipse :config="configEllipseBottom"></v-ellipse>
  </v-layer>
</template>

<script>
import { Circle, Tween } from 'konva'

export default {
  name: 'backup',
  data () {
    const ex = 700
    const ey = 200
    const eradius = {
      x: 80,
      y: 40
    }
    return {
      configEllipseUpper: {
        x: ex,
        y: ey,
        radius: eradius,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4
      },
      configEllipseMid: {
        x: ex,
        y: ey - 40,
        radius: eradius,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4
      },
      configEllipseBottom: {
        x: ex,
        y: ey - 80,
        radius: eradius,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 4
      },
      configCircle: {
        x: 660,
        y: 160,
        radius: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 3
      },
      show: false,
      tween: null
    }
  },
  methods: {
    send: function (tx, ty, delay) {
      const circle = new Circle({
        x: 660,
        y: 160,
        radius: 10,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 3
      })
      this.$refs.layer.getStage().add(circle)
      this.$refs.layer.getStage().moveToBottom()
      const progressTween = new Tween({
        node: circle,
        duration: 1,
        x: tx,
        y: ty
      })
      setTimeout(() => {
        progressTween.play()
      }, delay * 1000)
    }
  }
}
</script>

<style scoped>

</style>

