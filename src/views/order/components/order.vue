<template>
  <el-card style="margin-bottom: 10px">
    <div v-if="order.farm.name" slot="header">
      <i class="el-icon-house" style="color: #4A9FF9; margin-right: 10px"/>
      <span style="color: rgb(65 99 129); font-size: large; font-weight: bold"> {{ order.farm.name }}</span>
      <div v-if="order.status" style="float: right; text-align: right">
        <span style="display:block;color: #78e590; font-weight: 500;margin-bottom: 4px; margin-top: -10px">
          {{ order.status }}</span>
        <span style="color: #010202; font-weight: 500; font-size: small;">
          {{ order.orderTime }} {{ order.orderDate }}</span>
      </div>
    </div>
    <div style="margin-top: -15px">
      <order-detail
        v-for="(orderDetail, index) in order.orderedProducts"
        :key="index"
        :order-detail="orderDetail"
        class="order-detail"/>
    </div>
    <div style="float: right; margin-top: -20px">
      <h3 style="font-weight: normal; display: inline-block">Tổng tiền:
        <span style="color: red">{{ convertPriceToVND(amount) }}</span></h3>
    </div>
    <div style="float: left; text-align: left;padding-bottom: 20px">
      <span v-if="order.paymentMethod === 'cod'" style="color: #4A9FF9FF">Thanh toán khi nhận hàng</span>
      <span v-else style="color: red">Đã thanh toán</span>
    </div>
  </el-card>
</template>

<script>
import OrderDetail from "./orderdetail";
import {convertPriceToVND} from "@/utils/price";

export default {
  name: 'Order',
  components: {OrderDetail},
  props: ['order'],
  data() {
    return {
      convertPriceToVND
    }
  },
  computed: {
    amount() {
      let amount = 0
      for (const orderDetail of this.order.orderedProducts) {
        amount += orderDetail.price * orderDetail.quantity
      }
      return amount
    }
  }
}
</script>

<style scoped>
.order-detail {
}

.order-detail:last-child {
  border-bottom: none;
}
</style>
