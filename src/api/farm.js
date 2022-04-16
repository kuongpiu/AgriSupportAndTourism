import request from '@/utils/request'
import * as url from "url";

export function getAllFarms() {
  return request({
    url: '/farm/all',
    method: 'get'
  })
}
export function updateFarm(data) {
  return request({
    url: '/farm',
    method: 'put',
    data
  })
}
export function updateFarmTrees(data) {
  return request({
    url: '/farm/tree',
    method: 'put',
    data
  })
}
export function searchTreesByName(treeName){
  return request({
    url: '/tree/search',
    method: 'get',
    params: {
      name: treeName
    }
  })
}
