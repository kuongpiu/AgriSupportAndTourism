import request from "@/utils/request";

export function getAllActivities() {
  return request({
    url: '/activity/all',
    method: 'get'
  })
}

export function addActivity(data) {
  return request({
    url: '/activity',
    method: 'post',
    data
  })
}

export function updateActivity(data) {
  return request({
    url: '/activity',
    method: 'put',
    data
  })
}
