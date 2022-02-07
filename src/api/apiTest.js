import request from './../utils/request'

// 登录
export function testGetJsonStr () {
    return request({
        url: 'http://localhost:3002/getJsonStr2',
        method: 'get',
        params: {},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
