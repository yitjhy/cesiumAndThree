import {testGetJsonStr} from "../api/apiTest";

export default function getInfoList(data) {
    return new Promise((resolve, reject) => {
        testGetJsonStr().then(response => {
            console.log(response);
            let obj = {
                200: () => {
                    resolve(response.data.goods)
                },
                default: () => {
                    reject('getInfoListFail')
                }
            };
            (obj[response.status] || obj['default'])()
        }).catch(error => {
            console.log(error)
        })
    })
}