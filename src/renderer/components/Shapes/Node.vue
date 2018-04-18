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
        fill: 'white',
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
    }
  }
}
</script>

