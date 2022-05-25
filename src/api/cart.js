import request from "@/utils/request";

export function getCart() {
  return request({
    url: '/cart/all',
    method: 'get'
  })
}

export function insertProductInCart(product) {
  return request({
    url: '/cart',
    method: 'post',
    data: product
  })
}

export function updateProductInCart(product) {
  return request({
    url: '/cart',
    method: 'put',
    data: product
  })
}

export function deleteProductInCart(productId) {
  return request({
    url: '/cart',
    method: 'delete',
    params: {
      productId: productId
    }
  })
}
