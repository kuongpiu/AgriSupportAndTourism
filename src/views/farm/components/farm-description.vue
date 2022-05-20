<template>
  <el-descriptions :column="2" size="medium">
    <el-descriptions-item
      key="address"
      label="Địa chỉ">{{ farm.ward.name }}, {{ farm.district.name }}, {{ farm.province.name }}
    </el-descriptions-item>
    <el-descriptions-item
      key="detailAddress"
      label="Cụ thể">{{ farm.detailAddress }}
    </el-descriptions-item>
    <el-descriptions-item
      v-for="des in Object.keys(farm.descriptions)"
      :key="des"
      :label="des">
      {{ farm.descriptions[des] }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: 'FarmDescription',
  props: {
    farm: {
      type: Object,
      required: true
    }
  }
}
</script>
