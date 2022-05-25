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
      :top="'6vh'"
      :center="true"
      @close="handleCloseDialog">
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
              <h2 style="word-break: break-word; font-weight: 500; color: #1378ee">{{ currentProduct.name }}</h2>
              <span style="color: #ff0404; font-size: x-large">{{ convertPriceToVND(currentProduct.price) }}</span>
              <div style="margin-top: 20px">
                <el-row :gutter="80">
                  <el-col :span="10">
                    <el-row>
                      <span>Số lượng</span>
                    </el-row>
                    <el-row style="margin-top: 7px">
                      <el-input-number v-model="productNumber" :min="1" size="mini"/>
                    </el-row>
                  </el-col>
                  <el-col :span="14">
                    <br/>
                    <el-button type="success" icon="el-icon-shopping-cart-full" @click="handleAddToCart">
                      Thêm vào giỏ
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 30px">
                <h3 style="font-weight: 600; color: #0e7450"><i class="el-icon-magic-stick"/> Cam kết</h3>
                <ul>
                  <li>Chất lượng tốt</li>
                  <li>Sản phẩm nguồn gốc rõ ràng</li>
                  <li>Luôn muốn phát triển nông nghiệp vườn</li>
                  <li>Chất lượng tốt</li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <div style="margin-top: 50px">
            <h3 style="font-weight: 600; color: #3a7ed3"><i class="el-icon-tickets"/> Thông tin sản phẩm</h3>
            <p style="word-break: break-word; line-height: 23px; color: black">{{ currentProduct.description }}</p>
          </div>
        </el-row>
      </div>
    </el-dialog>
    <el-drawer
      :with-header="false"
      :visible.sync="drawer"
      :size="'45%'"
      direction="btt">
      <div style="margin-left: 20px">
        <div
          style="padding-bottom: 0; margin-bottom: 0; position: sticky; top: 0; z-index: 1000; background-color: white">
          <h3 style="display: inline-block;"><i class="el-icon-shopping-cart-full"
                                                style="margin-right: 10px; color: #f88331"/> Giỏ hàng của tôi</h3>
          <div style="float: right; margin: 10px 10px 0 0">
            <span style="margin-right: 40px; color: black;"><i class="el-icon-money" style="color: #2ac06d"/> <span
              style=""> Tổng giá tiền: </span> <span style="color: red">{{
                convertPriceToVND(cartAmount)
              }}</span></span>
            <el-button round style="position: relative; top: -3px" type="success" icon="el-icon-wallet"
                       @click="handlePay">Thanh toán
            </el-button>
          </div>
        </div>
        <div class="product-container">
          <product-in-cart-preview
            v-for="product in cart"
            :key="product.id"
            :product="product"
            @updateProductQuantityInCart="handleUpdateProductQuantity"
            @deleteProductInCart="handleDeleteProduct"/>
        </div>
      </div>
    </el-drawer>
  </el-card>
</template>

<script>
import {getAllProductsInPage, getProductById} from "@/api/product";
import {convertPriceToVND} from "@/utils/price";
import ProductItem from '@/views/farm/components/product-item'
import ProductInCartPreview from '@/views/cart/components/product-in-cart-preview'
import {deleteProductInCart, getCart, insertProductInCart, updateProductInCart} from "@/api/cart";
import {mapGetters} from "vuex";

const PAGE_SIZE = 4
const PAGER_COUNT = 5
export default {
  name: 'Products',
  props: ['farmId'],
  components: {ProductItem, ProductInCartPreview},
  data() {
    return {
      products: [],
      PAGE_SIZE: PAGE_SIZE,
      PAGER_COUNT: PAGER_COUNT,
      currentPage: 1,
      total: 0,
      dialogVisible: false,
      currentProduct: {},
      convertPriceToVND,
      productNumber: 1,
      drawer: true,
      cart: []
    }
  },
  computed: {
    ...mapGetters(['username']),
    cartAmount() {
      let amount = 0
      for (const cartItem of this.cart) {
        amount += cartItem.quantity * cartItem.shortProductDTO.price
      }
      return amount
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCart()
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
    fetchCart() {
      getCart()
        .then(data => {
          console.log('load cart', data)
          this.cart = data
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
    },
    handleCloseDialog() {
      this.productNumber = 1
    },
    handleAddToCart() {
      console.log('add product ', this.currentProduct.id, ', quantity ', this.productNumber)
      const cartItem = {
        cartItemId: {
          username: this.username,
          productId: this.currentProduct.id
        },
        quantity: this.productNumber
      }
      insertProductInCart(cartItem)
        .then(data => {
          this.$message.success('Đã thêm sản phẩm vào giỏ hàng')
          console.log('insert product in cart success', data)
          let isExists = false
          for (const cartItem of this.cart) {
            if (cartItem.shortProductDTO.id === data.shortProductDTO.id) {
              cartItem.quantity = data.quantity
              isExists = true
              break
            }
          }
          if (!isExists) {
            this.cart.unshift(data)
          }
        })
        .catch(err => {
          this.$message.error('Có lỗi xảy ra khi thêm sản phẩm, vui lòng thử lại sau')
          console.log(err)
        })
      this.showCart()
    },
    showCart() {
      this.drawer = true
    },
    handleUpdateProductQuantity(product) {
      const cartItem = {
        cartItemId: {
          username: this.username,
          productId: product.shortProductDTO.id
        },
        quantity: product.quantity
      }
      updateProductInCart(cartItem)
        .then(data => {
          console.log('update success', data)
          for (const cartItem of this.cart) {
            if (cartItem.shortProductDTO.id === data.shortProductDTO.id) {
              cartItem.quantity = data.quantity
              break
            }
          }
        })
    },
    handleDeleteProduct(product) {
      deleteProductInCart(product.shortProductDTO.id)
        .then(() => {
          this.cart.splice(this.cart.indexOf(product), 1)
          console.log('delete success')
        })
        .catch(err => {
          console.log(err)
        })
    },
    handlePay() {
      const order = this.cart.map(cartItem => {
        return {
          id: cartItem.shortProductDTO.id,
          quantity: cartItem.quantity
        }
      })
      console.log('tien hanh thanh toan', order)
    }
  }
}
</script>

<style scoped>
.icon-before {
  padding-right: 10px;
}

.product-info-container {
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
