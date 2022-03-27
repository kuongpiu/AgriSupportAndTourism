<template>
  <el-card class="box-card container" v-loading="loading">
    <el-card class="box-card login-container">
      <el-form ref='loginForm' :model="loginForm" :rules="loginRules" class="form">
        <span class="login-title">
          Tham gia cùng chúng tôi
        </span>
        <el-form-item prop="username">
          <md-input v-model="loginForm.username" tabindex="1" icon="el-icon-user-solid" name="username"
                    placeholder="Tài khoản">
            Tài khoản
          </md-input>
        </el-form-item>
        <el-form-item prop="password">
          <md-input v-model="loginForm.password" tabindex="2" icon="el-icon-search" name="password"
                    placeholder="Mật khẩu" type="password">
            Mật khẩu
          </md-input>
        </el-form-item>
        <span>
          <el-button type="success" class="button-action form-button" round plain
                     @click="loginViaForm">Đăng nhập</el-button>
          <el-button class="button-action form-button" round plain @click="signupViaForm">Đăng ký</el-button>
        </span>
        <div class="bottom-login-container">
          <span class="small-title">Hoặc đăng nhập bằng</span>
          <br>
          <el-button-group style="text-align: center">
            <el-button type="danger" round @click="loginViaGoogle">Google</el-button>
            <el-button type="primary" round @click="loginViaFacebook">Facebook</el-button>
          </el-button-group>
        </div>
      </el-form>
    </el-card>
  </el-card>
</template>

<script>
import MdInput from '@/components/MDinput'

const MIN_USERNAME_LENGTH = 4
const MIN_PASSWORD_LENGTH = 4

export default {
  name: 'Index',
  components: {
    MdInput
  },
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{require: true, validator: this.usernameValidator, trigger: 'blur'}],
        password: [{require: true, validator: this.passwordValidator, trigger: 'blur'}]
      },
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  methods: {
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    usernameValidator(rule, value, callback) {
      if (value === null || value.trim().length < MIN_USERNAME_LENGTH) {
        callback(new Error('Tài khoản phải chứa ít nhất ' + MIN_USERNAME_LENGTH + ' ký tự'))
      } else {
        callback()
      }
    },
    passwordValidator(rule, value, callback) {
      if (value === null || value.length < MIN_PASSWORD_LENGTH) {
        callback(new Error('Mật khẩu phải chứa ít nhất ' + MIN_PASSWORD_LENGTH + ' ký tự'))
      } else {
        callback()
      }
    },
    loginViaGoogle: function () {
      console.log('login via google')
    },
    loginViaFacebook: function () {
      console.log('login via facebook')
    },
    loginViaGithub: function () {
      console.log('login via github')
    },
    loginViaForm: function () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({path: this.redirect || '/', query: this.otherQuery})
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$message.warning('Nhập đầy đủ thông tin trước khi đăng nhập')
          return false
        }
      })
    },
    signupViaForm: function () {
      console.log('signup via form')
    }
  }
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: baseline;
  width: 100vw;
  height: 100vh;
}

.button-container, .login-container {
  display: inline-block;
  padding: 20px 10px;
  margin-left: 30px;
}

.login-container {
  width: 500px;
  padding: 20px 10px;
  margin-left: 40px;
}

.button-action {
  margin-left: 0;
  display: block;
  padding: 10px;
  margin-top: 5px;
}

.login-title {
  line-height: 50px;
  margin-bottom: 10px;
  text-align: center;
  width: 100%;
  display: block;
  font-weight: bolder;
}

.form-button {
  width: 100%;
  padding: 14px;
}

.form-button:first-of-type {
  margin-top: 35px;
}

.bottom-login-container {
  margin-top: 30px;
  display: flex;
  flex-flow: column wrap;
  align-items: center;
}

.small-title {
  font-weight: lighter;
  font-size: smaller;
}
</style>
