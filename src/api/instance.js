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

export { list, add }