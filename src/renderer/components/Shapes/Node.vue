<template>
    <v-layer ref="node">
      <v-circle :config="configCircle"></v-circle>
    </v-layer>
</template>

<script>
import {Animation} from 'konva'

import Colors from '../../assets/colorsTable'

export default {
  props: ['nodeAttr', 'group'],
  data () {
    return {
      configCircle: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius,
        fill: Colors.colors[this.nodeAttr.groupId],
        stroke: 'black',
        strokeWidth: 2
      }
    }
  },
  method: {
    progress: function () {
      const progressAnim = new Animation(frame => {
        this.$refs.node.getStage().setX(100 * Math.sin(frame.time * 2 * Math.PI / 5000) + 100)
      }, this.$refs.node.getStage())

      progressAnim.start()
    }
  }
}
</script>

