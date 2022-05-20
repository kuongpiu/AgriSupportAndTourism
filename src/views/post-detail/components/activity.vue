<template>
  <el-card v-show="farm.id != null" class="box-card">
    <h2 style="float: left; padding-bottom: 10px;"><i class="icon-before el-icon-news"></i>Hoạt động gần đây</h2>
    <el-timeline style="clear: both">
      <el-timeline-item v-for="(item,index) of farmCareHistoryList" :key="index"
                        :timestamp="item.farmCareHistoryDTO.careDate" placement="top">
        <el-card>
          <h3 style="display: inline-block">{{ item.farmCareHistoryDTO.activity.name }}</h3>
          <span style="display: inline-block; float: right; border-bottom: 1px solid #4A9FF9"> {{
              item.farmCareHistoryDTO.careTime
            }} </span>

          <el-collapse>
            <el-collapse-item
              v-for="treeCare of item.farmCareHistoryDTO.treeCares"
              :key="treeCare.id"
              :title="treeCare.tree.name">
              <span v-if="treeCare.status != null && treeCare.status.length > 0"> <i style="color: #2ac06d"
                                                          class="el-icon-s-claim"/> {{ treeCare.status }}  </span>
              <span v-else> <i style="color: #f9944a" class="el-icon-s-release"/> Không có thông tin chi tiết</span>
            </el-collapse-item>
          </el-collapse>

          <div style="margin-top: 20px">
            <el-popover
              v-for="visitor of item.visitors"
              :key="visitor.username"
              placement="top-start"
              width="350"
              trigger="hover">
              <div>
                <el-avatar
                  shape="square"
                  :size="100"
                  fit="cover"
                  style="display: inline-block; float: left"
                  :src="visitor.avatar">
                </el-avatar>
                <div style="display: inline-block; margin-left: 20px">
                  <h4>{{ visitor.name }}</h4>
                  <p>{{ visitor.address }}</p>
                </div>
              </div>
              <el-avatar
                slot="reference"
                shape="circle"
                :size="40"
                fit="cover"
                style="margin-right: 2px;"
                :src="visitor.avatar">
              </el-avatar>
            </el-popover>
            <el-avatar
              shape="circle"
              :size="40"
              fit="cover"
              style="margin-right: 2px;">
              +33
            </el-avatar>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-card>
</template>

<script>
import {getAllFarmCares} from "@/api/farm-care";

export default {
  props: {
    farm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      farmCareHistoryList: []
    }
  },
  created() {
    this.fetchFarmCareHistory()
  },
  methods: {
    fetchFarmCareHistory() {
      if (this.farm.id === undefined) {
        console.log('cannot get farm care history, farm id == undifined !')
        return
      }
      getAllFarmCares(this.farm.id)
        .then(data => {
          console.log('load farm care history successfully, ', data)
          this.farmCareHistoryList = data
        })
        .catch(err => {
          this.$message.error('Lỗi khi tải lịch sử chăm sóc vườn')
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  .icon-before {
    padding-right: 10px;
  }
}
.box-center {
  margin: 0 auto;
  display: table;
}
</style>
