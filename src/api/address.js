import request from "@/utils/request";

export function searchProvinces(name) {
  if (name === undefined || name == null) {
    name = ''
  }
  return request({
    url: '/address/province',
    method: 'get',
    params: {
      name: name
    }
  })
}

export function searchDistricts(provinceId, name) {
  console.log('provinceId, ', provinceId, 'name, ', name)
  return request({
    url: '/address/district',
    method: 'get',
    params: {
      provinceId: provinceId,
      name: name
    }
  })
}

export function searchWards(districtId, name) {
  return request({
    url: '/address/ward',
    method: 'get',
    params: {
      districtId: districtId,
      name: name
    }
  })
}
