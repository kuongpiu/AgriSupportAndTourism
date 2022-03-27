import request from '@/utils/request'

export function createPost(data) {
  return request({
    url: '/post',
    method: 'post',
    data
  })
}
