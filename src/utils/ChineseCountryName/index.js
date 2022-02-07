

import {countries} from "./country_dict";

export const getChineseCountryName = (engName)=>{
        const result = countries.filter((item)=>item.name === engName);
        if(result.length < 1 ){
                return engName;
        }
        return result instanceof Array ? result[0].chinese : result.chinese;
};

export const getChineseCountryNameRetunNull = (engName)=>{
        const result = countries.filter((item)=>item.name === engName);
        if(result.length < 1 ){
                return null;
        }
        return result instanceof Array ? result[0].chinese : result.chinese;
};


export const getEngCountryName = (chineseName)=>{
        const result = countries.filter((item)=>item.chinese === chineseName);
        if(result.length < 1 ){
                return chineseName;
        }
        return result instanceof Array ? result[0].name : result.name;
};
