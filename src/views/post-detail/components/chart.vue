<template>
  <el-card class="box-card">
    <span slot="header" class="clearfix"></span>
    <div class="container">
      <div class="block-info">
        <span class="text-title">Đã tới</span>
        <svg-icon class="icon" icon-class="peoples" />
        <br>
        <span class="text-content">2000</span>
      </div>
      <div class="block-info">
        <span class="text-title">Diện tích</span>
        <i class="el-icon-full-screen icon" />
        <br>
        <span class="text-content">20 ha</span>
      </div>
      <div class="block-info">
        <span class="text-title">Đã tới</span>
        <svg-icon icon-class="peoples" class="icon" />
        <br>
        <span class="text-content">2000</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'Chart'
}
</script>

<style scoped>
.container{
  height: 400px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.box-card{
  padding: 0;
  background-color: #f0f2f5;
}

.block-info{
  width: 30%;
  height: 100px;
  display: inline-block;
  margin: 5px;
  background-color: white;
  text-align: center;
  border-radius: 4px;
  padding: 10px;
  position: relative;
}
.text-title{
  font-size: medium;
  font-weight: bolder;
  line-height: 50px;
  color: #0e7450;
}

.text-content{
  line-height: 30px;
  font-size: large;
  font-weight: lighter;
  color: #8383b2;
}
.icon{
  color: #4dd9d5;
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: content-box;
  padding: 5px 5px 0px 0px;
}
</style>
