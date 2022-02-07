
let data = {
    pageTitle: '首页22'
};

// reducer
export function pageTitle (state = data.pageTitle, action) {
    // 不同的action有不同的处理逻辑
    switch (action.type) {
        case 'SET_PAGE_TITLE':
            return action.data;
        default:
            return state
    }
}

// action
export function setPageTitle (data) {
    return (dispatch, getState) => {
        dispatch({
            type: 'SET_PAGE_TITLE',
            data: data
        })
    }
}



