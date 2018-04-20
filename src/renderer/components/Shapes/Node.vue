<template>
  <div>
    <v-circle :config="configCircle" ref="node"></v-circle>
    <v-wedge :config="configWedge" ref="wedge"></v-wedge>
    <v-label :config="configLabel" ref="label"></v-label>
  </div>
</template>

<script>
// import {Animation} from 'konva'
import {Tween, Tag, Text} from 'konva'

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
      configLabel: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        visible: false,
        opacity: 0.75
      },
      configWedge: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius,
        angle: 0,
        fill: Colors.colors[this.nodeAttr.groupId]
      },
      lid: this.nodeAttr.lid,
      nid: this.nodeAttr.nid,
      tween: null
    }
  },
  methods: {
    progress: function (duration, delay) {
      const progressTween = new Tween({
        node: this.$refs.wedge.getStage(),
        duration: duration,
        angle: 360
      })
      this.tween = progressTween
      // console.log(`${this.lid}, ${this.nid}, ${this.tween}`)
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
    }
  },
  mounted: function () {
    this.$nextTick(() => {
      let label = this.$refs.label.getStage()
      label.add(new Tag({
        fill: 'black',
        pointerDirection: 'down',
        pointerWidth: 10,
        pointerHeight: 10,
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.2
      }))
      label.add(new Text({
        text: `node: test`,
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white'
      }))

      // bind mouse event
      label.on('mouseover mousemove', (evt) => {
        this.configLabel.visible = true
      })
      this.$refs.node.getStage().on('mouseover mousemove', (evt) => {
        this.configLabel.visible = true
      })
      this.$refs.wedge.getStage().on('mouseover mousemove', (evt) => {
        this.configLabel.visible = true
      })
      label.on('mouseout', (evt) => {
        this.configLabel.visible = false
      })
      this.$refs.node.getStage().on('mouseout', (evt) => {
        this.configLabel.visible = false
      })
      this.$refs.wedge.getStage().on('mouseout', (evt) => {
        this.configLabel.visible = false
      })
    })
  }
}
</script>

