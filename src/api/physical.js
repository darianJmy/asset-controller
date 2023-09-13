import request from '@/utils/request'

export function getPhysicalList(params) {
  return request({
    url: '/vue-admin-template/physical/list',
    method: 'get',
    params
  })
}
