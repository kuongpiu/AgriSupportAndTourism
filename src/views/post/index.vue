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
        @current-change="fetchPosts">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import PostItem from '@/views/post/components/post-item'
import {getAllPost, getAllPostInPage} from '@/api/post'

const PAGE_SIZE = 8
const PAGER_COUNT = 5
export default {
  name: 'Index',
  components: {PostItem},
  data: () => {
    return {
      postList: [],
      PAGE_SIZE: PAGE_SIZE,
      PAGER_COUNT: PAGER_COUNT,
      currentPage: 1,
      total: 0
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
      getAllPostInPage(this.currentPage - 1, this.PAGE_SIZE)
        .then(data => {
          console.log(data)
          this.postList = data.content
          this.total = data.totalElements
        })
        .catch(err => {
          this.$message.error('Tải bài viết thất bại !')
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.post-container {
  display: flex;
  flex-flow: wrap row;
  justify-content: flex-start;
  align-items: center;
  margin-left: -30px;
}

.pagination-container {
  display: flex;
  justify-content: center;
}
</style>
