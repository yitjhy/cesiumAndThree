

import {normalize} from "../../../utils/helper";
import _ from 'lodash';

class Earth3DDataModel {
        countriesEventCount2Color = (countriesArray = []) => {
                const dataArray = countriesArray.sort((a, b) => a.value - b.value);
                return dataArray.map(item => {
                        const colorVal = normalize(item.value, 255, 1);
                        return {
                                name: item.name,
                                value: item.value,
                                color: 'rgb(85, 141 , ' + colorVal + ')'
                        }
                });
        };

        searchCountryDataInArray = (countryName, countriesArray) => {
                const result = countriesArray.find(countryItem => {
                        return countryName === countryItem.name
                });

                if (result != null) {
                        if (result instanceof Array) {
                                return result[0]
                        } else {
                                return result
                        }
                }
                return null
        };
        handleSamePosEvent = (eventsArray) => {
                if (!eventsArray instanceof Array) {
                        return null;
                }
                return eventsArray.map(eventItem => {
                        const samePosPoint = eventsArray.filter(findItem => eventItem.latitude === findItem.latitude && eventItem.longtitude === findItem.longtitude);
                        const samePosPointCount = samePosPoint.length;
                        const k = 100 - samePosPointCount;
                        const degree = 360 / k;
                        const tmpPoint = _.cloneDeep(eventItem);
                        const r = 0.03;

                        if (samePosPoint.length > 1) {
                                const radian = (2 * Math.PI / 360) * (degree * k - 180);
                                tmpPoint.latitude = Number(tmpPoint.latitude) + Math.sin(radian) * r + r; //+ _.random(1.100, -1.800);
                                tmpPoint.latitude = Number(tmpPoint.latitude) + _.random(1.100, -1.800);
                                tmpPoint.longtitude = Number(tmpPoint.longtitude) + Math.cos(radian) * r + r;//_.random(1.100, -1.800);
                                tmpPoint.longtitude = Number(tmpPoint.longtitude) + _.random(1.100, -1.800);
                        }
                        return tmpPoint;
                });
        };

        // handleSamePosEvent = (eventsArray)=>{
        //         if (!eventsArray instanceof Array){
        //                 return null;
        //         }
        //         return eventsArray.map(eventItem=>{
        //                 if (eventsArray.some(findItem => eventItem.latitude === findItem.latitude && eventItem.longtitude === findItem.longtitude)){
        //                         eventItem.latitude = Number(eventItem.latitude) + _.random(1.100, -1.800);
        //                         eventItem.longtitiude = Number(eventItem.longtitiude) + _.random(1.100, -1.800);
        //
        //                 }
        //                 return eventItem;
        //         });
        // };

        searchEventDataInArray = (eventID, eventsArray) => {
                const result = eventsArray.find(eventItem => {
                        return eventItem.eventID === eventID
                });
                if (result != null) {
                        if (result instanceof Array) {
                                return result[0]
                        } else {
                                return result
                        }
                }
                return null

        }
}

export default Earth3DDataModel;
