<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <img src="../assets/images/header-logo@2x.jpg" width="88">
        </el-col>
        <el-col :span="20">
          <h1>TensorFlow Demo</h1>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="main">
      <el-row>
        <timer ref="timer"></timer>
      </el-row>
      <el-row>
        <el-col :span="5" class="timer-wrapper">
          <el-row class="timer-header">
            <h1>任务消耗时间</h1>
          </el-row>
          <el-row class="timer-records">
            <transition-group name="bar">
              <el-row v-for="(roc, index) of records" :key="index">
                <el-col :span="22" class="timer-list">
                  <div class="timer-bar" :style="{ width: (100 * roc.width) + '%' }">
                    <p>{{ (roc.time).toFixed(2) }}s</p>
                  </div>
                </el-col>
                <el-col :span="2" class="timer-tag">
                  <span>#{{ roc.name }}</span>
                </el-col>
              </el-row>
            </transition-group>
          </el-row>
        </el-col>
        <el-col :span="14">
          <diagram :devices="devices" :module="moduleInput[module]" class="canvas" ref="diagram"></diagram>
          <el-row class="button-pannel">
            <el-button @click="executeTask" :loading="progressing">开始任务</el-button>
            <el-button @click="reset">重置</el-button>
            <el-radio-group v-model="moduleInput">
              <el-radio-button v-for="(item, index) of modules" :key="index" :label="item.name"></el-radio-button>
            </el-radio-group>
          </el-row>
        </el-col>
        <el-col :span="5" class="device-wrapper">
          <el-row class="device-pannel" v-for="(dev, index) of devices.devs" :key="index" @mouseenter.native="dev.hover = true" @mouseleave.native="dev.hover = false">
            <el-row class="device-header">
              <span> {{ dev.name }}</span>
              <span class="tag" :style="{ backgroundColor: colors[dev.did] }"></span>
            </el-row>
            <!-- <el-row class="device-info">
              <el-col :span="12">
                <el-row>
                  <i class="el-icon-imp-cpu"></i>
                </el-row>
                <span class="attr">CPU</span>
                <h4>{{ dev.CPURate }}</h4>
              </el-col>
              <el-col :span="12">
                <el-row>
                  <i class="el-icon-imp-CPUchuliqi"></i>
                </el-row>
                <span class="attr">GPU</span>
                <h4>{{ dev.GPURate }}</h4>
              </el-col>
            </el-row> -->
            <!-- transition name="pull">
              <el-row class="device-setting" v-if="dev.hover">
                <el-row>
                  <el-col :span="6" class="slider-tag">
                    <span>GPU</span>
                  </el-col>
                  <el-col :span="18" class="slider-wrapper">
                    <el-slider v-model="dev.GPURate" :min="minRate" :max="maxRate"></el-slider>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6" class="slider-tag">
                    <span>CPU</span>
                  </el-col>
                  <el-col :span="18" class="slider-wrapper">
                    <el-slider v-model="dev.CPURate" :min="minRate" :max="maxRate"></el-slider>
                  </el-col>
                </el-row>
              </el-row>
            </transition  -->

          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import Devices from '../assets/devices/devs'
  import Diagram from './Diagram'
  import Timer from './Timer'
  import Colors from '../assets/colorsTable'
  import Module0 from '../assets/modules/md0'
  import Module1 from '../assets/modules/md1'

  import { mapState } from 'vuex'

  export default {
    name: 'main-page',
    components: {
      Diagram, Timer
    },
    data () {
      let devs = Devices.deviceConfig.dev1.devs
      for (let i = 0; i < Devices.deviceConfig.dev1.devNum; i++) {
        devs[i].hover = false
      }
      return {
        devices: Devices.deviceConfig.dev1,
        colors: Colors.colors,
        minRate: 1,
        maxRate: 20,
        progressing: false,
        taskName: 1,
        records: [],
        module: 'module1',
        modules: ['module0', 'module1'],
        moduleInput: {
          'module0': Module0.module,
          'module1': Module1.module
        }
      }
    },
    computed: {
      ...mapState({
        time: state => state.Timer.time
      })
    },
    methods: {
      executeTask: function () {
        this.$refs.diagram.executeTaskAsync()
        this.$refs.timer.startProgress(this.time)
        this.taskName += 1
        this.progressing = true
        setTimeout(() => {
          this.records.push({
            name: this.taskName,
            time: this.time,
            width: 0
          })
          this.calcBarWidthPercent()
          this.progressing = false
        }, this.time * 1000)
      },
      reset: function () {
        this.$refs.diagram.reset()
        this.$refs.timer.reset()
      },
      calcBarWidthPercent: function () {
        let max = 0
        for (let roc of this.records) {
          if (max < roc.time) max = roc.time
        }
        this.records.forEach(element => {
          element.width = element.time / max
        })
      }
    }
  }
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei";
  }

  .header {
    min-height: 100px;
    width: 530px;
    padding: 6px 12px 6px 12px;
    margin: 0 30% 0 30%;
    /* background: url('../assets/images/header-bg@2x.jpg');
    background-size: cover;
    background-position: center; */
  }

  .header h1 {
    padding-top: 8px;
    text-align: center;
    font-size: 36pt;
    line-height: 52pt;
    vertical-align: middle;
    color: #444;
  }

  .main {
    background: rgb(248, 248, 248);
    padding: 0 0 12px 0;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
  }

  .main:hover {
    box-shadow: 0 0 8px 0 rgba(232, 237, 250, .6);
  }

  .button-pannel {
    text-align: center;
  }

  .device-wrapper {
    padding: 10px 0px 10px 10px;
    margin-top: 60px;
  }

  .device-pannel {
    padding: 12px 10px 12px 10px;
    margin: 10px 0px 10px 10px;
    background: white;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    border-left: 1px solid #ebebeb;
    border-radius: 4px;
  }

  .device-pannel:hover {
    box-shadow: 0 4px 12px 0 rgba(232, 237, 250, .8);
  }

  .device-header {
    padding: 8px 0 8px 0;
    border-bottom: 1px solid #eee;
  }

  .device-header span {
    padding-left: 6px;
    padding-right: 10px;
  }

  .device-header .tag {
    padding: 0 9px 0 9px;
    border-radius: 50%;
  }

  .device-info {
    margin-top: 10px;
    text-align: center;
  }

  span .attr {
    font-size: 16px;
  }

  .pull-enter-active {
    transition: all .5s;
  }

  .pull-leave-active {
    transition: all 0;
  }

  .pull-enter,
  .pull-leave {
    opacity: 0;
  }

  .slider-wrapper {
    padding: 6px 16px 6px 0px;
  }

  .slider-tag {
    padding: 14px 0 8px 18px;
  }

  .timer-wrapper {
    padding: 20px 12px 20px 0;
    margin-top: 60px;
    background: white;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
    border-right: 1px solid #ebebeb;
    border-radius: 4px;
  }

  .timer-wrapper:hover {
    box-shadow: 0 4px 12px 0 rgba(232, 237, 250, .8);
  }

  .timer-wrapper .timer-header {
    text-align: center;
    padding: 4px 8px 8px 4px;
    margin-left: 8px;
    border-bottom: 1px solid #eeeeee;
  }

  .timer-wrapper .timer-header h1 {
    text-align: center;
  }

  .timer-wrapper .timer-records {
    padding: 12px 0 0 0;
  }

  .timer-list {
    padding: 0 8px 0 0;
  }

  .timer-bar {
    background: #3b88fc;
    height: 16px;
    margin: 8px 4px 0 0;
    padding: 0 4px 0 0;
  }

  .timer-bar p {
    text-align: right;
    color: white;
    line-height: 15px;
  }

  .timer-tag {
    padding-top: 7px;
  }

  .bar-enter-active {
    transition: all .8s ease;
  }

  .bar-enter {
    transform: translateX(-80px);
    opacity: 0;
  }
</style>