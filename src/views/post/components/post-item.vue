<template>
  <div class="container">
    <router-link :to="'/post/detail/' + post.id">
      <el-card
        class="box-card"
        :body-style="{padding: '0px'}"
        shadow="hover"
        @click="$emit('click', post)">
        <div class="image-container">
          <img
            :src="post.postImage"
            class="image"
            alt="image"/>
          <div class="tag-container">
            <el-tag class="tag" effect="dark" size="small" type="success">Trồng mới</el-tag>
            <el-tag class="tag" effect="dark" size="small" type="warning">Thu hoạch</el-tag>
            <el-tag class="tag" effect="dark" size="small" type="danger">Chăm sóc</el-tag>
          </div>
        </div>
        <div class="post-info">
          <span class="title">{{ post.title }}</span>
          <div class="user-info">
            <el-avatar size="small" :src="post.avatar" fit="cover"></el-avatar>
            <div class="name">
              <span>{{ post.createdName }}</span>
              <!--              <i class="el-icon-check"></i>-->
            </div>
          </div>
          <div class="post-bottom">
            <div>
              <i class="icon el-icon-location-outline"></i>
              <span>{{ post.address }}</span>
            </div>
            <div>
              <i class="icon el-icon-date"></i>
              <span>{{ post.createdDate }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PostItem',
  props: {
    // eslint-disable-next-line vue/require-default-prop,vue/require-prop-types
    post: {
      id: null,
      postImage: '',
      avatar: '',
      title: '',
      createdName: '',
      address: '',
      createdDate: '',
      createdTime: ''
    }
  }
}
</script>

<style scoped>
.container {
  --columns: 4;
  --height: 380px;
  --margin: 30px;
  width: calc(calc(100% / var(--columns)) - var(--margin));
  height: var(--height);
  margin-left: var(--margin);
  margin-bottom: var(--margin);
  overflow: hidden;
}

.box-card {
  width: 100%;
  height: 100%;
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

.post-info {
  padding: 5px 15px 15px 15px;
  display: flex;
  flex-flow: wrap column;
}

.title {
  font-weight: 600;
  height: 36px;
  overflow: hidden;
  word-break: break-word;
}

.user-info {
  padding-top: 10px;
  display: flex;
  justify-content: flex-start;
  font-weight: 400;
  font-size: smaller;
}

.name {
  padding: 5px 0 0 10px;
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

.post-bottom {
  margin-top: 15px;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  font-size: smaller;
  font-weight: lighter;
  font-style: italic;
  border-top: 1px solid #fff4af;
}
</style>
