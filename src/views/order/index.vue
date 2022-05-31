<template>
  <el-card>
    <div v-if="hasOrder">
      <order
        v-for="order in orders"
        :key="order.orderNumber"
        :order="order"/>
    </div>
    <div v-else>
      <el-empty description="Chưa có đơn hàng nào">
      </el-empty>
    </div>
  </el-card>
</template>

<script>
import Order from './components/order'
import {getAllOrders} from "@/api/order";

export default {
  name: 'Index',
  components: {Order},
  data() {
    return {
      orders: []
    }
  },
  computed: {
    hasOrder() {
      return this.orders.length > 0
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    fetchOrders() {
      getAllOrders()
        .then(data => {
          this.orders = data.reverse()
          console.log('orders: ', data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
