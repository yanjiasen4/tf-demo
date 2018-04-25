<template>
  <div>
    <div class="progress" :style="{ width: barWidthPercent + '%' }"></div>
    <div class="poster">
      <h1>{{ parseInt(this.time / 1000) }}.{{ parseInt(this.time % 1000) }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'timer',
  data () {
    return {
      time: 0,
      totalTime: 0,
      timer: null
    }
  },
  methods: {
    startProgress: function (totalTime) {
      totalTime *= 1000 // ms
      const interval = 66
      this.totalTime = totalTime
      console.log(totalTime)
      if (this.timer !== null) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.time += interval
        if (this.time > totalTime) this.time = totalTime
      }, interval)
      setTimeout(() => {
        clearInterval(this.timer)
      }, totalTime + 1 * interval)
    },
    reset: function () {
      this.time = 0
      this.totalTime = 0
    }
  },
  computed: {
    barWidthPercent: function () {
      if (this.totalTime === 0) return 0
      else return 100 * (this.time / this.totalTime)
    }
  }
}
</script>

<style scoped>
.progress {
  height: 4px;
  background: rgb(7, 201, 0);
}

.poster {
  height: 40px;
  width: auto;
  text-align: center;
}

.poster h1 {
  font-size: 38px;
  font-weight: bold;
}

</style>
