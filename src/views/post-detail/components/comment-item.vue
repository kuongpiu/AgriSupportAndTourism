<template>
  <div class="post">
    <div class="user-block">
      <img class="img-circle" :src=comment.user.avatar>
      <span class="username">{{ comment.user.username }}</span>
      <span class="created-time text-muted">{{ comment.createdTime }}</span>
    </div>
    <div v-if="comment.imageUrls.length > 0" class="images-container">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in comment.imageUrls" :key="item">
          <img :src="item" class="image">
        </el-carousel-item>
      </el-carousel>
    </div>
    <p>{{ comment.content }}</p>
    <ul class="list-inline" style="margin-bottom: -10px">
      <li class="list-item">
        <el-tooltip content="Trả lời" placement="top" effect="dark" :open-delay="400">
          <el-button class="button" type="none" icon="el-icon-chat-round" circle @click="handleReply"></el-button>
        </el-tooltip>
      </li>
      <span v-if="isMyComment">
        <li class="list-item">
        <el-tooltip content="Chỉnh sửa" placement="top" effect="dark" :open-delay="400">
          <el-button class="button" type="none" icon="el-icon-edit" circle @click="handleEdit"></el-button>
        </el-tooltip>
      </li>
      <li class="list-item">
        <el-button class="button" type="none" icon="el-icon-delete" circle @click="alertDelete"></el-button>
      </li>
      </span>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {deleteComment} from "@/api/post";

export default {
  name: 'CommentItem',
  props: {
    comment: {
      id: null,
      user: {
        avatar: '',
        username: ''
      },
      content: '',
      imageUrls: [],
      createdTime: ''
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ]),
    isMyComment() {
      if (this.username === undefined || this.username === null || this.username.length === 0) {
        return false
      }
      if (this.comment.user.username === this.username) {
        return true
      }
    }
  },
  methods: {
    handleReply: function () {
      console.log('handle reply: id= ' + this.comment.id)
    },
    handleEdit: function () {
      console.log('handle edit id= ' + this.comment.id)
    },
    handleDelete: function () {
      console.log('handle delete')
      deleteComment(this.comment.id)
        .then(data => {
          this.$emit('refreshComments')
          console.log('delete successfully!')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('Lỗi khi xóa bình luận !')
        })
    },
    alertDelete() {
      this.$confirm('Bình luận sẽ bị xóa vĩnh viễn, bạn có chắc không ?', 'Cảnh báo', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }).then(() => {
        this.handleDelete()
      }).catch(() => {
        console.log('cancel delete !')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
p{
  line-height: 20px;
}
.user-block {
  .username,
  .created-time {
    display: block;
    margin-left: 50px;
    padding: 2px 0;
  }

  .username {
    font-size: 16px;
    //color: #000;
  }

  :after {
    clear: both;
  }

  .img-circle {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    float: left;
  }

  span {
    font-weight: 500;
    font-size: 12px;
  }

  margin-bottom: 20px;
}

.post {
  clear: both;
  font-size: 12px;
  border-bottom: 1px solid #d2d6de;
  margin-bottom: 15px;
  padding-bottom: 15px;
  //color: #666;

  .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .images-container {
    padding-top: 20px;
  }

  .button {
    //background: none;
    //&:hover,
    //&:focus{
    //  background: none;
    //}
    border: none;
  }
}

.list-inline {
  padding-left: 0;
  margin-left: -5px;
  list-style: none;

  li {
    display: inline-block;
    padding-right: 5px;
    padding-left: 5px;
    font-size: 13px;
  }

  .list-item {
    //float: right;
    padding-right: 0;
  }
}

.text-muted {
  color: #777;
}

</style>
