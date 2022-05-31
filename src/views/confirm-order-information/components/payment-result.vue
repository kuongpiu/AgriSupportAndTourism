<template>
  <div>
    <div v-if="paymentSuccess">
      <el-result icon="success" title="Thanh toán đơn hàng thành công" subTitle="Cảm ơn quý khách đã tin tưởng, chúc quý khách một ngày tốt lành">
        <template slot="extra">
          <el-button type="primary" size="medium" icon="el-icon-s-home" @click="$router.push('/')">Trang chủ</el-button>
          <el-button type="success" size="medium" icon="el-icon-tickets" @click="$router.push('/order')">Xem đơn hàng</el-button>
        </template>
      </el-result>
    </div>
    <div v-else>
      <el-result icon="error" title="Thanh toán thất bại">
        <template slot="extra">
          <el-button type="primary" size="medium" icon="el-icon-s-home" @click="$router.push('/')">Trang chủ</el-button>
          <el-button type="success" size="medium" icon="el-icon-money" @click="$router.push('/confirm-order-information')">Thanh toán lại</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentResult',
  props: ['url'],
  data() {
    return {
      statusCode: ''
    }
  },
  computed: {
    paymentSuccess() {
      return this.statusCode === '00'
    }
  },
  created() {
    this.statusCode = this.$route.params.code
  }
}
</script>

<style scoped>

</style>
