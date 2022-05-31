<template>
  <div style="margin: 15px">
    <el-row :gutter="5">
      <el-col :span="14">
        <el-card>
          <span slot="header" style="font-weight: 600; text-align: center">Thông tin sản phẩm</span>
          <div style="margin-top: -20px">
            <order-detail
              v-for="(orderDetail, index) in orderedProducts"
              :key="index"
              :order-detail="orderDetail"
              class="order-detail"/>
            <h5
              style="color: #5a5e66;font-weight: 500;margin-top: -35px; display: inline-block; float: right; border-left: 1px solid #99a9bf; padding: 15px 10px;">
              Tổng tiền:
              <span style="color: red; font-size: medium">{{ convertPriceToVND(cartAmount) }}</span></h5>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <div>
          <el-card>
            <div slot="header">
              <span style="font-weight: 600; text-align: center">Địa chỉ giao hàng</span>
              <div style="float: right; position: relative; top: -10px;">
                <div v-if="hasAddress">
                  <el-button
                    v-if="!changeAddress"
                    plain
                    type="primary"
                    icon="el-icon-refresh"
                    @click="changeAddress = true">
                    Đổi địa chỉ
                  </el-button>
                  <span
                    v-else
                    style="color: #f9944a; position: relative; top: 10px;"
                  >Chọn địa chỉ giao hàng</span>
                </div>
                <div v-else>
                  <el-button
                    plain
                    type="primary"
                    icon="el-icon-plus"
                    @click="dialogVisible=true">
                    Thêm địa chỉ
                  </el-button>
                </div>
              </div>
            </div>
            <div v-if="hasAddress" style="margin-top: -10px">
              <address-item
                v-if="!changeAddress"
                :user-address="addresses[addressIndex]"/>
              <div v-else>
                <address-item
                  v-for="(userAddress, index) in addresses"
                  :key="userAddress.id"
                  :user-address="userAddress"
                  @clickAddressItem="handleClickAddressItem(index)"/>
              </div>
            </div>
          </el-card>
        </div>
        <div style="margin-top: 10px">
          <el-card>
            <span slot="header" style="font-weight: 600; text-align: center">Hình thức thanh toán</span>
            <div>
              <el-radio v-model="paymentMethod" label="cod" class="radio-container">
              <span slot="default" class="radio-text"> <svg-icon icon-class="icon-payment-method-cod" class="icon"/>
                Thanh toán khi nhận hàng</span>
              </el-radio>
              <el-radio v-model="paymentMethod" label="vnpay" class="radio-container">
              <span slot="default" class="radio-text"> <svg-icon icon-class="vnpay-logo-inkythuatso"
                                                                 class="icon"/>
                Thanh toán trực tuyến qua VNPay</span>
              </el-radio>
            </div>
            <el-button
              :loading="buttonOrderLoading"
              class="order-button"
              type="danger"
              @click="handleOrderClick">
              Đặt hàng
            </el-button>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="'Thêm địa chỉ'"
      :visible.sync="dialogVisible"
      :center="true"
      :top="'2vh'"
      :close-on-click-modal="false">
      <el-form ref="addressForm" :model="addressForm" :rules="addressRules"
               style="padding-bottom: 45px;">
        <el-form-item prop="receiver" tabindex="1">
          <span slot="label" style="display: inline-block;width: 90px; text-align: left ">Họ và Tên</span>
          <el-input v-model="addressForm.receiver" class="address-input" placeholder="Họ và tên"/>
        </el-form-item>
        <el-form-item prop="phoneNumber" tabindex="2">
          <span slot="label" style="display: inline-block;width: 90px; text-align: left ">Số điện thoại</span>
          <el-input v-model="addressForm.phoneNumber" class="address-input" placeholder="Số điện thoại"/>
        </el-form-item>
        <el-form-item prop="province" tabindex="3">
          <span slot="label" style="display: inline-block;width: 90px; text-align: left ">Tỉnh</span>
          <el-autocomplete
            ref="inputProvince"
            v-model="addressForm.province.name"
            class="address-input"
            placeholder="Cấp tỉnh"
            value-key="name"
            :fetch-suggestions="fetchProvinceSuggestions"
            @select="handleSelectProvince"/>
        </el-form-item>
        <el-form-item prop="district" tabindex="4">
          <span slot="label" style="display: inline-block;width: 90px; text-align: left ">Huyện</span>
          <el-autocomplete
            ref="inputDistrict"
            v-model="addressForm.district.name"
            class="address-input"
            value-key="name"
            placeholder="Cấp huyện"
            :fetch-suggestions="fetchDistrictSuggestions"
            @focus="focusDistrict"
            @select="handleSelectDistrict"/>
        </el-form-item>
        <el-form-item prop="ward" tabindex="5">
          <span slot="label" style="display: inline-block;width: 90px; text-align: left ">Xã</span>
          <el-autocomplete
            ref="inputWard"
            v-model="addressForm.ward.name"
            class="address-input"
            value-key="name"
            placeholder="Cấp xã"
            :fetch-suggestions="fetchWardSuggestions"
            @select="handleSelectWard"
            @focus="focusWard"/>
        </el-form-item>
        <el-form-item prop="detail" tabindex="6">
          <span slot="label" style="display: inline-block;width: 90px; text-align: left ">Vị trí cụ thể</span>
          <el-input v-model="addressForm.detail" type="textarea" :autosize="{minRows: 2, maxRows: 4}"
                    class="address-input" placeholder="Vị trí cụ thể"/>
        </el-form-item>

        <div style="float: right; margin-top: 10px">
          <el-button
            :loading="buttonSaveLoading"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAddAddress">Thêm
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import OrderDetail from '@/views/order/components/orderdetail'
import AddressItem from '@/views/address/components/address-item'
import {convertPriceToVND} from "@/utils/price";
import {mapGetters} from "vuex";
import {insertOrders} from "@/api/order";
import {searchDistricts, searchProvinces, searchWards} from "@/api/address";

export default {
  name: 'Index',
  components: {OrderDetail, AddressItem},
  data() {
    return {
      orderedProducts: [],
      paymentMethod: 'cod',
      addressIndex: 0,
      changeAddress: false,
      buttonOrderLoading: false,
      convertPriceToVND,
      dialogVisible: false,
      addressForm: {
        receiver: '',
        phoneNumber: '',
        province: {
          name: ''
        },
        district: {
          name: ''
        },
        ward: {
          name: ''
        },
        detail: ''
      },
      addressRules: {
        receiver: [
          {validator: this.checkReceiver}
        ],
        phoneNumber: [
          {validator: this.checkPhoneNumber}
        ],
        province: [
          {validator: this.checkProvince}
        ],
        district: [
          {validator: this.checkDistrict}
        ],
        ward: [
          {validator: this.checkWard}
        ],
        detail: [
          {validator: this.checkDetailAddress}
        ]
      },
      buttonSaveLoading: false
    }
  },
  computed: {
    ...mapGetters(['cart', 'addresses']),
    hasItemInCart() {
      return this.cart.length > 0
    },
    cartAmount() {
      let amount = 0
      for (const cartItem of this.cart) {
        amount += cartItem.quantity * cartItem.shortProductDTO.price
      }
      return amount
    },
    hasAddress() {
      return this.addresses.length > 0
    }
  },
  created() {
    this.$store.dispatch('cart/getCart').then(data => {
      console.log('cart', this.cart)
      this.orderedProducts = this.cart.map(rawProduct => {
        return {
          // farmId: rawProduct.shortProductDTO.farmId,
          productId: rawProduct.shortProductDTO.id,
          mainImage: rawProduct.shortProductDTO.mainImage,
          name: rawProduct.shortProductDTO.name,
          price: rawProduct.shortProductDTO.price,
          quantity: rawProduct.quantity
        }
      })
      console.log('orderedProducts', this.orderedProducts)
    })
  },
  methods: {
    handleClickAddressItem(index) {
      this.addressIndex = index
      this.changeAddress = false
    },
    handleOrderClick() {
      if (!this.hasAddress) {
        this.$message.warning('Vui lòng thêm địa chỉ nhận hàng')
        return
      }
      const orderedProducts = this.orderedProducts.map(orderedProduct => {
        return {
          productId: orderedProduct.productId,
          quantity: orderedProduct.quantity
        }
      })
      const orderForm = {
        address: {
          id: this.addresses[this.addressIndex].id
        },
        itemOrders: orderedProducts,
        paymentMethod: this.paymentMethod
      }
      console.log('orderForm', orderForm)
      this.buttonOrderLoading = true
      insertOrders(orderForm)
        .then((data) => {
          console.log(data)
          if (data.url == null || data.status === 'cod') {
            this.$message.success('Đặt hàng thành công. Cám ơn bạn đã mua hàng')
            this.$store.dispatch('cart/getCart')
            this.$router.push('/order')
          } else {
            window.location.href = data.url
          }
        })
        .catch(err => {
          this.$message.error('Lỗi khi đặt hàng, vui lòng thử lại sau')
          // this.$message.error('Lỗi khi thanh toán, vui lòng thử lại sau')
          console.log(err)
        })
        .finally(() => {
          this.buttonOrderLoading = false
        })
    },
    handleAddAddress() {
      this.buttonSaveLoading = true
      this.$refs['addressForm'].validate(valid => {
        if (!valid) {
          this.$message.warning('Vui lòng điền đầy đủ thông tin')
          this.buttonSaveLoading = false
          return false
        }
        console.log('add address', this.addressForm)
        this.$store.dispatch('user/insertAddress', this.addressForm)
          .then(data => {
            this.$message.success('Thêm địa chỉ thành công')
            this.dialogVisible = false
          })
          .catch(err => {
            this.$message.error('Thêm địa chỉ thất bại, vui lòng thử lại sau')
            console.log(err)
          })
          .finally(() => {
            this.buttonSaveLoading = false
          })
      })
    },
    // -------------------------------------------------------
    checkReceiver: function (rule, value, callback) {
      if (!value || value.length === 0 || !value.trim()) {
        callback(new Error('Họ và tên là thông tin bắt buộc !'))
      }
      callback()
    },
    checkPhoneNumber: function (rule, value, callback) {
      if (!value || value.length === 0 || !value.trim()) {
        callback(new Error('Số điện thoại là thông tin bắt buộc !'))
      }
      callback()
    },
    checkProvince: function (rule, value, callback) {
      if (value.id === undefined) {
        callback(new Error('Tỉnh là thông tin bắt buộc'))
      } else {
        callback()
      }
    },
    checkDistrict: function (rule, value, callback) {
      if (value.id === undefined) {
        callback(new Error('Huyện là thông tin bắt buộc'))
      } else {
        callback()
      }
    },
    checkWard: function (rule, value, callback) {
      if (value.id === undefined) {
        callback(new Error('Xã là thông tin bắt buộc'))
      } else {
        callback()
      }
    },
    checkDetailAddress: function (rule, value, callback) {
      if (!value || value.length === 0 || !value.trim()) {
        callback(new Error('Chưa có địa chỉ !'))
      }
      callback()
    },
    fetchProvinceSuggestions(name, cb) {
      searchProvinces(name)
        .then(data => {
          cb(data)
        })
    },
    fetchDistrictSuggestions(name, cb) {
      const provinceId = this.addressForm.province.id
      if (provinceId === undefined) {
        return
      }
      searchDistricts(provinceId, name)
        .then(data => {
          cb(data)
        })
    },
    fetchWardSuggestions(name, cb) {
      const districtId = this.addressForm.district.id
      if (districtId === undefined) {
        return
      }
      searchWards(districtId, name)
        .then(data => {
          cb(data)
        })
    },
    focusDistrict() {
      if (this.addressForm.province.id === undefined) {
        this.$message.warning('Vui lòng chọn Tỉnh trước')
        this.$refs['inputDistrict'].$refs.input.blur()
      }
    },
    focusWard() {
      if (this.addressForm.province.id === undefined) {
        this.$message.warning('Vui lòng chọn Tỉnh')
        this.$refs['inputWard'].$refs.input.blur()
      } else if (this.addressForm.district.id === undefined) {
        this.$message.warning('Vui lòng chọn Huyện')
        this.$refs['inputWard'].$refs.input.blur()
      }
    },
    handleSelectProvince(province) {
      this.addressForm.province = province
      console.log('select province, ', province)
      this.addressForm.district = {name: ''}
      this.addressForm.ward = {name: ''}
    },
    handleSelectDistrict(district) {
      this.addressForm.district = district
      console.log('select district, ', district)
      this.addressForm.ward = {name: ''}
    },
    handleSelectWard(ward) {
      this.addressForm.ward = ward
      console.log('select ward, ', ward)
    }
  }
}
</script>

<style scoped>
.order-detail {
  margin-top: -25px;
}

.order-detail:last-child {
  border-bottom: none;
}

.icon {
  width: 30px;
  height: 30px;
  position: relative;
  top: 6px;
  margin-right: 15px;
}

.radio-container {
  display: block;
  margin-bottom: 20px;
}

.order-button {
  width: 100%;
  margin-top: 20px;
  font-weight: 600;
  padding: 15px 10px;
  font-size: large
}
</style>
