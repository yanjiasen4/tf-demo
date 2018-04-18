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

export default {
  name: 'Canvas',
  components: { Node, Flow },
  data () {
    return {
      configKonva: {
        width: 1000,
        height: 800
      },
      configNodes: [],
      configFlows: []
    }
  },
  methods: {
    startAnimation: function () {
    }
  },
  created: function () {
    // create nodes
    const module = Module.module
    const layerWidth = 1000
    const layerHeight = 250
    const moduleHeight = layerHeight * module.layersNum
    const nodeWidth = 250
    const moduleY = 800 - (800 - moduleHeight) / 2 - nodeWidth / 2
    for (let i in module.layers) {
      let layerY = moduleY - i * layerHeight
      let layer = module.layers[i]
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
    for (let i = 0; i < module.layersNum; i++) {
      const layer = module.layers[i]
      // next layer is not the output layer
      if (layer.lid < module.layersNum - 1) {
        const nextLayer = module.layers[i + 1]
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
  }
}
</script>

<style scoped>

</style>

