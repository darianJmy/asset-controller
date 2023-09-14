import request from '@/utils/request'

export function getPhysicalList(query) {
  return request({
    url: '/vue-admin-template/physical/list',
    method: 'get',
    params: query
  })
}
