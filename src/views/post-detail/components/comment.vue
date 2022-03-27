<template>
  <el-card class="box-card">
    <div class="user-comment">
      <h2 style="padding-bottom: 10px; float: left"><i class="icon-before el-icon-edit-outline"></i>Bình luận</h2>
      <create-comment style="clear: both; margin-top: 20px"/>
      <comment-item
        v-for="(comment, index) in comments"
        :key="index"
        :comment="comment"/>
    </div>
  </el-card>
</template>

<script>
const avatar = 'https://wpimg.wallstcn.com/fb57f689-e1ab-443c-af12-8d4066e202e2.jpg?imageView2/1/w/80/h/80'
import CommentItem from '@/views/post-detail/components/comment-item'
import CreateComment from '@/views/post-detail/components/create-comment'
export default {
  components: {CommentItem, CreateComment},
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
      this.comments = [
        {
          user: {
            avatar: this.avatar,
            username: 'Cuong Nong'
          },
          content: 'Tôi đã từng trải nghiệm dịch vụ ở đây, thật không quá khi nói nơi này rất tuyệt vời, khi mà cả gia đình bỏ mồ hôi công sức ra để hỗ trợ thu hoạch và cũng nhận được rất nhiều sự ưu ái, nhiệt tình của chủ vườn, tôi và cả nhà sẽ tới đây trong dịp 30/4 tới. rất háo hức.....',
          imageUrls: this.imageUrls,
          createdTime: '26-3-2022'
        },
        {
          user: {
            avatar: this.avatar,
            username: 'Tạ Ngọc Ánh'
          },
          content: 'Tôi đã từng trải nghiệm dịch vụ ở đây, thật không quá khi nói nơi này rất tuyệt vời, khi mà cả gia đình bỏ mồ hôi công sức ra để hỗ trợ thu hoạch và cũng nhận được rất nhiều sự ưu ái, nhiệt tình của chủ vườn, tôi và cả nhà sẽ tới đây trong dịp 30/4 tới. rất háo hức.....',
          imageUrls: [],
          createdTime: '19h30, 26-3-2022'
        },
        {
          user: {
            avatar: this.avatar,
            username: 'Hoàng Hải Yến'
          },
          content: 'Tôi đã từng trải nghiệm dịch vụ ở đây, thật không quá khi nói nơi này rất tuyệt vời, khi mà cả gia đình bỏ mồ hôi công sức ra để hỗ trợ thu hoạch và cũng nhận được rất nhiều sự ưu ái, nhiệt tình của chủ vườn, tôi và cả nhà sẽ tới đây trong dịp 30/4 tới. rất háo hức.....',
          imageUrls: [this.imageUrls[0]],
          createdTime: '19h30, 26-3-2022'
        },
        {
          user: {
            avatar: this.avatar,
            username: 'Kim'
          },
          content: 'Tôi đã từng trải nghiệm dịch vụ ở đây, thật không quá khi nói nơi này rất tuyệt vời, khi mà cả gia đình bỏ mồ hôi công sức ra để hỗ trợ thu hoạch và cũng nhận được rất nhiều sự ưu ái, nhiệt tình của chủ vườn, tôi và cả nhà sẽ tới đây trong dịp 30/4 tới. rất háo hức.....',
          imageUrls: [this.imageUrls[2]],
          createdTime: '19:30 26-03-2022'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 20px;
}
.icon-before{
  padding-right: 10px;
}
</style>
