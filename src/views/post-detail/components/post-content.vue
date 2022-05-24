<template>
  <el-card class="box-card">
    <h1 style="padding-bottom: 10px; font-weight: 500; display: inline-block; margin-top: 0">
      <i style="color: #2ca8a8" class="icon-before el-icon-guide"></i>{{ post.title }}
    </h1>
    <div style="display: inline-block; float: right">
      <el-tooltip content="Lịch sử hoạt động" placement="top" effect="dark" :open-delay="400">
        <el-button v-if="post.farmId" type="primary" :icon="activityActionIcon" round @click="handleClickActivity"/>
      </el-tooltip>
    </div>
    <h4 style="color: #478cea; text-align: right; font-weight: 500">{{ post.ward.name }}, {{ post.district.name }},
      {{ post.province.name }}<i style="margin-left: 5px" class="el-icon-place"></i></h4>
    <h4 v-if="post.detailAddress.trim().length > 0"
        style="color: #478cea; text-align: right; font-weight: 500; margin-top: -13px">Cụ thể:
      {{ post.detailAddress }}</h4>
    <br>
    <div class="body" v-html="post.body"></div>
  </el-card>
</template>

<script>
const OPEN_ICON = 'el-icon-arrow-left'
const CLOSE_ICON = 'el-icon-arrow-right'
export default {
  name: 'PostContent',
  props: ['post'],
  data() {
    return {
      OPEN_ICON,
      CLOSE_ICON,
      activityActionIcon: OPEN_ICON,
      isActivityHistoryTabOpened: false
    }
  },
  methods: {
    handleClickActivity() {
      this.isActivityHistoryTabOpened = !this.isActivityHistoryTabOpened
      if (this.isActivityHistoryTabOpened) {
        this.activityActionIcon = CLOSE_ICON
        this.$emit('OpenActivityHistoryTab')
      } else {
        this.activityActionIcon = OPEN_ICON
        this.$emit('CloseActivityHistoryTab')
      }
    }
  }
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
