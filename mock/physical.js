const Mock = require('mockjs')

const List = []
const count = 500

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      serial_number: '@id',
      ipmi_host: '@ip',
      firm: 'Fiberhome',
      brand: 'R2280 V6',
      tecarc: 'x86',
      cpus: '@integer(1, 2)',
      memory: '@integer(1, 32)',
      'status|1': ['成功', '失败', '未采集']
    })
  )
}

module.exports = [
  {
    url: '/vue-admin-template/physical/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        return true
      })

      if (sort === '-status') {
        mockList = mockList.sort((a, b) => {
          // 比较函数，根据状态字段排序（成功在前，失败在后）
          if (a.status === '成功' && b.status === '失败') {
            return -1 // a 在 b 前面
          } else if (a.status === '失败' && b.status === '成功') {
            return 1 // b 在 a 前面
          } else {
            return 0 // 状态相同，保持原顺序
          }
        })
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]
