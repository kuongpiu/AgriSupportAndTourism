<template>
  <el-card class="box-card">
    <div class="user-comment">
      <h2 style="padding-bottom: 10px; float: left"><i class="icon-before el-icon-edit-outline"></i>Bình luận</h2>
      <create-comment :post-id="postId" @refreshComments="fetchComments" style="clear: both; margin-top: 20px"/>
      <comment-item
        v-for="(comment, index) in comments"
        :key="index"
        :comment="comment"
        @refreshComments="fetchComments"/>
    </div>
  </el-card>
</template>

<script>
import {getCommentsByPostId} from "@/api/post";

const avatar = 'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg?imageView2/1/w/80/h/80'
import CommentItem from '@/views/post-detail/components/comment-item'
import CreateComment from '@/views/post-detail/components/create-comment'

export default {
  components: {CommentItem, CreateComment},
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageUrls: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg?imageView2/2/h/440',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg?imageView2/2/h/440',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg?imageView2/2/h/440',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg?imageView2/2/h/440'
      ],
      avatar,
      comments: []
    }
  },
  created() {
    this.fetchComments()
  },
  methods: {
    fetchComments() {
      getCommentsByPostId(this.postId)
        .then(data => {
          this.comments = data.map(comment => {
            return {
              id: comment.id,
              user: {
                avatar: comment.createdUser.avatar != null ? comment.createdUser.avatar : this.avatar,
                username: comment.createdUser.username
              },
              content: comment.body,
              imageUrls: comment.imageUrls,
              createdTime: comment.createdTime + ' ' + comment.createdDate
            }
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 20px;
}

.icon-before {
  padding-right: 10px;
}
</style>
