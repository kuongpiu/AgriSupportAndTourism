import request from "@/utils/request";

export function getAllPost() {
  return request({
    url: '/post/all',
    method: 'get'
  })
}

export function getPostDetail(postId) {
  return request({
    url: '/post',
    method: 'get',
    params: {postId}
  })
}
