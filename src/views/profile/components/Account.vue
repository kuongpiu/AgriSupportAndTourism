<template>
  <el-form>
    <el-form-item label="Họ tên">
      <el-input v-model="user.name"/>
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="user.email"/>
    </el-form-item>
    <el-form-item label="Địa chỉ">
      <el-input v-model="user.address"/>
    </el-form-item>
    <el-form-item>
      <el-button :loading="buttonUpdateLoading" type="primary" @click="submit">Cập nhật</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          address: ''
        }
      }
    }
  },
  data() {
    return {
      buttonUpdateLoading: false
    }
  },
  methods: {
    submit() {
      this.$emit('saveUserInfo', this.user)
    }
  }
}
</script>
