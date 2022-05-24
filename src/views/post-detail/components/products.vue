<template>
  <el-card style="margin-top: 5px">
    <div slot="header" class="clearfix">
      <h3 style="padding-bottom: 10px; float: left"><i class="icon-before el-icon-goods"></i>Sản phẩm</h3>
    </div>
    <div>
      <div class="product-container">
        <product-item
          v-for="product in products"
          :key="product.id"
          :product="product"
          @showProductDetail="handleShowProductDetail"/>
      </div>
      <div class="pagination-container">
        <el-pagination
          class="pagination"
          background
          hide-on-single-page
          layout="prev, pager, next"
          :current-page.sync="currentPage"
          :pager-count="PAGER_COUNT"
          :page-size="PAGE_SIZE"
          :total="total"
          @current-change="fetchProducts">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="Thông tin sản phẩm"
      :visible.sync="dialogVisible"
      :fullscreen="false"
      :width="'60%'"
      :modal="false"
      :center="true">
      <div>
        <el-row :gutter="20">
          <el-col :span="13">
            <el-carousel height="330px">
              <el-carousel-item
                v-for="productImageUrl in currentProduct.imageUrls"
                :key="productImageUrl">
                <img :src="productImageUrl" class="image"/>
              </el-carousel-item>
            </el-carousel>
          </el-col>
          <el-col :span="11">
            <div class="product-info-container">
              <h2 style="word-break: break-word">{{ currentProduct.name }}</h2>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getAllProductsInPage, getProductById} from "@/api/product";
import {convertPriceToVND} from "@/utils/price";
import ProductItem from '@/views/farm/components/product-item'

const PAGE_SIZE = 4
const PAGER_COUNT = 5
export default {
  name: 'Products',
  props: ['farmId'],
  components: {ProductItem},
  data() {
    return {
      products: [],
      PAGE_SIZE: PAGE_SIZE,
      PAGER_COUNT: PAGER_COUNT,
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      currentProduct: {}
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    fetchProducts() {
      getAllProductsInPage(this.farmId, this.currentPage - 1, this.PAGE_SIZE)
        .then(data => {
          console.log('load product of farm: ', this.farmId, data)
          this.products = data.content
          this.total = data.totalElements
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleShowProductDetail(productId) {
      console.log('handle show product detail, productId', productId)
      this.dialogVisible = true
      getProductById(productId)
        .then(product => {
          console.log('receive product detail', product)
          this.currentProduct = product
        })
        .catch(err => {
          console.log(err)
          this.$message.error('Sản phẩm không tồn tại trong hệ thống, vui lòng kiểm tra lại')
        })
    }
  }
}
</script>

<style scoped>
.icon-before {
  padding-right: 10px;
}
.product-info-container{
  word-break: break-word;
  line-height: 25px;
}
.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-container {
  display: flex;
  flex-flow: wrap row;
  justify-content: flex-start;
  align-items: center;
  margin-left: -10px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
