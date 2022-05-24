<template>
  <el-card class="box-card" :body-style="{padding: '0px'}">
    <el-row :gutter="5">
      <!--      <carousel class="carousel" :slides="post.imageUrls"/>-->
      <el-carousel :interval="6000" type="card" height="80vh">
        <el-carousel-item v-for="item in post.imageUrls" :key="item">
          <img :src="item" class="image">
        </el-carousel-item>
      </el-carousel>
      <template v-if="post.farmId != null">
        <el-col :span="18">
          <post-content v-if="post.id != null" :post="post"/>
          <products :farm-id="post.farmId"/>
          <comment :post-id="this.$route.params.id"/>
        </el-col>
        <el-col :span="6">
          <activity :farm="{id: post.farmId}"/>
        </el-col>
      </template>
      <template v-else>
        <el-col :span="24">
          <post-content v-if="post.id != null" :post="post"/>
          <comment :post-id="this.$route.params.id"/>
        </el-col>
      </template>

    </el-row>
  </el-card>
</template>

<script>
import Carousel from '@/views/post-detail/components/carousel'
import Activity from '@/views/post-detail/components/activity'
import PostContent from '@/views/post-detail/components/post-content'
import Comment from '@/views/post-detail/components/comment'
import {getPostDetail} from "@/api/post"
import Products from './components/products'

export default {
  name: 'Index',
  components: {Carousel, Activity, PostContent, Comment, Products},
  data() {
    return {
      post: {}
    }
  },
  mounted() {
    const postId = this.$route.params.id
    getPostDetail(postId)
      .then(data => {
        this.post = data
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
