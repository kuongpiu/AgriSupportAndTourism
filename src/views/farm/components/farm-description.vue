<template>
  <el-descriptions :column="2" size="medium">
    <el-descriptions-item
      key="address"
      label="Địa chỉ">{{ farm.address }}</el-descriptions-item>
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
