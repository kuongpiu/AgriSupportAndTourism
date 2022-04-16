<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>Thẻ thông tin</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <el-button
          circle
          style="padding: 3px; margin-bottom: 15px"
          @click="handleUploadAvatar">
          <el-avatar class="el-avatar" :size="180" shape="circle" fit="cover" :src="user.avatar"/>
        </el-button>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><span>Email</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ this.user.email }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><span>Địa chỉ</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ this.user.address }}
          </div>
        </div>
      </div>
    </div>
    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="http://localhost:8080/api/doc/add"
      field="documents"
      lang-type="vn"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

export default {
  components: {PanThumb, ImageCropper},
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          address: '',
          avatar: '',
          role: ''
        }
      }
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0
    }
  },
  methods: {
    handleUploadAvatar() {
      console.log('handle upload avatar')
      this.imagecropperShow = true
    },
    close() {
      this.imagecropperShow = false
      console.log('close')
    },
    cropSuccess(data) {
      this.$store.dispatch('user/updateAvatar', data[0].downloadUri)
      this.$emit('updateAvatar', data[0].downloadUri)
    }
  }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    .el-avatar {
      .avatar-upload-button {
      }
    }
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
