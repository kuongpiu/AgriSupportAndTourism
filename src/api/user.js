import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/authenticate',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}

export function logout() {
  return Promise.resolve()
}
