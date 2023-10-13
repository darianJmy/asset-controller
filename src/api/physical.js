import request from '@/utils/request'
import physical from '@/utils/physical'

export function getPhysicalList(query) {
  return request({
    url: '/vue-admin-template/physical/list',
    method: 'get',
    params: query
  })
}

export function getAssetList(query) {
  return physical({
    url: '/assetconfig/list',
    method: 'get',
    params: query
  })
}

export function createAsset(data) {
  return physical({
    url: '/assetconfig/add',
    method: 'post',
    data: data
  })
}

export function updateAsset(data) {
  return physical({
    url: '/assetconfig/update',
    method: 'post',
    data: data
  })
}

export function exportAsset() {
  return physical({
    url: '/assetconfig/export',
    method: 'get',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  })
}

export function deleteAsset(data) {
  return physical({
    url: '/assetconfig/delete',
    method: 'delete',
    data: data
  })
}

export function collectorAsset(data) {
  return physical({
    url: '/assetconfig/run',
    method: 'post',
    data: data
  })
}

export function detailAsset(query) {
  return physical({
    url: 'ipmi/info/detail',
    method: 'get',
    params: query
  })
}

export function uploadRack(data) {
  return physical({
    url: '/cabinet/convert',
    headers: {
      'Accept': 'application/zip'
    },
    method: 'post',
    data: data
  })
}
