<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <svg-icon icon-class="edit"/>
      <span class="create-post-title">Bài viết mới</span>
      <span class="btn-action">
        <el-button type="primary" size="large" icon="el-icon-check" :loading="createPostButtonLoading"
                   @click="createPost">Tạo</el-button>
      </span>
    </div>
    <el-form ref="formPost" :model="post" :rules="rules" status-icon>
      <el-row :gutter="50">
        <el-col :span="12">
          <el-form-item prop="title" label="Tiêu đề">
            <el-input v-model="post.title" placeholder="Tiêu đề bài viết"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="address" label="Địa chỉ">
            <el-input v-model="post.address" placeholder="Địa chỉ"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="imageUrls" label="Chọn các ảnh chính">
        <br>
        <el-upload
          ref="uploadImages"
          action="http://localhost:8080/api/doc/add"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          multiple
          name="documents"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="body" label="Nội dung">
        <br>
        <editor
          ref="editor"
          v-model="post.body"
          class="editor"
          api-key="zy3c197y1dv2lqupsqkq7lk3nrna2y3y7n75a4dtzy9w6qti"
          :init="{
            height: 500,
            menubar: true,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic forecolor backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | image | preview',
            file_picker_types: 'image',
            images_upload_handler: imagesUploadHandler
          }"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import MdInput from '@/components/MDinput'
import axios from 'axios'
import {createPost} from '@/api/create-post';

export default {
  name: 'Index',
  components: {Editor, MdInput},
  data() {
    return {
      createPostButtonLoading: false,
      post: {
        title: '',
        address: '',
        body: '',
        imageUrls: []
      },
      rules: {
        title: [
          {validator: this.checkTitle, trigger: 'blur'}
        ],
        address: [
          {validator: this.checkAddress, trigger: 'blur'}
        ],
        body: [
          {validator: this.checkBody, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    createPost: function () {
      this.$refs['formPost'].validate(valid => {
        if (valid) {
          this.createPostButtonLoading = true
          console.log(this.post)
          createPost(this.post)
            .then(data => {
              console.log(data)
              const postId = data.id
              this.$message.success('Tạo bài thành công !')
              this.$router.push('/post/detail/' + postId)
            }).catch(err => {
              console.log(err)
              this.$message.error('Lỗi tạo bài viết !')
            }).finally(() => {
              this.createPostButtonLoading = false
            })
        } else {
          this.$message.error('Thông tin cung cấp chưa đủ')
          return false
        }
      })
    },
    handlePictureCardPreview: function (file) {
      console.log('handlePictureCardPreview')
    },
    handleRemove: function (file, fileList) {
      console.log('handleRemove')
    },
    handleUploadSuccess: function (response, file, fileList) {
      const successFiles = fileList.filter(f => f.status === 'success')
      const responseFiles = successFiles.map(f => f.response[0])
      this.post.imageUrls = responseFiles.map(response => response['downloadUri'])
    },
    imagesUploadHandler: function (blobInfo, success, failure) {
      const data = new FormData()
      data.append('documents', blobInfo.blob(), blobInfo.filename())
      axios.post('http://localhost:8080/api/doc/add', data)
        .then(res => {
          if (res.data[0].downloadUri != null) {
            success(res.data[0].downloadUri)
          } else {
            failure('Error')
            this.$message.error('Lỗi đăng ảnh')
          }
        })
        .catch(err => {
          failure('HTTP Error: ' + err.message)
          this.$message.error('Lỗi đăng ảnh')
        })
    },
    checkTitle: function (rule, value, callback) {
      if (!value || value.length === 0 || !value.trim()) {
        callback(new Error('Chưa có tiêu đề !'))
      }
      callback()
    },
    checkAddress: function (rule, value, callback) {
      if (!value || value.length === 0 || !value.trim()) {
        callback(new Error('Chưa có địa chỉ !'))
      }
      callback()
    },
    checkBody: function (rule, value, callback) {
      if (value.length === 0 || !value.trim()) {
        callback(new Error('Chưa có nội dung !'))
      }
      callback()
    }
  }
}
</script>

<style scoped>
.btn-action {
  display: inline-block;
  float: right;
}

.editor {
  margin-top: 200px;
}

.create-post-title {
  display: inline-block;
  width: 50%;
  text-align: right;
  font-size: large;
  padding-top: 12px;
  margin-left: 0;
}

.box-card {
  /*margin: 15px;*/
}
</style>
