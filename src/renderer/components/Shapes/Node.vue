<template>
  <div>
    <v-circle :config="configCircle" ref="node"></v-circle>
    <v-wedge :config="configWedgeEven" ref="wedgeEven"></v-wedge>
    <v-wedge :config="configWedgeOdd" ref="wedgeOdd"></v-wedge>
    <v-label :config="configLabel" ref="label"></v-label>

    <!-- crash signal -->
    <v-line :config="configLine" v-if="!alive" ref="line"></v-line>
  </div>
</template>

<script>
// import {Animation} from 'konva'
import {Tween, Tag, Text} from 'konva'

import Colors from '../../assets/colorsTable'

export default {
  props: ['nodeAttr'],
  data () {
    const alaph = Math.atan(1) // 45
    const lineStarX = this.nodeAttr.x - this.nodeAttr.radius * Math.cos(alaph)
    const lineStarY = this.nodeAttr.y - this.nodeAttr.radius * Math.sin(alaph)
    const lineEndX = this.nodeAttr.x + this.nodeAttr.radius * Math.cos(alaph)
    const lineEndY = this.nodeAttr.y + this.nodeAttr.radius * Math.sin(alaph)
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
      configWedgeOdd: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius,
        angle: 0,
        fill: Colors.dataColors[0]
      },
      configWedgeEven: {
        x: this.nodeAttr.x,
        y: this.nodeAttr.y,
        radius: this.nodeAttr.radius,
        angle: 0,
        fill: Colors.dataColors[1]
      },
      configLine: {
        points: [lineStarX, lineStarY, lineEndX, lineEndY],
        stroke: Colors.colors[this.nodeAttr.groupId],
        strokeWidth: 3
      },
      lid: this.nodeAttr.lid, // layer id
      nid: this.nodeAttr.nid, // node id
      tween: null, // save tween object
      alive: true
    }
  },
  methods: {
    progress: function (duration, delay, iter) {
      // console.log(`${this.lid}, ${this.nid}, ${this.tween}`)
      setTimeout(() => {
        if (this.tween !== null) {
          this.tween.reset()
          this.tween.destroy()
          this.tween = null
        }
        const node = iter % 2 === 0 ? this.$refs.wedgeEven : this.$refs.wedgeOdd
        const progressTween = new Tween({
          node: node.getStage(),
          duration: duration,
          angle: 360
        })
        this.tween = progressTween
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
        this.tween.reset()
        this.tween.destroy()
        this.tween = null
      }
    },
    repair: function (delay) {
      setTimeout(() => {
        this.alive = true
      }, delay * 1000)
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
        text: `node: \nGPU: ${this.nodeAttr.GPUCost}\nCPU: ${this.nodeAttr.CPUCost}`,
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
      this.$refs.wedgeEven.getStage().on('mouseover mousemove', (evt) => {
        this.configLabel.visible = true
      })
      this.$refs.wedgeOdd.getStage().on('mouseover mousemove', (evt) => {
        this.configLabel.visible = true
      })
      label.on('mouseout', (evt) => {
        this.configLabel.visible = false
      })
      this.$refs.node.getStage().on('mouseout', (evt) => {
        this.configLabel.visible = false
      })
      this.$refs.wedgeEven.getStage().on('mouseout', (evt) => {
        this.configLabel.visible = false
      })
      this.$refs.wedgeOdd.getStage().on('mouseout', (evt) => {
        this.configLabel.visible = false
      })

      this.$refs.node.getStage().on('click', (evt) => {
        this.alive = !this.alive
        if (this.alive !== true) {
          this.$message({
            message: `第${parseInt(this.lid) + 1}层，第${parseInt(this.nid) + 1}个节点将会失效`,
            type: 'error',
            duration: 1500
          })
        } else {
          this.$message({
            message: `第${parseInt(this.lid) + 1}层，第${parseInt(this.nid) + 1}个节点设置为正常工作`,
            type: 'success',
            duration: 1500
          })
        }
      })
    })
  }
}
</script>

