<template>
  <v-stage ref="stage" :config="configKonva">
    <node :nodeAttr='configNode'></node>
  </v-stage>
</template>

<script>
import Node from './Shapes/Node'

export default {
  name: 'Canvas',
  components: { Node },
  data () {
    return {
      configKonva: {
        width: 200,
        height: 200
      },
      configNode: {
        x: 100,
        y: 100,
        radius: 50,
        groupId: 1
      }
    }
  },
  created: function () {
    this.configNode.x = 100
  }
}
</script>

<style scoped>

</style>

