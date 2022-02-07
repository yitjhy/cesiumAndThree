import React from 'react';

import ReactDOM from 'react-dom';

import 'antd/dist/antd.css';

import * as serviceWorker from './serviceWorker';

import Router from './router/index';

import {Provider} from 'react-redux'

import buildModuleUrl from 'cesium/Source/Core/buildModuleUrl';

import store from './store/index'

buildModuleUrl.setBaseUrl('./cesium/');

ReactDOM.render(
    <Provider store={store}>
        <Router/>
    </Provider>,

    document.getElementById('root')
);

serviceWorker.register();
