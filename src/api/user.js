import request from '@/utils/request'
import {push} from "echarts/lib/component/dataZoom/history";

export function login(data) {
  return request({
    url: '/authenticate',
    method: 'post',
    data
  })
}

export function signup(data) {
  return request({
    url: '/register',
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

export function updateAvatar(avatar) {
  return request({
    url: '/user/updateAvatar',
    method: 'put',
    data: {
      avatar: avatar
    }
  })
}

export function updateInfo(data) {
  const updatableUserInfo = {
    name: data.name,
    email: data.email,
    address: data.address
  }
  console.log(updatableUserInfo)

  return request({
    url: '/user',
    method: 'put',
    data: updatableUserInfo
  })
}

export function logout() {
  return Promise.resolve()
}
