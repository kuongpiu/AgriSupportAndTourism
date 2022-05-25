<template>
  <el-card>
    <div slot="header">
      <h2 style="text-align: left; display: inline-block"><i class="icon-before el-icon-box"/>
        Danh sách sản phẩm
      </h2>
      <span style="float: right">
        <el-button type="success" icon="el-icon-plus" @click="handleOpenDialogCreateProduct">Thêm sản phẩm</el-button>
      </span>
    </div>
    <div v-if="products.length > 0" class="product-container">
      <product-item
        v-for="product in products"
        :key="product.id"
        :product="product"
        @showProductDetail="handleShowProductDetail"/>
    </div>
    <div v-else style="clear: both;">
      <el-empty description="Chưa có sản phẩm nào">
      </el-empty>
    </div>
    <el-dialog
      :title="dialogTitle"
      :loading="dialogLoading"
      :fullscreen="false"
      :close-on-click-modal="false"
      :width="'80%'"
      :center="true"
      :top="'2vh'"
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div style="padding-bottom: 50px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-row>
              <span style="display: block; margin-bottom: 10px"><b>Ảnh chính</b></span>
              <el-button
                style="padding: 3px; margin-bottom: 15px"
                @click="handleUploadMainImage">
                <el-image
                  :src="productForm.mainImage"
                  style="width: 450px; height: 450px"
                  fit="cover"/>
              </el-button>
            </el-row>
            <br/>
            <el-row>
              <span style="display: inline-block; margin-bottom: 10px"><b>Ảnh bổ sung</b></span>
              <el-upload
                ref="imageUpload"
                class="upload"
                action="http://localhost:8080/api/doc/add"
                :on-success="handleUploadSuccess"
                :on-change="handleOnChange"
                :on-remove="handleRemove"
                :auto-upload="false"
                :file-list="fileList"
                multiple
                name="documents"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form ref="productForm" :model="productForm" :rules="productFormRule">
              <el-form-item prop="name" label="Tên sản phẩm">
                <el-input v-model="productForm.name"/>
              </el-form-item>
              <el-form-item prop="status" label="Trạng thái">
                <br/>
                <el-select v-model="productForm.status" style="display: inline-block" clearable placeholder="Trạng thái">
                  <el-option
                    v-for="status in statusOptions"
                    :key="status"
                    :label="status"
                    :value="status">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="price" label="Giá bán">
                <el-input v-model="productForm.price"/>
              </el-form-item>
              <el-form-item prop="province" label="Khu vực">
                <el-autocomplete
                  ref="inputProvince"
                  v-model="productForm.province.name"
                  clearable
                  style="display: block"
                  placeholder="Cấp tỉnh"
                  value-key="name"
                  :fetch-suggestions="fetchProvinceSuggestions"
                  @select="handleSelectProvince"/>
              </el-form-item>
              <el-form-item prop="description" label="Mô tả sản phẩm">
                <el-input v-model="productForm.description" type="textarea"/>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div style="float: right;">
          <el-button
            v-if="dialogAction==='update-product'"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="alertDelete">
            Xóa
          </el-button>
          <el-button
            size="small"
            type="success"
            icon="el-icon-check"
            @click="handleSaveProduct"
          >Lưu
          </el-button>
        </div>
      </div>
      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="450"
        :height="450"
        url="http://localhost:8080/api/doc/add"
        field="documents"
        lang-type="vn"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import ProductItem from './product-item'
import {convertPriceToVND} from "@/utils/price";
import ImageCropper from '@/components/ImageCropper'
import {searchProvinces} from "@/api/address";
import {deleteProduct, getAllProducts, getProductById, insertProduct, updateProduct} from "@/api/product";

const STATUS_OPTIONS = ['Còn hàng', 'Hết hàng', 'Sắp có']
export default {
  name: 'FarmProduct',
  components: {ProductItem, ImageCropper},
  props: ['farmId'],
  data() {
    return {
      products: [],
      dialogVisible: false,
      productForm: {
        name: '',
        description: '',
        status: '',
        price: '',
        province: {
          name: ''
        },
        mainImage: '',
        imageUrls: []
      },
      imagecropperShow: false,
      imagecropperKey: 0,
      fileList: [],
      dialogTitle: '',
      dialogLoading: false,
      dialogAction: '',
      productFormRule: {
        name: [
          {required: true, message: 'Tên sản phẩm không hợp lệ', trigger: 'blur'}
        ],
        status: [
          {required: true, message: 'Trạng thái sản phẩm không hợp lệ', trigger: 'blur'}
        ],
        price: [
          {required: true, validator: this.validatePrice, trigger: 'blur'}
        ],
        description: []
      },
      statusOptions: STATUS_OPTIONS
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    fetchProducts() {
      getAllProducts(this.farmId)
        .then(data => {
          console.log('load product of farm: ', this.farmId, data)
          this.products = data
        })
        .catch(err => {
          console.log(err)
        })
    },
    validatePrice(rule, value, callback) {
      if (Number.isInteger(value * 1)) {
        callback()
      } else {
        callback(new Error('Giá không hợp lệ'))
      }
    },
    handleShowProductDetail(productId) {
      console.log('handle show product detail, productId', productId)
      this.dialogVisible = true
      this.dialogAction = 'update-product'
      this.dialogTitle = 'Thông tin sản phẩm'
      this.dialogLoading = true
      getProductById(productId)
        .then(product => {
          console.log('receive product detail', product)
          this.dialogLoading = false
          product.mainImage = product.imageUrls.shift()
          this.loadProductInfoToForm(product)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('Sản phẩm không tồn tại trong hệ thống, vui lòng kiểm tra lại')
        })
    },
    loadProductInfoToForm(product) {
      if (product === null) {
        this.productForm = {
          name: '',
          description: '',
          status: '',
          price: '',
          province: {
            name: ''
          },
          mainImage: 'https://icon-library.com/images/add-photo-icon/add-photo-icon-29.jpg',
          imageUrls: []
        }
      } else {
        this.productForm.id = product.id
        this.productForm.name = product.name
        this.productForm.description = product.description
        this.productForm.status = product.status
        this.productForm.price = product.price
        this.productForm.province = product.province
        this.productForm.mainImage = product.mainImage
        this.productForm.imageUrls = product.imageUrls

        this.fileList = product.imageUrls.map(url => {
          return {
            url: url
          }
        })
      }
    },
    handleResetProduct() {
      console.log('Reset product: ', this.productForm)
    },
    alertDelete() {
      this.$confirm('Sản phẩm sẽ bị xóa vĩnh viễn, bạn có chắc không ?', 'Cảnh báo', {
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
      const productId = this.productForm.id
      console.log('delete product, id= ', productId)
      deleteProduct(productId)
        .then(() => {
          this.$message.success('Xóa sản phẩm thành công')
          this.fetchProducts()
          this.closeDialog()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('Lỗi khi xóa sản phẩm, vui lòng thử lại')
        })
    },
    handleSaveProduct() {
      this.$refs['productForm'].validate(valid => {
        if (valid) {
          if (this.$refs.imageUpload.uploadFiles.length > 0) {
            let hasUnUploadImage = false
            console.log(this.fileList)
            for (const file of this.fileList) {
              if (file.status !== 'success') {
                hasUnUploadImage = true
                break
              }
            }
            if (hasUnUploadImage) {
              this.$refs.imageUpload.submit()
            } else {
              this.saveProduct()
            }
          } else {
            this.saveProduct()
          }
        } else {
          this.$message.warning('Thông tin cung cấp chưa hợp lệ, vui lòng kiểm tra lại các thông tin')
          return false
        }
      })
    },
    handleUploadMainImage() {
      this.imagecropperShow = true
    },
    close() {
      this.imagecropperShow = false
      console.log('close')
    },
    cropSuccess(data) {
      this.productForm.mainImage = data[0].downloadUri
    },
    handleUploadSuccess: function (response, file, fileList) {
      const successFiles = []
      console.log('fileList', fileList)
      console.log('response', response)
      for (const f of fileList) {
        if (f.status === 'success') {
          successFiles.push(f)
        } else {
          return
        }
      }
      const responseFiles = successFiles.map(f => {
        if (f.response !== undefined) {
          return f.response[0]
        }
        return f.url
      })
      this.productForm.imageUrls = responseFiles.map(response => {
        if (response['downloadUri'] !== undefined) {
          return response['downloadUri']
        }
        return response
      })
      this.saveProduct()
    },
    handleOnChange(file, fileList) {
      console.log('on change', file, fileList)
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      console.log('file', file)
      console.log('fileList', fileList)
      if (file.status !== 'success') {
        return
      }
      if (file.url === undefined || file.url === null) {
        return
      }
      const appearIndex = this.productForm.imageUrls.indexOf(file.url)
      if (appearIndex < 0 || appearIndex >= this.productForm.imageUrls.length) {
        return
      }
      this.fileList = fileList
      this.productForm.imageUrls.splice(appearIndex, 1)
    },
    saveProduct() {
      const productForm = {
        name: this.productForm.name,
        description: this.productForm.description,
        status: this.productForm.status,
        farmId: this.farmId,
        price: this.productForm.price,
        province: {
          id: this.productForm.province.id
        },
        imageUrls: [].concat([this.productForm.mainImage], this.productForm.imageUrls)
      }
      if (this.dialogAction === 'add-product') {
        this.addProduct(productForm)
      } else if (this.dialogAction === 'update-product') {
        productForm.id = this.productForm.id
        this.updateProduct(productForm)
      } else {
        console.log('nothing happen', this.dialogAction)
      }
    },
    addProduct(productForm) {
      console.log('add product', productForm)
      insertProduct(productForm)
        .then(data => {
          this.$message.success('Thêm sản phẩm thành công')
          console.log('insert successfully', data)
          this.fetchProducts()
          this.closeDialog()
        })
        .catch(err => {
          this.$message.error('Thêm sản phẩm thất bại, vui lòng thử lại sau')
          console.log(err)
        })
    },
    updateProduct(productForm) {
      console.log('update product', productForm)
      updateProduct(productForm)
        .then(product => {
          console.log('update successfully', product)
          this.$message.success('Cập nhật thông tin sản phẩm thành công')
          this.fetchProducts()
          this.closeDialog()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('Cập nhật thông tin sản phẩm thất bại, vui lòng thử lại sau')
        })
    },
    handleOpenDialogCreateProduct() {
      this.loadProductInfoToForm(null)
      this.dialogVisible = true
      this.dialogAction = 'add-product'
      this.dialogTitle = 'Thêm sản phẩm mới'
    },
    closeDialog() {
      this.dialogAction = ''
      this.dialogTitle = ''
      this.dialogVisible = false
      this.fileList = []
      this.loadProductInfoToForm(null)
    },
    fetchProvinceSuggestions(name, cb) {
      searchProvinces(name)
        .then(data => {
          cb(data)
        })
    },
    handleSelectProvince(province) {
      this.productForm.province = province
    }
  }
}
</script>

<style scoped>
.product-container {
  display: flex;
  flex-flow: wrap row;
  justify-content: flex-start;
  align-items: center;
  margin-left: -10px;
}

.icon-before {
  padding-right: 10px;
}
</style>
