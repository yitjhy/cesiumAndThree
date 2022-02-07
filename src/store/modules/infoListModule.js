
let data = {
    infoList: []
};

// reducer
export function infoList (state = data.infoList, action) {
    // 不同的action有不同的处理逻辑
    switch (action.type) {
        case 'SET_INFO_LIST':
            return action.data;
        default:
            return state
    }
}

// action
export function setInfoList (data) {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_INFO_LIST',
            data: data
        })
    }
}



