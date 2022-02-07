import React, {Component} from 'react'

import './App.css'

import {connect} from 'react-redux'

import GisComponent from "./components/Earth3D";

import { setPageTitle } from './store/modules/pageTitleModule'

import { setInfoList } from './store/modules/infoListModule.js'

const mapStateToProps = (state) => {
    return {
        pageTitle: state.pageTitle,
        infoList: state.infoList,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setPageTitle2(data) {
            dispatch(setPageTitle(data))
        },
        setInfoList2(data) {
            dispatch(setInfoList(data))
        }
    }
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flyToCountryName: ''
        }
    }

    render() {
        let { flyToCountryName } = this.state;
        return (
            <div>
                <div style={{position: 'absolute',zIndex: 900000}}>
                <div className='tap' onClick={() => this.props.history.push({pathname: '/canvas'})}>threejs</div>
                <div className='tap' onClick={() => {
                    this.setState({
                        flyToCountryName: 'China'
                    })
                }}>China</div>
                <div className='tap' onClick={() => {
                    this.setState({
                        flyToCountryName: 'United States'
                    })
                }}>United states</div>
                <div className='tap' onClick={() => {
                    this.props.history.push({pathname: '/threeenv'})
                }}>全景</div>
                <div className='tap' onClick={() => {
                    this.props.history.push({pathname: '/heatmap'})
                }}>3D热力图</div>
                </div>
                <div className='earthGis-box'>
                    <GisComponent flyToCountry={flyToCountryName}/> {/*mode = {gisEarthMode} countriesData={earthGisData} eventsData={hotEventData} flyToCountry={flyToCountryName}*/}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
