<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <!--      <carousel class="carousel" :slides="post.imageUrls"/>-->
      <el-carousel :interval="6000" type="card" height="350px">
        <el-carousel-item v-for="item in post.imageUrls" :key="item">
          <img :src="item" class="image">
        </el-carousel-item>
      </el-carousel>
      <el-col :span="16">
        <post-content :post="{title: post.title, body: post.body}"/>
        <comment :post-id="this.$route.params.id"/>
      </el-col>
      <el-col :span="8">
        <activity/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import Carousel from '@/views/post-detail/components/carousel'
import Activity from '@/views/post-detail/components/activity'
import PostContent from '@/views/post-detail/components/post-content'
import Comment from '@/views/post-detail/components/comment'
import {getPostDetail} from "@/api/post"

export default {
  name: 'Index',
  components: {Carousel, Activity, PostContent, Comment},
  data() {
    return {
      post: {
        title: '',
        address: '',
        body: '',
        imageUrls: ''
      }
    }
  },
  created() {
    const postId = this.$route.params.id
    getPostDetail(postId)
      .then(data => {
        this.post = data
      }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  height: 100%;
}
</style>
