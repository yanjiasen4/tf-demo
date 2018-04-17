<template>
  <v-circle :config="configCircle" ref="node"></v-circle>
  <v-circle :config="configCircle" ref="progress"></v-circle>
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
        fill: Colors.colors[this.nodeAttr.groupId],
        stroke: 'black',
        strokeWidth: 2
      },
      configProgress: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius
      }
    }
  },
  methods: {
    progress: function () {
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

