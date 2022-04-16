<template>
  <el-card class="box-card">
    <h2 style="float: left; padding-bottom: 10px;"><i class="icon-before el-icon-guide"></i>{{post.title}}</h2>
    <div class="body" v-html="post.body"></div>
  </el-card>
</template>

<script>
export default {
  name: 'PostContent',
  props: ['post']
}
</script>

<style lang="scss" scoped>
.box-card{
  .body{
    clear: both;
    line-height: 25px;
  }
  .icon-before{
    padding-right: 10px;
  }
}
</style>
