import request from "@/utils/request";

export function getAllPost() {
  return request({
    url: '/post/all',
    method: 'get'
  })
}

export function getAllPostInPage(page, size, sort) {
  return request({
    url: '/post/page',
    method: 'get',
    params: {
      page: page,
      size: size,
      sort: sort
    }
  })
}

export function getPostDetail(postId) {
  return request({
    url: '/post',
    method: 'get',
    params: {postId}
  })
}

export function getCommentsByPostId(postId) {
  return request({
    url: '/post/comment/all',
    method: 'get',
    params: {
      postId: postId
    }
  })
}

export function addComment(data) {
  return request({
    url: '/post/comment',
    method: 'post',
    data
  })
}

export function updateComment(data) {
  return request({
    url: '/post/comment',
    method: 'put',
    data
  })
}

export function deleteComment(commentId) {
  return request({
    url: '/post/comment',
    method: 'delete',
    params: {
      commentId: commentId
    }
  })
}
