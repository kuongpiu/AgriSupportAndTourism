<template>
  <div class="post">
    <div class="user-block">
      <img class="img-circle" :src=comment.user.avatar>
      <span class="username">{{comment.user.username}}</span>
      <span class="created-time text-muted">{{comment.createdTime}}</span>
    </div>
    <div v-if="comment.imageUrls.length > 0" class="images-container">
      <el-carousel :interval="6000" type="card" height="220px">
        <el-carousel-item v-for="item in comment.imageUrls" :key="item">
          <img :src="item" class="image">
        </el-carousel-item>
      </el-carousel>
    </div>
    <p>{{comment.content}}</p>
    <ul class="list-inline">
      <li class="list-item"><el-button class="button" size="small" type="none" icon="el-icon-chat-round" round>Trả lời</el-button></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      user: {
        avatar: '',
        username: ''
      },
      content: '',
      imageUrls: [],
      createdTime: ''
    }
  }
}
</script>

<style lang="scss" scoped>
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
}

.post {
  clear: both;
  font-size: 14px;
  border-bottom: 1px solid #d2d6de;
  margin-bottom: 15px;
  padding-bottom: 15px;
  //color: #666;

  .image {
    width: 100%;
    height: 100%;

  }

  .images-container {
    padding-top: 20px;
  }

  .button{
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
  }
}

.text-muted {
  color: #777;
}

</style>
