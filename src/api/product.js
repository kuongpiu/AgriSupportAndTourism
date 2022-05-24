import request from '@/utils/request'

export function insertProduct(product) {
  return request({
    url: '/product',
    method: 'post',
    data: product
  })
}

export function updateProduct(product) {
  return request({
    url: '/product',
    method: 'put',
    data: product
  })
}

export function deleteProduct(productId) {
  return request({
    url: '/product',
    method: 'delete',
    params: {
      productId: productId
    }
  })
}

export function getAllProducts(farmId) {
  return request({
    url: '/product/all',
    method: 'get',
    params: {
      farmId: farmId
    }
  })
}

export function getAllProductsInPage(farmId, page, size, sort) {
  return request({
    url: '/product/all-in-page',
    method: 'get',
    params: {
      farmId: farmId,
      page: page,
      size: size,
      sort: sort
    }
  })
}

export function getProductById(productId) {
  return request({
    url: '/product',
    method: 'get',
    params: {
      productId: productId
    }
  })
}
