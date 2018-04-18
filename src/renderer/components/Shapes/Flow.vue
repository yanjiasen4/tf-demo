<template>
  <div>
    <v-line :config="configLine" ref="line"></v-line>
    <!-- TODO: Arrow Line -->
  </div>
</template>

<script>
export default {
  name: 'Flow',
  props: ['flowAttr'],
  data () {
    return {
      configLine: {
        points: this.flowAttr.points,
        stroke: 'black',
        storkeWidth: 4
      }
    }
  },
  created: function () {
  }
}
</script>

<style scoped>

</style>
