const Mock = require('mockjs')

const data = Mock.mock({
  'items|500': [{
    serial_number: '@id',
    ipmi_host: '@ip',
    firm: 'Fiberhome',
    brand: 'R2280 V6',
    tecarc: 'x86',
    cpus: '@integer(1, 2)',
    memory: '@integer(1, 32)',
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/physical/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
