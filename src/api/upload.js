import request from "@/utils/request";

const UPLOAD_URL = 'api/doc/add'

export function upload(data) {
  return request({
    url: UPLOAD_URL,
    method: 'post',
    data: {
      documents: data
    }
  })
}
