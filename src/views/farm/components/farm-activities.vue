<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="Hoàn thành hoạt động">
      <span>Dialog</span>
    </el-dialog>
    <el-transfer
      v-model="finishedActivities"
      :titles="['Hoạt động', 'Xong']"
      :data="activities"
      @change="handleMove"
      @right-check-change="handleViewActivities">
    </el-transfer>
  </div>
</template>

<script>
export default {
  name: 'FarmActivities',
  data() {
    return {
      activities: [
        {
          key: 1,
          label: 'Tưới nước',
          disable: false
        },
        {
          key: 2,
          label: 'Bón phân',
          disable: false
        },
        {
          key: 3,
          label: 'Phác cỏ',
          disable: false
        }
      ],
      finishedActivities: [],
      dialogVisible: false
    }
  },
  methods: {
    handleMove(value, direction, movedKeys) {
      if (direction === 'right' && movedKeys.length > 0) {
        console.log('value: ' + value)
        console.log('movedKeys: ' + movedKeys.length)
        this.dialogVisible = true
      }
    },
    handleViewActivities(currentItemsChecked, itemChanged) {
      console.log('View activities at the right list')
      console.log('current checked: ' + currentItemsChecked)
      console.log('change item: ' + itemChanged)
    }
  }
}
</script>

<style scoped>

</style>
