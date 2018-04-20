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
        <diagram></diagram>
      </el-col>
      <el-col :span="6">
      </el-col>
    </el-main>
  </el-container>
</template>

<script>
  import Diagram from './Diagram'

  export default {
    name: 'main-page',
    components: { Diagram },
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

  body { font-family: 'Source Sans Pro', sans-serif; }

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
    border-top: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
  }

  .main:hover {
    box-shadow: 0 0 8px 0 rgba(232,237,250,.6);
  }
</style>
