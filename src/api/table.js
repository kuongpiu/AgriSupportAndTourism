import request from '@/utils/request'
const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})
export function getList(params) {
  const items = data.items
  return Promise.resolve({
    data: {
      total: items.length,
      items: items
    }
  })
}
