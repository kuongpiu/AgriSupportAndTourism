import request from "@/utils/request";
import fa from "element-ui/src/locale/lang/fa";

export function insertFarmCare(data) {
  return request({
    url: '/farm-care-history',
    method: 'post',
    data
  })
}

export function updateFarmCare(data) {
  return request({
    url: '/farm-care-history',
    method: 'put',
    data
  })
}

export function getAllFarmCares(farmId) {
  return request({
    url: '/farm-care-history/all',
    method: 'get',
    params: {
      farmId: farmId
    }
  })
}

export function searchFarmCaresByDate(farmId, date) {
  // console.log('query farm cares has farmId: ', farmId, ' at ', date)
  return request({
    url: '/farm-care-history/search-by-date',
    method: 'get',
    params: {
      farmId: farmId,
      date: date
    }
  })
}

export function getFarmCareById(id) {
  return request({
    url: '/farm-care-history',
    method: 'get',
    params: {
      id: id
    }
  })
}

export function deleteFarmCare(id) {
  return request({
    url: '/farm-care-history',
    method: 'delete',
    params: {
      id: id
    }
  })
}
