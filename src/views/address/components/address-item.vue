<template>
  <el-button class="address-item" @click="handleClickAddressItem">
    <h3 style="font-weight: 500; margin-top: 0; color: #4A9FF9">{{ userAddress.receiver }}</h3>
    <span class="address-detail" style="word-break: break-word;"><span style="color: #7c6b6b">{{ address }}</span></span>
    <span class="address-detail" style="">Điện thoại:  <span
      style="color: #7C6B6BFF">{{ userAddress.phoneNumber }}</span></span>
  </el-button>
</template>

<script>
export default {
  name: 'AddressItem',
  props: ['userAddress'],
  created() {
  },
  computed: {
    address() {
      const separator = ', '
      let address = ''
      if (this.userAddress.detail.length > 0) {
        address += this.userAddress.detail + separator
      }
      address += this.userAddress.ward.name + separator
      address += this.userAddress.district.name + separator
      address += this.userAddress.province.name

      return address
    }
  },
  methods: {
    handleClickAddressItem() {
      this.$emit('clickAddressItem', this.userAddress)
    }
  }
}
</script>

<style scoped>
.address-item {
  margin-left: 0;
  border-radius: 5px;
  border: 1px solid #4A9FF9;
  margin-top: 15px;
  padding-left: 10px;
  text-align: left;
  width: 100%;
}

.address-detail {
  display: block;
  font-size: small;
  color: #5a5e66;
  font-weight: 500;
  margin-bottom: 10px;
}
</style>
