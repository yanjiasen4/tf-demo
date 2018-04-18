<template>
  <div>
    <v-circle :config="configCircle" ref="node"></v-circle>
    <v-wedge :config="configWedge" ref="wedge"></v-wedge>
  </div>
</template>

<script>
// import {Animation} from 'konva'
import {Tween} from 'konva'

import Colors from '../../assets/colorsTable'

export default {
  props: ['nodeAttr'],
  data () {
    return {
      configCircle: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius,
        // fill: Colors.colors[this.nodeAttr.groupId],
        stroke: Colors.colors[this.nodeAttr.groupId],
        strokeWidth: 3
      },
      configWedge: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius,
        angle: 0,
        fill: Colors.colors[this.nodeAttr.groupId]
      }
    }
  },
  methods: {
    progress: function (duration, delay) {
      const progressTween = new Tween({
        node: this.$refs.wedge.getStage(),
        duration: duration,
        angle: 360
      })
      setTimeout(() => {
        progressTween.play()
      }, delay)
      // const progressTween = new Tween({
      //   node: this.$refs.node.getStage(),
      //   duration: 1,
      //   height: 0
      // })
      // console.log(this.$refs.node.getStage())
      // const progressAnim = new Animation(frame => {
      //   this.$refs.node.getStage().setX(100 * Math.sin(frame.time * 2 * Math.PI / 5000) + 100)
      // }, this.$refs.node.getStage())

      // progressAnim.start()
    }
  }
}
</script>

