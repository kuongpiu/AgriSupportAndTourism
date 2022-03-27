<template>
  <el-card class="box-card">
    <el-row v-if="loadPostSuccess">
      <el-col class="post-container" :span="24">
        <post-item
          v-for="(post, index) in postList"
          :key="index"
          :post="post"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import PostItem from '@/views/post/components/post-item'
import {getAllPost} from '@/api/post'

export default {
  name: 'Index',
  components: {PostItem},
  data: () => {
    return {
      postList: []
    }
  },
  computed: {
    loadPostSuccess() {
      return this.postList != null && this.postList.length > 0
    }
  },
  created() {
    this.fetchPosts()
  },
  methods: {
    fetchPosts() {
      getAllPost()
        .then(data => {
          console.log(data)
          this.postList = data
        })
        .catch(error => {
          this.$message.error('Tải bài viết thất bại !')
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
.post-container{
  display: flex;
  flex-flow: wrap row;
  justify-content: flex-start;
  align-items: center;
  margin-left: -30px;
}
</style>
