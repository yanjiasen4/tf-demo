<template>
  <v-stage :config="configKonva" ref="stage">
    <v-layer ref="nodesLayer">
      <node v-for="(node, index) of configNodes" :nodeAttr='node' ref="node" :key="index"></node>
    </v-layer>
    <v-layer ref="flowsLayer">
      <flow v-for="(flow, index) of configFlows" :flowAttr='flow' ref="flow" :key="index"></flow>
    </v-layer>
  </v-stage>
</template>

<script>
import Node from './Shapes/Node'
import Flow from './Shapes/Flow'
import Module from '../assets/modules/md1'
import Devices from '../assets/devices/devs'

export default {
  name: 'Canvas',
  components: { Node, Flow },
  data () {
    return {
      module: null,
      devices: null,
      configKonva: {
        width: 1000,
        height: 800
      },
      configNodes: [],
      configFlows: [],
      devicesSetting: []
    }
  },
  methods: {
    startAnimation: function () {
    },
    executeTask: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          this.devicesSetting[node.group][i].push(node.nid)
        }
      }
    },
    executeTaskYsnc: function () {
    },
    initDevicesSetting: function () {
      for (let i = 0; i < this.devices.devNum; i++) {
        this.devicesSetting.push([])
        for (let j = 0; j < this.module.layersNum; j++) {
          this.devicesSetting[i].push([])
        }
      }
    }
  },
  created: function () {
    // create nodes
    this.module = Module.module
    this.devices = Devices.deviceConfig.dev1
    this.initDevicesSetting()

    const layerWidth = 1000
    const layerHeight = 250
    const moduleHeight = layerHeight * this.module.layersNum
    const nodeWidth = 250
    const moduleY = 800 - (800 - moduleHeight) / 2 - nodeWidth / 2
    for (let i in this.module.layers) {
      let layerY = moduleY - i * layerHeight
      let layer = this.module.layers[i]
      let nodesWidth = nodeWidth * layer.nodesNum
      let layerLeft = (layerWidth - nodesWidth) / 2 + nodeWidth / 2
      for (let j in layer.nodes) {
        // nodes
        let node = layer.nodes[j]
        let nodeX = layerLeft + j * nodeWidth
        let nodeY = layerY
        node.x = nodeX
        node.y = nodeY
        this.configNodes.push({
          x: nodeX,
          y: nodeY,
          radius: 50,
          groupId: node.group
        })
      }
    }
    // create flows
    for (let i = 0; i < this.module.layersNum; i++) {
      const layer = this.module.layers[i]
      // next layer is not the output layer
      if (layer.lid < this.module.layersNum - 1) {
        const nextLayer = this.module.layers[i + 1]
        for (let node of layer.nodes) {
          // this node has no connections
          if (node.connections.length === 0) continue
          for (let conn of node.connections) {
            const connNode = nextLayer.nodes[conn]
            const flowPoints = [node.x, node.y, connNode.x, connNode.y]
            this.configFlows.push({
              points: flowPoints
            })
          }
        }
      }
    }
  },
  mounted: function () {
    this.$refs.nodesLayer.getStage().moveToTop()
    this.executeTask()
  }
}
</script>

<style scoped>

</style>
