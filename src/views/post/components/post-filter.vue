<template>
  <el-card class="box-card container">
    <div slot="header" class="clearfix">
      <span>Tìm kiếm</span>
      <el-button style="float:right;" type="none" icon="el-icon-search" @click="searchPost"/>
    </div>
    <el-form :model="formSearch">
      <el-form-item label="Tên địa điểm">
        <el-input v-model="formSearch.name" placeholder="Tên địa điểm..."></el-input>
      </el-form-item>
<!--      <el-form-item prop="name">-->
<!--        <md-input v-model="formSearch.name" icon="el-icon-lollipop" name="name" placeholder="Tên địa điểm">-->
<!--          <i> </i>Tìm kiếm-->
<!--        </md-input>-->
<!--      </el-form-item>-->
      <el-form-item label="Hoạt động">
        <el-drag-select v-model="formSearch.activityTypes" style="width:100%;" multiple placeholder="Kiểu hoạt động">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-drag-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import ElDragSelect from '@/components/DragSelect'
import MdInput from '@/components/MDinput'
export default {
  name: 'PostFilter',
  components: {ElDragSelect, MdInput},
  data() {
    return {
      formSearch: {
        name: '',
        activityTypes: []
      },
      options: []
    }
  },
  methods: {
    searchPost: function () {
      console.log('search post: name field = ' + JSON.stringify(this.formSearch))
    }
  },
  created() {
    this.options = [
      {
        label: 'Trồng cây',
        value: 'Trồng cây'
      },
      {
        label: 'Tưới nước',
        value: 'Tưới nước'
      },
      {
        label: 'Chăm sóc cây',
        value: 'Chăm sóc cây'
      },
      {
        label: 'Thu hoạch',
        value: 'Thu hoạch'
      },
      {
        label: 'Hoạt động khác',
        value: 'Hoạt động khác'
      }
    ]
  }
}
</script>

<style scoped>
.container{
  margin-top: 20px;
  height: 400px;
}
</style>
