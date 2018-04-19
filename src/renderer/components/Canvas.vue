<template>
  <div>
    <v-stage :config="configKonva" ref="stage">
      <v-layer ref="nodesLayer">
        <node v-for="(node, index) of configNodes" :nodeAttr='node' ref="nodes" :key="index"></node>
      </v-layer>
      <v-layer ref="flowsLayer">
        <flow v-for="(flow, index) of configFlows" :flowAttr='flow' ref="flows" :key="index"></flow>
      </v-layer>
    </v-stage>
    <button @click="executeTask">开始任务</button>
    <button @click="reset">重置</button>
  </div>
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
      nodesNumArray: [],
      devicesSetting: []
    }
  },
  methods: {
    startAnimation: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodes.length; j++) {
          const node = this.module.layers[i].nodes[j]
          let delay = 0
          if (i > 0 && node.connectBy.length > 0) {
            const prevLayer = this.module.layers[i - 1]
            delay = this.getMaxTime2Wait(prevLayer.nodes, node.connectBy)
            console.log(`animation: ${delay}`)
          }
          console.log(`lid: ${i}, nid: ${j} nindex: ${this.getNodeIndex(i, j)}, start task at ${delay}, duration: ${node.duration}`)
          this.$refs.nodes[this.getNodeIndex(i, j)].progress(node.duration, delay)
        }
      }

      for (let flow of this.$refs.flows) {
        flow.progress()
      }
    },
    executeTask: function () {
      this.createDevicesSetting()

      for (let i = 0; i < this.devicesSetting.length; i++) { // layer
        for (let j = 0; j < this.devicesSetting[i].length; j++) { // device
          let GPUCost = 0
          let CPUCost = 0
          let IOCost = 0
          const GPURates = this.devices.devs[j].GPURate
          const CPURates = this.devices.devs[j].CPURate
          const IORates = this.devices.devs[j].IORate
          const layerDeviceNodes = this.devicesSetting[i][j]
          for (let k = 0; k < layerDeviceNodes.length; k++) {
            GPUCost += layerDeviceNodes[k].cost[0]
            CPUCost += layerDeviceNodes[k].cost[1]
            IOCost += layerDeviceNodes[k].cost[2]
          }
          let duration = Math.max(GPUCost / GPURates, CPUCost / CPURates, IOCost / IORates)
          for (let k = 0; k < layerDeviceNodes.length; k++) {
            let node = layerDeviceNodes[k]
            node.duration = duration
            node.delay = 1
            if (i > 0) {
              const prevLayer = this.module.layers[i - 1]
              node.delay = this.getMaxTime2Wait(prevLayer.nodes, node.connectBy)
            } else {
              node.delay = 0
            }
          }
        }
      }

      this.startAnimation()
    },
    executeTaskYsnc: function () {
    },
    initDevicesSetting: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        this.devicesSetting.push([])
        for (let j = 0; j < this.devices.devNum; j++) {
          this.devicesSetting[i].push([])
        }
      }
    },
    createDevicesSetting: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          this.devicesSetting[i][node.group].push(node)
        }
      }
    },
    reset: function () {
      for (let node of this.$refs.nodes) {
        node.reset()
      }
      for (let flow of this.$refs.flows) {
        flow.reset()
      }
    },
    pause: function () {
      for (let node of this.$refs.nodes) {
        node.pause()
      }
    },
    getNodeIndex: function (lid, nid) {
      if (lid === 0) return nid
      let accNodeIndex = 0
      for (let i = 1; i <= lid; i++) {
        accNodeIndex += this.nodesNumArray[i - 1]
      }
      return accNodeIndex + nid
    },
    getMaxDuration: function (nodes, indices) {
      let maxDuration = 0
      for (let i of indices) {
        if (nodes[i].duration > maxDuration) {
          maxDuration = nodes[i].duration
        }
      }
      return maxDuration
    },
    getMaxDelay: function (nodes, indices) {
      let maxDelay = 0
      for (let i of indices) {
        if (nodes[i].delay > maxDelay) {
          maxDelay = nodes[i].delay
        }
      }
      return maxDelay
    },
    getMaxTime2Wait: function (nodes, indices) {
      let maxT2w = 0
      for (let i of indices) {
        let nodeT2w = nodes[i].delay + nodes[i].duration
        if (nodeT2w > maxT2w) {
          maxT2w = nodeT2w
        }
      }
      return maxT2w
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
      // record nodesNum of each layer
      this.nodesNumArray.push(this.module.layers[i].nodesNum)
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
          groupId: node.group,
          lid: i,
          nid: j
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
  }
}
</script>

<style scoped>

</style>
