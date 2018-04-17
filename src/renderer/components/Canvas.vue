<template>
  <v-stage :config="configKonva" ref="stage">
    <v-layer ref="layer">
      <node v-for="(node, index) of configNodes" :nodeAttr='node' ref="node" :key="index"></node>
    </v-layer>
  </v-stage>
</template>

<script>
import Node from './Shapes/Node'
import Module from '../assets/modules/md1'

export default {
  name: 'Canvas',
  components: { Node },
  data () {
    return {
      configKonva: {
        width: 800,
        height: 800
      },
      configNodes: []
    }
  },
  methods: {
  },
  created: function () {
    const module = Module.module
    const layerWidth = 800
    const layerHeight = 150
    const moduleHeight = layerHeight * module.layersNum
    // const nodeHeight = 150
    const nodeWidth = 150
    const moduleY = 800 - (800 - moduleHeight) / 2
    console.log(moduleY)
    for (let i in module.layers) {
      let layerY = moduleY - i * layerHeight
      let layer = module.layers[i]
      let nodesWidth = nodeWidth * layer.nodesNum
      let layerLeft = (layerWidth - nodesWidth) / 2
      for (let j in layer.nodes) {
        let nodeX = layerLeft + j * nodeWidth
        let nodeY = layerY
        this.configNodes.push({
          x: nodeX,
          y: nodeY,
          radius: 50,
          groupId: layer.nodes[j].group
        })
      }
    }
  },
  mounted: function () {
    console.log(this.$refs.node[0])
    this.$refs.node[0].progress()
  }
}
</script>

<style scoped>

</style>

