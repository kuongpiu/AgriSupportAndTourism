import request from "@/utils/request";

export function insertOrders(orderForm) {
  return request({
    url: '/order',
    method: 'post',
    data: orderForm
  })
}

export function updateOrder(order) {
  return request({
    url: '/order',
    method: 'put',
    data: order
  })
}

export function getOrderById(id) {
  return request({
    url: '/order',
    method: 'get',
    params: {
      orderNumber: id
    }
  })
}

export function getAllOrders() {
  return request({
    url: '/order/all',
    method: 'get'
  })
}

export function getAllOrdersInFarm(farmId) {
  return request({
    url: '/order/all-in-farm',
    method: 'get',
    params: {
      farmId: farmId
    }
  })
}
