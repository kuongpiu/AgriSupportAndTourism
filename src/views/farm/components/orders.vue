<template>
  <div>
    <el-card>
      <el-table
        :data="orders"
        size="large"
        style="width: 100%; padding-bottom: 50px; font-size: medium; font-weight: normal"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick">
        <el-table-column
          prop="orderDate"
          width="120"
          label="Ngày"/>
        <el-table-column
          label="Người mua"
          width="170">
          <template slot-scope="{row}">
            <div class="user-info">
              <el-avatar size="medium" :src="row.address.user.avatar" fit="cover"></el-avatar>
              <div class="name">
                <span>{{ row.address.user.username }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Tổng"
          width="120">
          <template slot-scope="scope"><span style="color: red; font-weight: 500; font-size: medium">{{
              calculateOrderAmount(scope.row)
            }}</span></template>
        </el-table-column>
        <el-table-column
          label="Thanh toán">
          <template slot-scope="scope">
            <span style="word-break: break-word">{{ paymentMethod(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="Trạng thái">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-select v-model="row.status" placeholder="Trạng thái">
                <el-option
                  v-for="status in statusOptions"
                  :key="status"
                  :label="status"
                  :value="status">
                </el-option>
              </el-select>
            </template>
            <span v-else>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Hành động" width="220">
          <template slot-scope="{row}">
            <div v-if="row.edit">
              <el-button
                type="success"
                size="small"
                icon="el-icon-check"
                @click.prevent.stop="confirmEdit(row)"
              >
                Lưu
              </el-button>
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click.prevent.stop="cancelEdit(row)"
              >
                Hủy
              </el-button>
            </div>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click.prevent.stop="row.edit=!row.edit"
            >
              Sửa
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :center="true"
      :close-on-click-modal="false"
      :top="'2vh'"
      :width="'80%'">
      <el-row :gutter="10">
        <el-col :span="13">
          <el-card>
            <span slot="header" style="font-weight: 600; text-align: center">Thông tin sản phẩm</span>
            <div style="margin-top: -20px">
              <order-detail
                v-for="(orderDetail, index) in currentOrder.orderedProducts"
                :key="index"
                :order-detail="orderDetail"
                class="order-detail"/>
              <h5
                style="color: #5a5e66;font-weight: 500;margin-top: -35px; display: inline-block; float: right; border-left: 1px solid #99a9bf; padding: 15px 10px;">
                Tổng tiền:
                <span style="color: red; font-size: medium">{{ convertPriceToVND(orderAmount) }}</span></h5>
            </div>
          </el-card>
        </el-col>
        <el-col :span="11">
          <el-card style="margin-bottom: 10px">
            <div slot="header">
              <span style="font-weight: 600; text-align: center">Thông tin thanh toán</span>
              <span style="float: right; font-weight: 500; color: #78e590; font-size: medium">{{ paymentStatus }}</span>
            </div>
            <div class="payment-container">
              <span style="">{{ currentOrderPaymentMethod }}</span>
            </div>
          </el-card>
          <el-card v-if="currentOrder.address != null">
            <span slot="header" style="font-weight: 600; text-align: center">Địa chỉ giao hàng</span>
            <el-row class="receiver-info-container">
              <el-col :span="7">
                <span class="label-info">Họ tên</span>
              </el-col>
              <el-col :span="17">
                <span class="content-info">{{ currentOrder.address.receiver }}</span>
              </el-col>
            </el-row>
            <el-row class="receiver-info-container">
              <el-col :span="7">
                <span class="label-info">Số điện thoại</span>
              </el-col>
              <el-col :span="17">
                <span class="content-info">{{ currentOrder.address.phoneNumber }}</span>
              </el-col>
            </el-row>
            <el-row class="receiver-info-container">
              <el-col :span="7">
                <span class="label-info">Địa chỉ</span>
              </el-col>
              <el-col :span="17">
                <span class="content-info">{{ formatAddress(currentOrder.address) }}</span>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getAllOrdersInFarm, getOrderById, updateOrder} from "@/api/order";
import {convertPriceToVND} from "@/utils/price";
import OrderDetail from '@/views/order/components/orderdetail'
import AddressItem from '@/views/address/components/address-item'

export default {
  name: 'Orders',
  components: {OrderDetail, AddressItem},
  props: ['farmId'],
  data() {
    return {
      orders: [],
      dialogVisible: false,
      dialogTitle: '',
      currentOrder: {
        orderedProducts: []
      },
      convertPriceToVND,
      statusOptions: ['Tiếp nhận', 'Xử lý', 'Đã gửi', 'Hủy']
    }
  },
  computed: {
    orderAmount() {
      let amount = 0
      for (const orderDetail of this.currentOrder.orderedProducts) {
        amount += orderDetail.quantity * orderDetail.price
      }
      return amount
    },
    paymentStatus() {
      if (this.currentOrder.paymentMethod === 'cod') {
        return 'Chưa thanh toán'
      }
      return 'Đã thanh toán'
    },
    currentOrderPaymentMethod() {
      if (this.currentOrder.paymentMethod === 'cod') {
        return 'Thanh toán khi nhận hàng'
      }
      return 'Thanh toán trực tuyến qua VnPay'
    }
  },
  mounted() {
    getAllOrdersInFarm(this.farmId)
      .then(data => {
        this.orders = data.reverse().map(order => {
          this.$set(order, 'edit', false)
          order.originalStatus = order.status
          return order
        })
        console.log('orders in farm: ', this.orders)
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.status === 'Tiếp nhận') {
        return 'success-row'
      } else if (row.status === 'Đã gửi') {
        return 'sent-row'
      } else if (row.status === 'Hủy') {
        return 'reject-row'
      }
      return ''
    },
    getOrdersAmount(row) {
      let amount = 0
      for (const orderDetail of row.orderDetails) {
        amount += orderDetail.price * orderDetail.quantity
      }
      return amount
    },
    calculateOrderAmount(row) {
      if (row.paymentMethod === 'cod') {
        return convertPriceToVND(this.getOrdersAmount(row))
      } else if (row.paymentMethod === 'vnpay' && row.paymentId != null) {
        return convertPriceToVND(0)
      }
      return convertPriceToVND(this.getOrdersAmount(row))
    },
    paymentMethod(row) {
      if (row.paymentMethod === 'cod') {
        return 'Thanh toán khi nhận hàng'
      } else if (row.paymentMethod === 'vnpay' && row.paymentId != null) {
        return 'Đã thanh toán'
      }
      return 'Thanh toán khi nhận hàng'
    },
    formatAddress(address) {
      const separator = ', '
      let formattedAddress = ''
      if (address.detail.length > 0) {
        formattedAddress += address.detail + separator
      }
      formattedAddress += address.ward.name + separator
      formattedAddress += address.district.name + separator
      formattedAddress += address.province.name

      return formattedAddress
    },
    handleRowClick(row, column, event) {
      console.log('show order details in orderNumber: ' + row.orderNumber)
      getOrderById(row.orderNumber)
        .then(data => {
          this.currentOrder = data
          console.log(this.currentOrder)
          this.dialogVisible = true
          this.dialogTitle = 'Trạng thái đơn hàng: ' + this.currentOrder.status
        })
        .catch(err => {
          console.log(err)
          this.dialogVisible = false
          this.$message.error('Lỗi khi xem chi tiết đơn hàng, vui lòng thử lại sau')
        })
    },
    cancelEdit(row) {
      row.status = row.originalStatus
      row.edit = false
      this.$message({
        message: 'Hủy bỏ cập nhật',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      const updatedOrder = {
        orderNumber: row.orderNumber,
        status: row.status
      }
      updateOrder(updatedOrder)
        .then(() => {
          this.$message({
            message: 'Cập nhật trạng thái thành công',
            type: 'success'
          })
          row.originalStatus = row.status
          row.edit = false
        })
        .catch(err => {
          this.$message({
            message: 'Cập nhật trạng thái thất bại, vui lòng thử lại sau',
            type: 'error'
          })
          console.log(err)
        })
    }
  }
}
</script>

<style>
/*.el-table .reject-row {*/
/*  background: #d7a17a;*/
/*  color: #834d4d;*/
/*}*/

/*.el-table .success-row {*/
/*  color: #409eff;*/
/*}*/

.user-info {
  display: flex;
  justify-content: flex-start;
}

.receiver-info-container {
  word-break: break-word;
  margin-bottom: 10px;
  line-height: 20px;
}

.label-info {
  color: #99a9bf;
}

.content-info {
  color: #1378ee;
  font-weight: 500;
}

.header {
  background-color: black;
}

.name {
  margin-left: 10px;
}

.order-detail {
  margin-top: -25px;
}

.order-detail:last-child {
  border-bottom: none;
}

.payment-container {
  display: block;
  margin-bottom: 20px;
}
</style>
