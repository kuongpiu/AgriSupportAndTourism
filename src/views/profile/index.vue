<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :key="accountKey" :user="user" @updateAvatar="updateAvatar"/>
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Hoạt động" name="activity">
                <activity/>
              </el-tab-pane>
<!--              <el-tab-pane label="Timeline" name="timeline">-->
<!--                <timeline/>-->
<!--              </el-tab-pane>-->
              <el-tab-pane label="Tài khoản" name="account">
                <account :key='accountKey' :user="user" @saveUserInfo="updateUserInfo"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: {UserCard, Activity, Timeline, Account},
  data() {
    return {
      user: {},
      activeTab: 'account',
      accountKey: 0
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'address',
      'email'
    ])
  },
  created() {
    this.getUser(this)
    console.log('created ', this.user)
  },
  methods: {
    getUser(data) {
      this.user = {
        name: data.name,
        role: data.roles.join(' | '),
        avatar: data.avatar,
        email: data.email,
        address: data.address
      }
    },
    updateUserInfo(user) {
      this.$store.dispatch('user/updateUserInfo', user).then(data => {
        this.$message({
          message: 'Thông tin đã được cập nhật thành công',
          type: 'success',
          duration: 5 * 1000
        })
      }).catch(err => {
        this.$message({
          message: 'Cập nhật thông tin thất bại',
          type: 'error',
          duration: 5 * 1000
        })
        console.log(err)
      })
    },
    updateAvatar(avatar) {
      this.user.avatar = avatar
    },
    forceRenderAccountComponents() {
      this.accountKey++
    }
  }
}
</script>
