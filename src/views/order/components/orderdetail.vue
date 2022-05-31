<template>
  <div style="box-sizing: content-box; clear: both; margin-bottom: 5px; height: 100px;padding-bottom: 20px;">
    <div style="width: 100px; height: 100%; float: left;border-radius: 4px; border: 1px solid #bbbbbb;">
      <el-avatar style="width: 100%; height: 100%" shape="square" fit="cover"
                 :src="orderDetail.mainImage"></el-avatar>
    </div>
    <div style="width: 700px; height: 100px; margin-left: 120px">
      <div style="">
        <h4 style="font-weight: 500">{{ orderDetail.name }}</h4>
        <span style="display: block; padding-bottom: 3px; font-size: small">Số lượng: {{ orderDetail.quantity }}</span>
        <span style=" font-size: small">Giá: <span style="color: red">{{ convertPriceToVND(orderDetail.price) }}</span></span>
      </div>
    </div>
  </div>
</template>

<script>
import {convertPriceToVND} from '@/utils/price'

export default {
  name: 'OrderDetail',
  props: ['orderDetail'],
  data() {
    return {
      convertPriceToVND
    }
  }
}
</script>

<style scoped>

</style>
