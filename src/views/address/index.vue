<template>
  <div>
    <el-button
      style="width: 100%; margin-bottom: 20px"
      icon="el-icon-plus"
      type="primary"
      @click="showDialogAddAddress">Địa chỉ mới
    </el-button>
    <div v-if="hasAddress" style="padding-bottom: 60px">
      <address-item
        v-for="address in addresses"
        :key="address.id"
        :user-address="address"
        @clickAddressItem="handleClickAddressItem"/>
    </div>
    <el-empty v-else description="Chưa có địa chỉ nào">
    </el-empty>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :center="true"
      :top="'2vh'"
      :close-on-click-modal="false">
      <el-form ref="addressForm" :key="formKey" :model="addressForm" :rules="addressRules"
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
            v-if="dialogTitle==='Thêm địa chỉ'"
            :loading="buttonSaveLoading"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAddAddress">Thêm
          </el-button>
          <div v-else>
            <el-button
              :loading="buttonDeleteLoading"
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="alertDeleteAddress">Xóa
            </el-button>
            <el-button
              :loading="buttonSaveLoading"
              type="success"
              icon="el-icon-check"
              size="small"
              @click="handleUpdateAddress">Cập nhật
            </el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import AddressItem from './components/address-item'
import {searchDistricts, searchProvinces, searchWards} from "@/api/address";
import {mapGetters} from "vuex";

export default {
  name: 'Index',
  components: {AddressItem},
  data() {
    return {
      formKey: 0,
      dialogVisible: false,
      dialogTitle: '',
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
      buttonSaveLoading: false,
      buttonDeleteLoading: false
    }
  },
  computed: {
    ...mapGetters(['addresses']),
    hasAddress() {
      return this.addresses.length > 0
    }
  },
  methods: {
    showDialogAddAddress() {
      this.dialogTitle = 'Thêm địa chỉ'
      this.addressForm = {
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
      }
      this.dialogVisible = true
      this.formKey++
    },
    showDialogUpdateAddress() {
      this.dialogTitle = 'Cập nhật địa chỉ'
      this.dialogVisible = true
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
    alertDeleteAddress() {
      this.$confirm('Địa chỉ sẽ bị xóa vĩnh viễn, bạn có chắc không ?', 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      }).catch(() => {
        console.log('cancel delete !')
      })
    },
    handleDelete() {
      this.buttonDeleteLoading = true
      this.$store.dispatch('user/deleteAddress', this.addressForm.id)
        .then(() => {
          this.$message.success('Xóa thành công')
          this.dialogVisible = false
        })
        .catch(err => {
          this.$message.error('Lỗi khi xóa, vui lòng thử lại')
          console.log(err)
        })
        .finally(() => {
          this.buttonDeleteLoading = false
        })
    },
    handleUpdateAddress() {
      this.buttonSaveLoading = true
      this.$refs['addressForm'].validate(valid => {
        if (!valid) {
          this.$message.warning('Vui lòng điền đầy đủ thông tin')
          this.buttonSaveLoading = false
          return false
        }
        console.log('update address', this.addressForm)
        this.$store.dispatch('user/updateAddress', this.addressForm)
          .then(data => {
            this.$message.success('Cập nhật địa chỉ thành công')
            this.dialogVisible = false
          })
          .catch(err => {
            this.$message.error('Cập nhật địa chỉ thất bại, vui lòng thử lại sau')
            console.log(err)
          })
          .finally(() => {
            this.buttonSaveLoading = false
          })
      })
    },
    handleClickAddressItem(address) {
      console.log('click address item', address)
      this.showDialogUpdateAddress()
      this.addressForm = {
        id: address.id,
        receiver: address.receiver,
        phoneNumber: address.phoneNumber,
        province: {
          name: address.province.name,
          id: address.province.id
        },
        district: {
          name: address.district.name,
          id: address.district.id,
          provinceId: address.district.provinceId
        },
        ward: {
          name: address.ward.name,
          id: address.ward.id,
          districtId: address.ward.districtId
        },
        detail: address.detail
      }
    },
    // ---------------------------------------------------
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
.address-input {
  display: inline-block;
  width: 400px;
}

.el-form-item {
  /*margin-bottom: 10px;*/
}
</style>
