<template>
  <el-card class="box-card" :body-style="{padding: '0px'}">
    <el-row :gutter="5">
      <el-carousel :interval="6000" type="card" height="80vh">
        <el-carousel-item v-for="item in post.imageUrls" :key="item">
          <img :src="item" class="image">
        </el-carousel-item>
      </el-carousel>
      <el-col :span="postContentSpan">
        <post-content
          v-if="post.id != null"
          :post="post"
          @OpenActivityHistoryTab="handleOpenActivityHistoryTab"
          @CloseActivityHistoryTab="handleCloseActivityHistoryTab"/>
        <products v-if="post.farmId != null" :farm-id="post.farmId"/>
        <comment :post-id="this.$route.params.id"/>
      </el-col>
      <el-col v-if="post.farmId != null" :span="24 - postContentSpan">
        <activity :farm="{id: post.farmId}"/>
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
import Products from './components/products'

export default {
  name: 'Index',
  components: {Carousel, Activity, PostContent, Comment, Products},
  data() {
    return {
      post: {},
      isActivityHistoryTabOpened: false
    }
  },
  computed: {
    postContentSpan() {
      if (this.post.farmId == null) {
        return 24
      } else {
        if (this.isActivityHistoryTabOpened) {
          return 18
        } else {
          return 24
        }
      }
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
  },
  methods: {
    handleOpenActivityHistoryTab() {
      this.isActivityHistoryTabOpened = true
    },
    handleCloseActivityHistoryTab() {
      this.isActivityHistoryTabOpened = false
    }
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
