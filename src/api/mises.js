import request from '@/utils/request'
import axios from 'axios';

function list() {
  return request({
    url: '/data/get_all_mises/',
    method: 'GET',
  })
}

function remove(id) {
  return request({
    url: '/data/delete_mises/?id=' + id,
    method: 'GET',
  })
}

function append(data) {
  console.log(data);
  return request({
    url: '/data/add_mises/',
    method: 'POST',
    data: data,
  })
}

function edit(data) {
  return request({
    url: '/data/update_mises/',
    method: 'POST',
    data: data
  })
}

export { list, remove, append }
