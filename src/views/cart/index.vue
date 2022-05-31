<template>
  <el-drawer
    :key="drawer"
    :with-header="false"
    :visible.sync="drawer"
    :size="drawerSize"
    direction="btt"
    @close="closeDrawer">
    <div style="margin-left: 20px">
      <div
        style="padding-bottom: 0; margin-bottom: 0; position: sticky; top: 0; z-index: 1000; background-color: white">
        <h3 style="display: inline-block;"><i class="el-icon-shopping-cart-full"
                                              style="margin-right: 10px; color: #f88331"/> Giỏ hàng của tôi</h3>
        <div v-if="hasItemInCart" style="float: right; margin: 10px 10px 0 0">
            <span style="margin-right: 40px; color: black;"><i class="el-icon-money" style="color: #2ac06d"/> <span
              style=""> Tổng giá tiền: </span> <span style="color: red">{{
                convertPriceToVND(cartAmount)
              }}</span></span>
          <el-button round style="position: relative; top: -3px" type="success" icon="el-icon-wallet"
                     @click="handlePay">Thanh toán
          </el-button>
        </div>
      </div>
      <div v-if="hasItemInCart" class="product-container" style="margin-top: 15px;margin-left: 10px">
        <product-in-cart-preview
          v-for="product in cart"
          :key="product.id"
          :product="product"
          @updateProductQuantityInCart="handleUpdateProductQuantity"
          @deleteProductInCart="handleDeleteProduct"/>
      </div>
      <el-empty v-else style="height: 140px" description="Chưa có sản phẩm nào">
      </el-empty>
    </div>
  </el-drawer>
</template>

<script>

import {mapGetters} from "vuex";
import ProductInCartPreview from "@/views/cart/components/product-in-cart-preview";
import {convertPriceToVND} from "@/utils/price";
import {deleteProductInCart, updateProductInCart} from "@/api/cart";

export default {
  name: 'Index',
  components: {ProductInCartPreview},
  data() {
    return {
      drawer: false,
      drawerSize: '65%',
      convertPriceToVND
    }
  },
  computed: {
    ...mapGetters(['cartState', 'cart']),
    hasItemInCart() {
      return this.cart.length > 0
    },
    cartAmount() {
      let amount = 0
      for (const cartItem of this.cart) {
        amount += cartItem.quantity * cartItem.shortProductDTO.price
      }
      return amount
    }
  },
  watch: {
    cartState() {
      this.drawer = this.cartState
    }
  },
  mounted() {
    this.$store.dispatch('cart/getCart')
  },
  methods: {
    handlePay() {
      const order = this.cart.map(cartItem => {
        return {
          productId: cartItem.shortProductDTO.id,
          quantity: cartItem.quantity
        }
      })
      console.log('tien hanh thanh toan', order)
      this.$router.push('/confirm-order-information')
      this.closeDrawer()
    },
    handleUpdateProductQuantity(product) {
      this.$store.dispatch('cart/updateProduct', product)
    },
    handleDeleteProduct(product) {
      this.$store.dispatch('cart/deleteProduct', product)
    },
    closeDrawer() {
      this.$store.dispatch('cart/hideCart')
    }
  }
}
</script>

<style scoped>

</style>
