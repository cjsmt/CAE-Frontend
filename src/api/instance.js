import request from '@/utils/request'
// import axios from 'axios';

function list() {
    return request({
        url: '/train/get_all_instance/',
        method: 'GET',
    })
}

function add(data) {
    return request({
        url: '/train/add_instance/',
        method: 'POST',
        data: data,
    })
}

function add_datasets(data) {
    return request({
        url: '/train/add_datasets/',
        method: 'POST',
        data: data,
    })
}

function start_train(id) {
    return request({
        url: '/train/start_train/?id=' + id,
        method: 'GET',
    })
}

export { list, add, add_datasets, start_train }