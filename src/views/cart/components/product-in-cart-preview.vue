<template>
  <el-button class="container">
    <el-card
      class="box-card"
      :body-style="{padding: '0px'}"
      shadow="hover">
      <div class="image-container">
        <img
          :src="product.shortProductDTO.mainImage"
          class="image"
          alt="image"/>
      </div>
      <div class="product-info">
        <span class="center-text title change-size">{{ product.shortProductDTO.name }}</span>
        <span class="center-text price">{{ convertPriceToVND(product.shortProductDTO.price) }}</span>
        <el-input-number v-model="product.quantity" class="quantity" :min="0" size="mini"
                         @change="handleChangeQuantity"/>
      </div>
    </el-card>
  </el-button>
</template>

<script>
import {convertPriceToVND} from "@/utils/price";

export default {
  name: 'ProductInCartPreview',
  props: {
    product: {
      type: Object,
      default() {
        return {
          shortProductDTO: {
            id: '',
            mainImage: '',
            name: '',
            price: ''
          },
          quantity: 0
        }
      }
    }
  },
  data() {
    return {
      convertPriceToVND
    }
  },
  methods: {
    handleChangeQuantity() {
      if (this.product.quantity <= 0) {
        this.$confirm('Sản phẩm sẽ bị xóa khỏi giỏ hàng, bạn có chắc không ?', 'Cảnh báo', {
          confirmButtonText: 'Xóa',
          cancelButtonText: 'Hủy',
          type: 'warning'
        }).then(() => {
          this.handleDelete()
        }).catch(() => {
          this.product.quantity = 1
          console.log('cancel delete !')
        })
      } else {
        this.handleUpdateQuantity()
      }
    },
    handleDelete() {
      this.$emit('deleteProductInCart', this.product)
    },
    handleUpdateQuantity() {
      this.$emit('updateProductQuantityInCart', this.product)
    }
  }
}
</script>

<style scoped>
.container {
  --columns: 8;
  --height: 200px;
  --margin: 2px;
  width: calc(calc(100% / var(--columns)) - var(--margin));
  height: var(--height);
  margin-left: var(--margin);
  margin-bottom: var(--margin);
  overflow: hidden;
  padding: 0;
  border: none;
}

.box-card {
  width: 100%;
  height: 100%;
  border: 1px solid #eedfc5;
}

.box-card:hover {
  border: 1px solid #ee9708;
}

.change-size {
  margin-top: 4px;
  display: block;
  width: 100%;
  transition: all 0.3s;
}

.box-card:hover .change-size {
  font-size: 15px;
}

.image-container {
  position: relative;
  width: 100%;
  height: calc(var(--height) - 90px);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  padding: 5px;
  display: flex;
  flex-flow: wrap column;
}

.quantity {
  display: block;
  margin: 0 auto;
  margin-top: 7px;
}

.center-text {
  text-align: center;
}

.title {
  font-weight: 550;
  height: 30px;
  overflow: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
}

.price {
  color: #ff0404;
  margin-top: -10px;
}
</style>
