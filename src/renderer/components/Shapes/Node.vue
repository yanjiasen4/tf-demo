<template>
  <v-stage ref="stage" :config="configKonva">
    <v-layer ref="layer" ref="node">
      <v-circle :config="configCircle"></v-circle>
    </v-layer>
  </v-stage>
</template>

<script>
import {Animation} from 'konva'

export default {
  data () {
    return {
      configKonva: {
        width: 200,
        height: 200
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
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

