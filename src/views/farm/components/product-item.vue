<template>
  <el-button class="container" @click="handleClick(product)">
    <el-card
      class="box-card"
      :body-style="{padding: '0px'}"
      shadow="hover">
      <div class="image-container">
        <img
          :src="product.mainImage"
          class="image"
          alt="image"/>
<!--        <div class="tag-container">-->
<!--          <el-tag class="tag" effect="dark" size="small" type="success">Trồng mới</el-tag>-->
<!--          <el-tag class="tag" effect="dark" size="small" type="warning">Thu hoạch</el-tag>-->
<!--          <el-tag class="tag" effect="dark" size="small" type="danger">Chăm sóc</el-tag>-->
<!--        </div>-->
      </div>
      <div class="product-info">
        <span class="center-text title change-size">{{ product.name }}</span>
        <span class="center-text price">{{convertPriceToVND(product.price) }}</span>
        <span class="center-text location"><i class="icon el-icon-location-outline"></i>{{ product.province }}</span>
      </div>
    </el-card>
  </el-button>
</template>

<script>
import {convertPriceToVND} from "@/utils/price";

export default {
  name: 'ProductItem',
  props: {
    product: {
      type: Object,
      default() {
        return {
          id: null,
          mainImage: '',
          name: '',
          price: '',
          province: {
            name: ''
          }
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
    handleClick(product) {
      this.$emit('showProductDetail', product.id)
    }
  }
}
</script>

<style scoped>
.container {
  --columns: 4;
  --height: 350px;
  --margin: 10px;
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
}

.box-card:hover {
  background: #f5f6f3;
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
  height: calc(var(--height) - 140px);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tag-container {
  margin: 2px 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
}

.tag {
  margin-left: 2px;
  font-size: x-small;
}

.product-info {
  padding: 5px 15px 15px 15px;
  display: flex;
  flex-flow: wrap column;
}

.center-text {
  text-align: center;
}

.title {
  font-weight: 600;
  height: 36px;
  overflow: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
}

.user-info {
  padding-top: 10px;
  display: flex;
  justify-content: flex-start;
  font-weight: 400;
  font-size: smaller;
}

.price {
  color: #ff0404;
}

.location {
  margin-top: 50px;
}

.el-icon-check {
  margin-left: 5px;
  border-radius: 12px;
  padding: 2px;
  font-size: small;
  color: white;
  background-color: #00e56a;
  border: 1px solid black;
}

.icon {
  padding-right: 4px;
  color: #1a3bef;
}

.product-bottom {
  margin-top: 15px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: smaller;
  font-weight: lighter;
  font-style: italic;
}
</style>
