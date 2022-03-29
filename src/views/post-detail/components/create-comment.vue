<template>
  <div class="container">
    <el-form ref="formComment" :model="formComment">
      <el-form-item prop="body">
        <el-input v-model="formComment.body" type="textarea"/>
      </el-form-item>
      <div>
        <el-upload
          ref="imageUpload"
          class="upload"
          action="http://localhost:8080/api/doc/add"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          :auto-upload="false"
          :file-list="fileList"
          multiple
          name="documents"
          list-type="picture">
          <el-button size="small" round icon="el-icon-upload" type="primary">Tải ảnh lên</el-button>
        </el-upload>
        <el-button type="success" class="submit-button" round icon="el-icon-position" v-loading="createButtonLoading"
                   @click="handleCreateComment">Gửi
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {addComment} from "@/api/post";

export default {
  name: 'CreateComment',
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formComment: {
        body: '',
        imageUrls: []
      },
      fileList: [],
      createButtonLoading: false
    }
  },
  methods: {
    handlePreview: function (file, fileList) {
      console.log('handle preview')
      console.log('file')
      console.log(JSON.stringify(file))
      console.log('file list')
      console.log(JSON.stringify(fileList))
    },
    handleRemove: function (file, fileList) {
      console.log('handle remove')
      console.log('file')
      console.log(JSON.stringify(file))
      console.log('file list')
      console.log(JSON.stringify(fileList))
    },
    handleUploadSuccess: function (response, file, fileList) {
      const successFiles = []
      for (const f of fileList) {
        if (f.status === 'success') {
          successFiles.push(f)
        } else {
          return
        }
      }
      const responseFiles = successFiles.map(f => f.response[0])
      this.formComment.imageUrls = responseFiles.map(response => response['downloadUri'])
      this.createComment()
    },
    handleCreateComment() {
      if (this.$refs.imageUpload.uploadFiles.length > 0) {
        this.createButtonLoading = true
        this.$refs.imageUpload.submit()
      } else {
        const valid = this.isFormValid()
        if (valid) {
          this.createButtonLoading = true
          this.createComment()
        } else {
          this.$message.warning('Nhập nội dung hoặc hình ảnh !')
        }
      }
    },
    createComment() {
      const comment = Object.assign({}, {postId: this.postId, ...this.formComment})
      addComment(comment)
        .then(data => {
          this.resetCommentFields()
          this.$emit('refreshComments')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('Lỗi khi tạo bình luận !')
        })
        .finally(() => {
          this.createButtonLoading = false
        })
    },
    resetCommentFields(){
      this.$refs.formComment.resetFields()
      this.fileList = []
      this.initFormComment()
    },
    initFormComment(){
      this.formComment = {
        body: '',
        imageUrls: []
      }
    },
    isFormValid: function () {
      return this.formComment.body.trim().length > 0 || this.formComment.imageUrls.length > 0
    }
  }
}
</script>

<style scoped>
.container {
  padding-bottom: 40px;
  margin-bottom: 10px;
}

.upload {
  display: inline-block;
}

.submit-button {
  float: right;
}
</style>
