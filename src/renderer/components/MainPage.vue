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
      <el-col :span="18" class="canvas">
        <diagram :devices="devices"></diagram>
      </el-col>
      <el-col :span="6" class="device-wrapper">
        <el-row class="device-pannel" v-for="(dev, index) of devices.devs" :key="index">
          <el-row class="device-header">
            <span>机器编号 {{ dev.did }}</span>
            <span class="tag" :style="{ backgroundColor: colors[dev.did] }"></span>
          </el-row>
          <el-row class="device-info">
            <el-col :span="8">
              <el-row>
                <i class="el-icon-imp-cpu"></i>
              </el-row>
              <span class="attr">CPU</span>
              <h4>{{ dev.CPURate }}</h4>
            </el-col>
            <el-col :span="8">
              <el-row>
                <i class="el-icon-imp-CPUchuliqi"></i>
              </el-row>
              <span class="attr">GPU</span>
              <h4>{{ dev.GPURate }}</h4>
            </el-col>
            <el-col :span="8">
              <el-row>
                <i class="el-icon-imp-chuanshu"></i>
              </el-row>
              <span class="attr">I/O</span>
              <h4>{{ dev.IORate }}</h4>
            </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-main>
  </el-container>
</template>

<script>
  import Devices from '../assets/devices/devs'
  import Diagram from './Diagram'
  import Colors from '../assets/colorsTable'

  export default {
    name: 'main-page',
    components: { Diagram },
    data () {
      return {
        devices: Devices.deviceConfig.dev1,
        colors: Colors.colors
      }
    },
    methods: {
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', "PingFang SC", sans-serif; }

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
    font-size: 40pt;
    vertical-align: middle;
    color: #444;
  }

  .main {
    background: rgb(248, 248, 248);
    padding-right: 0;
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
  }

  .main:hover {
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6);
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
    box-shadow: 0 4px 12px 0 rgba(232,237,250,.8);
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
    padding: 0 10px 0 10px;
    border-radius: 50%;
  }

  .device-info {
    margin-top: 10px;
    text-align: center;
  }

  i {
    font-size: 32px;
  }

  span .attr {
    font-size: 16px;
  }
</style>
