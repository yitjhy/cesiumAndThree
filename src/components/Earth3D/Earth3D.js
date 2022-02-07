import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';
import {EARTH_3D_COUNTRY_MODE, HOT_EVENT_MODE} from '../../constants/constants'
import CesiumViewModel from "./ViewModel/CesiumViewModel";
import "cesium/Source/Widgets/widgets.css";
import Earth3DDataModel from "./DataModel/Earth3DDataModel";
import _ from "lodash";
import "whatwg-fetch";
import {encodeUri} from "../../utils/helper";


class Earth3D extends Component {
        cesiumViewMode = {};
        cesiumContainer = {};
        dataModel = {};
        viewer = {};
        state = {
                mode: EARTH_3D_COUNTRY_MODE,
                countriesData: [],
                eventsData: [],
        };

        static getDerivedStateFromProps = (props, state) => {
                let result = {};
                if (props.mode !== state.mode) {
                        result['mode'] = props.mode
                }
                if (!_.isEqual(props.countriesData, state.countriesData)) {
                        result['countriesData'] = props.countriesData;
                }
                if (!_.isEqual(props.eventsData, state.eventsData)) {
                        result['eventsData'] = props.eventsData;
                }
                return result;
        };

        componentDidMount = () => {
                this.cesiumViewMode = new CesiumViewModel(this.cesiumContainer);
                this.viewer = this.cesiumViewMode.getViewer();
                this.dataModel = new Earth3DDataModel();
                this.__drawEventMode();


                // setTimeout(()=>{
                //         fetch('/TestJson/hot_event.json').then(response=>{
                //                 return response.json()
                //         }).then(data=>{
                //                 this.setState({
                //                         eventsData: data.data
                //                 },()=>{
                //                         this.__drawEventMode();
                //                 });
                //
                //
                //         })
                // }, 5000)
        };

        __drawHotCountriesMode = () => {
                this.cesiumViewMode.clearScreen();
                this.cesiumViewMode.loadGloablGeoJson();

        };
        __reDrawHotCountries = () => {

                setTimeout(() => {
                        const countiesData = this.dataModel.countriesEventCount2Color(this.state.countriesData);
                        this.cesiumViewMode.colorTheCountries(countiesData);

                        setTimeout(() => {
                                this.cesiumViewMode.findCountryEntity('Australia');
                                this.cesiumViewMode.addMouseOverListener((name, nameOverlay, movement) => {
                                        nameOverlay.style.display = 'block';
                                        nameOverlay.style.bottom = this.viewer.canvas.clientHeight - movement.endPosition.y + 'px';
                                        nameOverlay.style.left = Number(Number(movement.endPosition.x) + 5) + 'px';
                                        const countryData = this.dataModel.searchCountryDataInArray(name.name, this.state.countriesData);
                                        const eventCount = countryData ? countryData.value : '无事件';
                                        nameOverlay.innerHTML = '<p>国家：<span>' + name.name + '</span></p><br />' +
                                              '<p>事件量：<span>' + eventCount + '</span></p>';
                                });
                                this.cesiumViewMode.addClickEventListener((objName, obj) => {
                                        // const eventData = this.dataModel.searchEventDataInArray(objName.name, eventsData);
                                        // if (eventData == null) {
                                        //         return 0;
                                        // }
                                        let obj2 = {
                                                countryName: objName.name,
                                        };
                                        const tmp = encodeUri(obj2);
                                        window.location.href = `/#/main/eventTypeOfCountry?${tmp}`

                                        // this.props.history.push({
                                        //         pathname: '/main/eventTypeOfCountry', query: {
                                        //                 countryName: objName,
                                        //         }
                                        // })
                                });
                        }, 300);
                }, 500);
        };

        __drawEventMode = () => {
                this.cesiumViewMode.clearScreen();
                this.cesiumViewMode.clearDataSource();
                this.cesiumViewMode.changeToTMSImageryLayer();
                this.cesiumViewMode.loadGloablGeoJson(true);

                // this.__reDrawEvents();
        };

        __reDrawEvents = () => {
                this.cesiumViewMode.clearScreen();
                setTimeout(() => {
                        const eventsData = this.dataModel.handleSamePosEvent(this.state.eventsData);
                        eventsData.forEach(eventItem => {
                                this.cesiumViewMode.drawEventPoint(eventItem);
                        })

                        setTimeout(() => {
                                this.__onMouseEventListener(eventsData);
                        }, 500);
                }, 200);
        };

        __onMouseEventListener = (eventsData) => {
                // debugger;
                // const {eventsData} = this.state;
                this.cesiumViewMode.addMouseOverListener((name, nameOverlay, movement) => {
                        const eventData = this.dataModel.searchEventDataInArray(name.name, this.state.eventsData);
                        if(eventData == null) {
                                return 1;
                        }
                        nameOverlay.style.display = 'block';
                        nameOverlay.style.bottom = this.viewer.canvas.clientHeight - movement.endPosition.y + 'px';
                        nameOverlay.style.left = Number(Number(movement.endPosition.x) + 5) + 'px';
                        const title = eventData ? eventData.title : '无';
                        // const eventCount = countryData ? countryData.value : '无事件';
                        nameOverlay.innerHTML = '<p>事件：<span>' + title + '</span></p><br />' +
                              '<p>类型：<span>' + eventData.eventType + '</span></p><br />' +
                              '<p>报道数量：<span>' + eventData.numMentions + '</span></p><br />' +
                              '<p>发生时间：<span>' + new Date(eventData.date).format("yyyy-MM-dd") + '</span></p>';
                });
                this.cesiumViewMode.addClickEventListener((objName, obj) => {
                        const eventData = this.dataModel.searchEventDataInArray(objName.name, eventsData);
                        if (eventData != null) {
                                let obj = {
                                        ...eventData,
                                        date: new Date(eventData.date).format('yyyy-MM-dd hh:mm:ss')
                                };
                                this.props.history.push({ pathname : `/main/event?${encodeUri(obj)}`});

                                // this.props.history.push({
                                //         pathname: '/main/event', query: {
                                //                 eventID: eventData.eventID,
                                //                 date: eventData.date
                                //         }
                                // })
                        } else {
                                console.log('click:',objName);
                        }


                });
        };

        shouldComponentUpdate = (nextProps, nextState) => {
                let result = false;
                if (nextState.mode !== this.state.mode) {
                        if (nextState.mode === EARTH_3D_COUNTRY_MODE) {
                                console.log('mode:', nextState.mode);
                                this.__drawHotCountriesMode();
                                this.__reDrawHotCountries();
                                result = true;
                        }
                        if (nextState.mode === HOT_EVENT_MODE) {
                                console.log('mode:', nextState.mode);
                                this.__drawEventMode();
                                this.__reDrawEvents();
                                result = true;
                        }
                }
                if (!_.isEqual(nextState.countriesData, this.state.countriesData) && this.state.mode === EARTH_3D_COUNTRY_MODE) {
                        console.log('changed:', "countries Data");
                        this.__reDrawHotCountries();
                        result = true;
                }

                if (!_.isEqual(nextState.eventsData, this.state.eventsData) && this.state.mode === HOT_EVENT_MODE) {
                        console.log('changed:', "events Data");
                        this.__reDrawEvents();
                        result = true;
                }

                if (nextProps.flyToCountry != null && nextProps.flyToCountry !== this.props.flyToCountry) {
                        const entity = this.cesiumViewMode.findCountryEntity(nextProps.flyToCountry);
                        this.cesiumViewMode.flyToCountryEntity(entity);
                }
                return result;


        };


        render() {
                return (
                      <div className="outerDiv">
                              <div id="cesiumContainer" style={{width: "100%", height: "100%"}}
                                   ref={element => this.cesiumContainer = element}/>
                              <div id="credit" hidden/>
                      </div>
                );
        }
}

Earth3D.propTypes = {
        mode: PropTypes.string.isRequired,
        countriesData: PropTypes.array,
        eventsData: PropTypes.array,
        flyToCountry: PropTypes.string
};

Earth3D.defaultProps = {
        mode: EARTH_3D_COUNTRY_MODE,
        flyToCountry: ''
};

const mapStateToProps = (state) => {
        return {}
};

const mapDispatchToProps = (dispatch) => {
        return {}
};

export default withRouter(connect(
      mapStateToProps,
      mapDispatchToProps
)(Earth3D));
