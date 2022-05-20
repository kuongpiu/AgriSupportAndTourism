<template>
  <el-card class="box-card">
    <div v-show="!dialogVisible" style="position: fixed; right: 20px; top: 45px; z-index: 10000;">
      <el-button-group>
        <el-button
          round
          icon="el-icon-view"
          type="primary"
          @click="handlePreview">
          Xem trước
        </el-button>
        <el-button
          round
          type="success"
          :loading="createPostButtonLoading"
          @click="createPost">Tạo
          <i class="el-icon-circle-check"/>
        </el-button>
      </el-button-group>
    </div>
    <el-form ref="formPost" :model="post" :rules="rules" status-icon>
      <el-row :gutter="5">
        <el-col :span="20">
          <el-card class="el-card">
            <span slot="header">Tiêu đề</span>
            <el-row>
              <el-form-item prop="title" tabindex="1">
                <el-input ref="postTitleInput" v-model="post.title" placeholder="Tiêu đề bài viết"/>
              </el-form-item>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="el-card">
            <span slot="header">Liên kết vườn</span>
            <el-row>
              <el-form-item prop="farmIndex">
                <el-select v-model="farmIndex" placeholder="Chọn vườn" @change="handleChangeFarm">
                  <el-option
                    v-for="(farm, index) in farms"
                    :key="farm.id"
                    :label="farm.name"
                    :value="index">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="el-card">
        <span slot="header">Địa chỉ</span>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="province" label="Cấp tỉnh" tabindex="2">
              <el-autocomplete
                ref="inputProvince"
                v-model="post.province.name"
                class="el-autocomplete"
                placeholder="Cấp tỉnh"
                value-key="name"
                :fetch-suggestions="fetchProvinceSuggestions"
                @select="handleSelectProvince"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="district" label="Cấp huyện" tabindex="3">
              <el-autocomplete
                ref="inputDistrict"
                v-model="post.district.name"
                class="el-autocomplete"
                value-key="name"
                placeholder="Cấp huyện"
                :fetch-suggestions="fetchDistrictSuggestions"
                @focus="focusDistrict"
                @select="handleSelectDistrict"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="ward" label="Cấp xã" tabindex="4">
              <el-autocomplete
                ref="inputWard"
                v-model="post.ward.name"
                class="el-autocomplete"
                value-key="name"
                placeholder="Cấp xã"
                :fetch-suggestions="fetchWardSuggestions"
                @select="handleSelectWard"
                @focus="focusWard"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item prop="detailAddress" label="Vị trí cụ thể" tabindex="5">
            <el-input v-model="post.detailAddress" placeholder="Vị trí cụ thể"/>
          </el-form-item>
        </el-row>
      </el-card>
      <el-card class="el-card">
        <span slot="header">Ảnh chính</span>
        <el-form-item prop="imageUrls" tabindex="6">
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
      </el-card>
      <el-card class="el-card">
        <el-form-item prop="body" label="Nội dung" tabindex="7">
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
      </el-card>
    </el-form>
    <el-dialog
      :visible.sync="dialogVisible"
      :fullscreen="true"
      style="padding-bottom: 50px"
      :close-on-click-modal="false">
      <el-card class="box-card" :body-style="{padding: '0px'}">
        <el-row :gutter="5">
          <el-carousel :interval="6000" type="card" height="400px">
            <el-carousel-item v-for="item in post.imageUrls" :key="item">
              <img :src="item" class="image">
            </el-carousel-item>
          </el-carousel>
          <template v-if="post.farm != null">
            <el-col :span="16">
              <post-content :post="post"/>
            </el-col>
            <el-col :span="8">
              <activity :key="post.farm.id" :farm="post.farm"/>
            </el-col>
          </template>
          <template v-else>
            <el-col :span="24">
              <post-content :post="post"/>
            </el-col>
          </template>
        </el-row>
      </el-card>
    </el-dialog>
  </el-card>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import MdInput from '@/components/MDinput'
import axios from 'axios'
import {createPost} from '@/api/create-post';
import {searchDistricts, searchProvinces, searchWards} from "@/api/address";
import PostContent from '@/views/post-detail/components/post-content'
import Activity from '@/views/post-detail/components/activity'
import {getAllFarms} from "@/api/farm";

export default {
  name: 'Index',
  components: {Editor, MdInput, PostContent, Activity},
  data() {
    return {
      createPostButtonLoading: false,
      post: {
        title: '',
        province: {
          name: ''
        },
        district: {
          name: ''
        },
        ward: {
          name: ''
        },
        detailAddress: '',
        body: '',
        imageUrls: [],
        farm: {}
      },
      rules: {
        title: [
          {validator: this.checkTitle}
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
        body: [
          {validator: this.checkBody}
        ]
      },
      dialogVisible: false,
      farms: [],
      farmIndex: ''
    }
  },
  mounted() {
    this.$refs['postTitleInput'].$refs.input.focus()
    this.fetchFarms()
  },
  methods: {
    fetchFarms: async function () {
      this.farms = await getAllFarms()
    },
    createPost: function () {
      this.$refs['formPost'].validate(valid => {
        if (valid) {
          this.createPostButtonLoading = true
          const postDataSubmit = {
            title: this.post.title,
            province: {
              id: this.post.province.id
            },
            district: {
              id: this.post.district.id
            },
            ward: {
              id: this.post.ward.id
            },
            detailAddress: this.post.detailAddress,
            body: this.post.body,
            imageUrls: this.post.imageUrls,
            farmId: this.post.farm.id
          }
          console.log('create post, submit object ', postDataSubmit)
          createPost(postDataSubmit)
            .then(data => {
              console.log('create post successfully, ', data)
              const postId = data.id
              this.$message.success('Tạo bài thành công !')
              this.$router.push('/post/detail/' + postId)
            })
            .catch(err => {
              console.log(err)
              this.$message.error('Lỗi tạo bài viết !')
            })
            .finally(() => {
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
    checkBody: function (rule, value, callback) {
      if (value.length === 0 || !value.trim()) {
        callback(new Error('Chưa có nội dung !'))
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
      const provinceId = this.post.province.id
      if (provinceId === undefined) {
        return
      }
      searchDistricts(provinceId, name)
        .then(data => {
          cb(data)
        })
    },
    fetchWardSuggestions(name, cb) {
      const districtId = this.post.district.id
      if (districtId === undefined) {
        return
      }
      searchWards(districtId, name)
        .then(data => {
          cb(data)
        })
    },
    focusDistrict() {
      if (this.post.province.id === undefined) {
        this.$message.warning('Vui lòng chọn Tỉnh trước')
        this.$refs['inputDistrict'].$refs.input.blur()
      }
    },
    focusWard() {
      if (this.post.province.id === undefined) {
        this.$message.warning('Vui lòng chọn Tỉnh')
        this.$refs['inputWard'].$refs.input.blur()
      } else if (this.post.district.id === undefined) {
        this.$message.warning('Vui lòng chọn Huyện')
        this.$refs['inputWard'].$refs.input.blur()
      }
    },
    handleSelectProvince(province) {
      this.post.province = province
      console.log('select province, ', province)
      this.post.district = {name: ''}
      this.post.ward = {name: ''}
    },
    handleSelectDistrict(district) {
      this.post.district = district
      console.log('select district, ', district)
      this.post.ward = {name: ''}
    },
    handleSelectWard(ward) {
      this.post.ward = ward
      console.log('select ward, ', ward)
    },
    handlePreview() {
      console.log('handle preview')
      this.dialogVisible = true
    },
    handleChangeFarm(index) {
      this.post.farm = this.farms[index]
      console.log('change ', index, this.post.farm)
      this.post.province = this.post.farm.province
      this.post.district = this.post.farm.district
      this.post.ward = this.post.farm.ward
      this.post.detailAddress = this.post.farm.detailAddress
    }
  }
}
</script>

<style scoped>
.btn-action {
  display: inline-block;
  float: right;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.editor {
  margin-top: 200px;
}

.el-autocomplete {
  display: block;
}

.create-post-title {
  display: inline-block;
  width: 50%;
  text-align: right;
  font-size: large;
  margin-left: 0;
}

.sticky-header {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  top: 0;
}

.box-card {
  /*margin: 15px;*/
}

.el-card {
  margin-bottom: 15px;
}
</style>
