<template>
  <el-card class="box-card">
    <h1 style="padding-bottom: 10px;">
      <i class="icon-before el-icon-guide"></i>{{ post.title }}</h1>
    <h4 style="color: #478cea; text-align: right">{{ post.ward.name }}, {{ post.district.name }},
      {{ post.province.name }}<i style="margin-left: 5px" class="el-icon-place"></i></h4>
    <h4 v-if="post.detailAddress.trim().length > 0" style="color: #478cea; text-align: right"">Cụ thể:
    {{ post.detailAddress }}<i style="margin-left: 5px" class="el-icon-place"></i></h4>
    <br>
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
.box-card {
  .body {
    clear: both;
    line-height: 25px;
  }

  .icon-before {
    padding-right: 10px;
  }
}
</style>
