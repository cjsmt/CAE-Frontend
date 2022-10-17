import request from '@/utils/request'

  function list() {
    return request({
      url: '/data/get_all_shapes/',
      method: 'GET',
    })
  }

export { list }
