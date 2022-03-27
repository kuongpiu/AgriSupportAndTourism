<template>
  <el-card class="box-card">
    <h2 style="float: left; padding-bottom: 10px;"><i class="icon-before el-icon-news"></i>Hoạt động gần đây</h2>
    <el-timeline style="clear: both">
      <el-timeline-item v-for="(item,index) of comment" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
          <p>{{ item.visitors }} tham gia</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      comment: [
        {
          timestamp: '2019/4/20',
          title: 'Trồng cây',
          content: 'Trồng 12 cây mít, 19 cây táo',
          visitors: 11
        },
        {
          timestamp: '2019/4/21',
          title: 'Bón phân',
          content: 'Bón Kali cho Hạt dẻ và Chuối',
          visitors: 12
        },
        {
          timestamp: '2019/4/22',
          title: 'Thu hoạch',
          content: 'Thu hoạch Xoài',
          visitors: 32
        },
        {
          timestamp: '2019/4/23',
          title: 'Chăm sóc thường lệ',
          content: 'Kiểm tra tình trạng vườn',
          visitors: 0
        }
      ]
    }
  },
  created() {
    this.comment = this.comment.reverse()
  }
}
</script>
<style lang="scss" scoped>
.box-card{
  .icon-before{
    padding-right: 10px;
  }
}
</style>
