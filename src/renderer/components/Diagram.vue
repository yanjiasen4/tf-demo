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
  </div>
</template>

<script>
import Node from './Shapes/Node'
import Flow from './Shapes/Flow'
import Module from '../assets/modules/md1'
// import Devices from '../assets/devices/devs'

export default {
  name: 'diagram',
  components: { Node, Flow },
  props: ['devices'],
  data () {
    return {
      module: null,
      // devices: null,
      configKonva: {
        width: 1000,
        height: 800
      },
      configNodes: [],
      configFlows: [],
      nodesNumArray: [],
      flowsNumArray: [],
      devicesSetting: [],
      progressing: false,
      dataFlowDuration: 1,
      nodeRepairCost: 2
    }
  },
  methods: {
    startAnimation: function (startTime, iter) {
      let lastAnimationFinished = 0
      // const recoverTime = 2
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodes.length; j++) {
          const node = this.module.layers[i].nodes[j]
          const nodeIndex = this.getNodeIndex(i, j)
          let delay = node.delay + startTime
          if (i > 0 && node.connectBy.length > 0) {
            // const prevLayer = this.module.layers[i - 1]
            delay += i * this.dataFlowDuration
            // console.log(`animation: ${delay}`)
          }

          // flow animation
          for (let k = 0; k < node.connections.length; k++) {
            const flowIndex = this.getFlowIndex(i, j, k)
            // console.log(`lid: ${i}, nid: ${j} findex: ${flowIndex}, start flow at ${delay + node.duration}, duration: ${dataFlowDuration}`)
            this.$refs.flows[flowIndex].progress(this.dataFlowDuration, delay + node.duration)
          }
          // console.log(`lid: ${i}, nid: ${j} nindex: ${nodeIndex}, start task at ${delay}, duration: ${node.duration}`)

          this.$refs.nodes[nodeIndex].progress(node.duration, delay, iter)
          if (node.repair !== 0) {
            this.$refs.nodes[nodeIndex].repair(delay)
            node.repair = 0
          }
          lastAnimationFinished = delay + node.duration
        }
      }
      let backPropogationFinished = this.backPropogation(lastAnimationFinished)
      this.$store.commit({
        type: 'SET_TIME',
        time: backPropogationFinished
      })
      return backPropogationFinished
    },
    backPropogation: function (delay) {
      let backPropogationFinished = 0
      for (let i = this.module.layersNum - 1; i >= 0; i--) {
        for (let j = this.module.layers[i].nodes.length - 1; j >= 0; j--) {
          const node = this.module.layers[i].nodes[j]
          for (let k = 0; k < node.connections.length; k++) {
            const flowIndex = this.getFlowIndex(i, j, k)
            this.$refs.flows[flowIndex].reverse(delay + this.dataFlowDuration * (this.module.layersNum - i - 2))
            backPropogationFinished = delay + this.dataFlowDuration * (this.module.layersNum - i - 1)
          }
        }
      }
      return backPropogationFinished
    },
    executeTask: function () {
      const batch = 4
      this.createDevicesSetting()
      this.setRepairedNodes()
      this.calcDelayDuration()
      let startTime = this.startAnimation(0, 0)
      for (let i = 1; i < batch; i++) {
        this.calcDelayDuration()
        startTime = this.startAnimation(startTime, i)
      }
    },
    executeTaskSync: function () {
      const batch = 4
      this.createDevicesSetting()
      this.setRepairedNodes()
      this.calcDelayDuration()
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; i++) {
          for (let k = 0; k < batch; k++) {
            // [TODO]
          }
        }
      }
    },
    calcDelayDuration: function () {
      for (let i = 0; i < this.devicesSetting.length; i++) { // layer
        for (let j = 0; j < this.devicesSetting[i].length; j++) { // device
          let GPUCost = 0
          let CPUCost = 0
          // let IOCost = 0
          const GPURates = this.devices.devs[j].GPURate
          const CPURates = this.devices.devs[j].CPURate
          // const IORates = this.devices.devs[j].IORate
          const layerDeviceNodes = this.devicesSetting[i][j]
          for (let k = 0; k < layerDeviceNodes.length; k++) {
            GPUCost += layerDeviceNodes[k].cost[0]
            CPUCost += layerDeviceNodes[k].cost[1]
            // IOCost += layerDeviceNodes[k].cost[2]
          }
          const duration = Math.max(GPUCost / GPURates, CPUCost / CPURates)
          for (let k = 0; k < layerDeviceNodes.length; k++) {
            const node = layerDeviceNodes[k]
            node.duration = duration
            node.delay = 0
            if (i > 0) {
              const prevLayer = this.module.layers[i - 1]
              node.delay = Math.max(this.getMaxTime2Wait(prevLayer.nodes, node.connectBy), node.delay + this.getRepairTime(i - 1))
            } else {
              node.delay = 0
            }
            // node dead
            // if (!nodeRef.alive) {
            //   node.repair = this.nodeRepairCost
            // }
            node.delay += node.repair
            // console.log(`lid: ${i}, nid: ${node.nid}, delay: ${node.delay}, duration: ${node.duration}`)
          }
        }
      }
    },
    setRepairedNodes: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          const nodeIndex = this.getNodeIndex(i, j)
          const nodeRef = this.$refs.nodes[nodeIndex]
          if (!nodeRef.alive) {
            node.repair = this.nodeRepairCost
          } else {
            node.repair = 0
          }
        }
      }
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
      this.clearDevicesSetting()
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          this.devicesSetting[i][node.group].push(node)
        }
      }
    },
    clearDevicesSetting: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          this.devicesSetting[i][node.group] = []
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
    getFlowIndex: function (lid, nid, cid) {
      const nodeIndex = this.getNodeIndex(lid, nid)
      // console.log(`node index: ${nodeIndex}`)
      if (nodeIndex === 0) return cid
      else return this.flowsNumArray[nodeIndex - 1] + cid
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
    },
    getRepairTime: function (lid) {
      if (lid < 0 || lid > this.module.layersNum) return 0
      let maxRepair = 0
      for (let node of this.module.layers[parseInt(lid)].nodes) {
        maxRepair = maxRepair < node.repair ? node.repair : maxRepair
      }
      return maxRepair
    }
  },
  created: function () {
    // create nodes
    this.module = Module.module
    this.initDevicesSetting()

    const layerWidth = 1000
    const layerHeight = 250
    const moduleHeight = layerHeight * this.module.layersNum
    const nodeWidth = 250
    const moduleY = 800 - (800 - moduleHeight) / 2 - nodeWidth / 2

    let flowCount = 0
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
          nid: j,
          GPUCost: node.cost[0],
          CPUCost: node.cost[1]
        })

        // calculate connections number
        flowCount += node.connections.length
        this.flowsNumArray.push(flowCount)
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
    // move nodes to the top layer
    this.$refs.nodesLayer.getStage().moveToTop()
  }
}
</script>

<style scoped>
</style>
