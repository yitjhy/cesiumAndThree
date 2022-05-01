import React from 'react';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Canvas from './../pages/canvas/canvas';
import App from './../App';

import Test from './../pages/test/index'

import PlyModel from './../pages/ply/index'

import Threeenv from './../pages/three-env/index'

import Collada from './../pages/collada/index'

import Objmtl from './../pages/obj-mtl/index'

import Heatmap from './../pages/heatMap/index'

const BasicRoute = () => (
    <Router basename='/cesiumAndThreeExa'>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route exact path="/canvas" component={Canvas}/>
            <Route exact path="/test" component={Test}/>
            <Route exact path="/PlyModel" component={PlyModel}/>
            <Route exact path="/threeenv" component={Threeenv}/>
            <Route exact path="/collada" component={Collada}/>
            <Route exact path="/objmtl" component={Objmtl}/>
            <Route exact path="/heatmap" component={Heatmap}/>
        </Switch>
    </Router>
);

export default BasicRoute;
