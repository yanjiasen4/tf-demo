<template>
  <div>
    <v-stage :config="configKonva" ref="stage">
      <backup ref="backup"></backup>
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
import Backup from './Shapes/Backup'
// import Module from '../assets/modules/md1'
// import Devices from '../assets/devices/devs'

export default {
  name: 'diagram',
  components: { Node, Flow, Backup },
  props: ['devices', 'module'],
  data () {
    return {
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
      nodeRepairCost: 5
    }
  },
  methods: {
    startAnimation: function (startTime, iter, playFlow) {
      let lastAnimationFinished = 0
      // const recoverTime = 2
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodes.length; j++) {
          const node = this.module.layers[i].nodes[j]
          const nodeIndex = this.getNodeIndex(i, j)
          let delay = node.delay + startTime
          if (i > 0 && node.connectBy.length > 0) {
            // const prevLayer = this.module.layers[i - 1]
            // delay += i * this.dataFlowDuration
            // console.log(`animation: ${delay}`)
          }

          // flow animation
          if (playFlow) {
            for (let k = 0; k < node.connections.length; k++) {
              const flowIndex = this.getFlowIndex(i, j, k)
              // console.log(`lid: ${i}, nid: ${j} findex: ${flowIndex}, start flow at ${delay + node.duration}, duration: ${dataFlowDuration}`)
              this.$refs.flows[flowIndex].progress(this.dataFlowDuration, delay + node.duration + node.wait)
            }
          } else {
            for (let k = 0; k < node.connections.length; k++) {
              const flowIndex = this.getFlowIndex(i, j, k)
              this.$refs.flows[flowIndex].changeColor(iter, delay + node.duration)
            }
          }
          // console.log(`lid: ${i}, nid: ${j} nindex: ${nodeIndex}, start task at ${delay}, duration: ${node.duration}`)

          this.$refs.nodes[nodeIndex].progress(node.duration, delay, iter)
          if (node.repair !== 0) {
            this.$refs.nodes[nodeIndex].repair(delay)
            this.$refs.backup.send(node.x, node.y, delay - 1)
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
      const batch = 3
      this.createDevicesSetting()
      this.setRepairedNodes()
      this.calcDelayDuration()
      let startTime = this.startAnimation(0, 0, true)
      for (let i = 1; i < batch; i++) {
        this.calcDelayDuration()
        startTime = this.startAnimation(startTime, i, true)
      }
    },
    executeTaskEx: function () {
      const batch = 3
      this.createDevicesSetting()
      this.setRepairedNodes()
      this.calcDelayDuration()
      let startTime = this.startAnimation(0, 0, true)
      this.deviceSelect(0, startTime)
      this.createDevicesSetting()
      for (let i = 1; i < batch; i++) {
        this.calcDelayDuration()
        startTime = this.startAnimation(startTime, i, true)
        this.deviceSelect(i, startTime)
        this.createDevicesSetting()
      }
    },
    executeTaskAsync: function () {
      const batch = 4
      this.createDevicesSetting()
      this.setRepairedNodes()
      // init
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          node.delay = 0
          node.repair = 0
          node.wait = 0
          node.duration = 0
        }
      }
      for (let i = 0; i < batch; i++) {
        this.calcDelayDurationAsync()
        this.startAnimation(0, i, false)
      }
    },
    calcDelayDurationAsync: function () {
      for (let i = 0; i < this.module.layersNum; i++) {
        for (let j = 0; j < this.module.layers[i].nodesNum; j++) {
          const node = this.module.layers[i].nodes[j]
          node.delay = node.delay + node.duration + node.wait
          node.duration = node.cost[node.group]
          // cal whether it need wait
          if (i < this.module.layersNum - 1) {
            let maxi = 0
            for (let parentId of node.connections) {
              const parent = this.module.layers[i + 1].nodes[parentId]
              if (parent.duration + parent.delay > maxi) {
                maxi = parent.duration + parent.delay
              }
            }
            if (maxi > node.delay + node.duration) {
              node.wait = maxi - node.delay - node.duration
            } else {
              node.wait = 0
            }
          }
          // cal the delay time
          if (i > 0) {
            let maxi = 0
            for (let childId of node.connectBy) {
              const child = this.module.layers[i - 1].nodes[childId]
              if (child.time[child.group] + child.delay > maxi) {
                maxi = child.time[child.group] + child.delay
              }
            }
            node.delay = maxi
          }
          console.log(i, j, ' ', node.delay)
        }
      }
    },
    calcDelayDuration: function () {
      for (let i = 0; i < this.devicesSetting.length; i++) { // layer
        for (let j = 0; j < this.devicesSetting[i].length; j++) { // device
          let GPUCost = 0
          let CPUCost = 0
          // let IOCost = 0
          // const GPURates = this.devices.devs[j].GPURate
          // const CPURates = this.devices.devs[j].CPURate
          // const IORates = this.devices.devs[j].IORate
          const layerDeviceNodes = this.devicesSetting[i][j]
          for (let k = 0; k < layerDeviceNodes.length; k++) {
            GPUCost += layerDeviceNodes[k].cost[0]
            CPUCost += layerDeviceNodes[k].cost[1]
            // IOCost += layerDeviceNodes[k].cost[2]
          }
          const duration = Math.max(GPUCost, CPUCost)
          console.log(duration)
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
            node.wait = 0
            // console.log(`lid: ${i}, nid: ${node.nid}, delay: ${node.delay}, duration: ${node.duration}`)
          }
        }
      }
    },
    deviceSelect: function (count, delay) {
      if (count === 0) {
        const node = this.devicesSetting[0][0][1]
        const nodeIndex = this.getNodeIndex(node.lid, node.nid)
        node.group = 2
        this.$refs.nodes[nodeIndex].changeGroup(node.group, delay)
      }
      if (count === 1) {
        const node = this.module.layers[1].nodes[1]
        const nodeIndex = this.getNodeIndex(node.lid, node.nid)
        node.group = 2
        this.$refs.nodes[nodeIndex].changeGroup(node.group, delay)
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
    loadModule: function () {
      // create nodes
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
        let layerLeft = (layerWidth - nodesWidth) / 2 + nodeWidth / 4
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
    reset: function () {
      for (let node of this.$refs.nodes) {
        node.reset()
      }
      for (let flow of this.$refs.flows) {
        flow.reset()
      }
      // const node = this.devicesSetting[0][2][1]
      // node.group = 0
      // const nIndex = this.getNodeIndex(node.lid, node.nid)
      // this.$refs.nodes[nIndex].changeGroup(0, 0)
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
  },
  mounted: function () {
    // move nodes to the top layer
    this.loadModule()
    this.$refs.nodesLayer.getStage().moveToTop()
  }
}
</script>

<style scoped>
</style>
