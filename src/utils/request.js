import { ElMessage, ElMessageBox } from 'element-plus'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// const baseURL = process.env.VUE_APP_BASE_API
const baseURL = 'http://127.0.0.1:8000'

function request(config) {
    let requestURL = config.url || ''
    let method = config.method.toUpperCase() || 'GET'
    let data = config.data || ''
    let url = baseURL + requestURL;
    let options = {
        method,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': store.getters.token ? 'Bearer ' + getToken() : ''
        },
        body: JSON.stringify(data)
    }

    if (method === 'GET') {
        delete options.body;
        let params = '?';
        for (const key in config.params) {
            params += key + '=' + config.params[key] + '&'
        }
        if (params.length > 1) {
            url += params.substring(0, params.length - 1)
        }
    }

    return fetch(url, options)
        .then((response) => response.json())
        .catch((error) => {
            ElMessage({
                message: error,
                type: 'error',
                duration: 3000
            })
        })  
}

export default request
