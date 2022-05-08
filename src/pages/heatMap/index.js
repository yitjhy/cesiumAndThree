import React, {Component} from 'react';
import './index.css'
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import Cesium from "cesium/Source/Cesium";
import {INIT_CAMERA, INIT_CAMERA_2D, MAX_MAP_LEVEL, MIN_MAP_LEVEL,} from "../../constants/settings";
import {world_map_base_path} from "../../constants/constants";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import createTileMapServiceImageryProvider from "cesium/Source/Scene/createTileMapServiceImageryProvider"
import ScreenSpaceEventType from "cesium/Source/Core/ScreenSpaceEventType";
import defined from "cesium/Source/Core/defined";
import heatmap from 'heatmap.js/build/heatmap'
import Color from "cesium/Source/Core/Color";

class Test extends Component {
    constructor(props) {
        super(props);
        this.viewer = '';
        this.minWGS84_1 = [115.23, 39.55];
        this.maxWGS84_1 = [116.23, 41.55];
        this.minWGS84 = [94.389228, 28.364807];
        this.maxWGS84 = [108.666357, 40.251095];
        this.cesiumContainer = {};
        this.state = {};
        this.Cesium = Cesium;


        this.len = 500;
        this.points = [];
        this.max = 100;
        //热力图图片大小
        this.width = 1600;
        this.height = 1400;

        //点坐标的矩形范围
        this.latMin = -90;
        this.latMax = 90;
        this.lonMin = -180;
        this.lonMax = 180;
        // this.latMin = 28.364807;
        // this.latMax = 140.251095;
        // this.lonMin = 28.364807;
        // this.lonMax = 168.666357;
        this.dataRaw = [];
    }

    clearScreen() {
        this.viewer.entities.removeAll();
        console.log('clear Screen');
    }

    clearDataSource = () => {
        this.viewer.dataSources.removeAll();
    };


    changeToTMSImageryLayer = () => {
        const imageryLayers = this.viewer.imageryLayers;
        imageryLayers.removeAll(true);
        const layer = imageryLayers.addImageryProvider(new createTileMapServiceImageryProvider(
            {
                url: `${world_map_base_path}/world_map`,
                maximumLevel: MAX_MAP_LEVEL,
                minimumLevel: MIN_MAP_LEVEL,
                fileExtension: 'jpg',
            }
        ));
        layer.name = "tms"
    };

    addClickEventListener = (modelClickCallback) => {
        const scene = this.viewer.scene;
        this.viewer.screenSpaceEventHandler.setInputAction((movement) => {

            // drillPick获取到的点投射下去的集合
            let pickedObj = scene.drillPick(movement.position);
            console.log(pickedObj);
            pickedObj = pickedObj[1];
            if (!defined(pickedObj) || pickedObj.id.name == null) {
                return;
            }
            const pickedEntity = pickedObj.id;
            const pickedObjName = pickedEntity.name;
            let clickNodeObj = null;
            // let clickNodeSystem = null;

            // modelClickCallback({
            //     name: pickedObjName,
            //     obj: clickNodeObj,
            //     // com_system_name: clickNodeSystem
            // })
        }, ScreenSpaceEventType.LEFT_CLICK);

        this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };


    initCesium() {
        let that = this;
        this.viewer = new Viewer(that.cesiumContainer, {
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            baseLayerPicker: false,
            navigationHelpButton: false,
            animation: false,
            shouldAnimate: true,
            creditContainer: "credit",
            timeline: false,
            fullscreenButton: false,
            selectionIndicator: false,
            vrButton: false,
            infoBox: false,
            skyBox: false,
            shadows: false,
            // moon:false,
            scene3DOnly: true,
            //关闭地球光环
            // skyAtmosphere: false,
            orderIndependentTranslucency: false, //顺序独立半透明, 与contextOptions配合使地图底图背景透明
            contextOptions: {
                webgl: {
                    alpha: true,
                }
            },
        });

        this.viewer._cesiumWidget._creditContainer.style.display = "none";


        // 去掉光圈
        this.viewer.scene.globe.showGroundAtmosphere = false;

        this.clearScreen();
        this.clearDataSource();
        this.changeToTMSImageryLayer();

        let center = Cartesian3.fromDegrees(
            (that.minWGS84[0] + that.maxWGS84[0]) / 2,
            ((that.minWGS84[1] + that.maxWGS84[1]) / 2) - 15,
            2200000
        );
        this.viewer.camera.flyTo({
            destination: center,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-60),
                roll: Cesium.Math.toRadians(0)
            },
            duration: 4
        });


        // 添加cesium的红色几何面
        this.viewer.entities.add({
            name: 'testEntity1111',
            polygon: {
                hierarchy: Cartesian3.fromDegreesArray([
                    that.minWGS84[0], that.minWGS84[1],
                    that.maxWGS84[0], that.minWGS84[1],
                    that.maxWGS84[0], that.maxWGS84[1],
                    that.minWGS84[0], that.maxWGS84[1],
                ]),
                material: Color.RED.withAlpha(0.2)
            }
        });

        // 添加cesium的蓝色色几何面
        this.viewer.entities.add({
            name: 'testEntity3333',
            polygon: {
                hierarchy: Cartesian3.fromDegreesArray([
                    that.minWGS84_1[0], that.minWGS84_1[1],
                    that.maxWGS84_1[0], that.minWGS84_1[1],
                    that.maxWGS84_1[0], that.maxWGS84_1[1],
                    that.minWGS84_1[0], that.maxWGS84_1[1],
                ]),
                material: Color.YELLOW.withAlpha(0.5)
            }
        });


        let canvas = document.getElementsByClassName('heatmap-canvas');

        this.viewer.entities.add({
            name: 'heatmap2222',
            rectangle: {
                coordinates: this.Cesium.Rectangle.fromDegrees(this.lonMin, this.latMin, this.lonMax, this.latMax),
                material: new this.Cesium.ImageMaterialProperty({
                    image: canvas[0],
                    transparent: true
                })
            }
        });


        this.addClickEventListener();

        // this.viewer.zoomTo(this.viewer.entities);
    }

    render() {
        return (
            <div className="Test" id='only'>
                <div className='switchDimension'>

                    {/* 哥伦布视图 viewer.scene.morphToColumbusView(1);*/}
                    <div onClick={() => {
                        this.viewer.scene.morphTo3D(2);
                    }}>三维
                    </div>
                    <div onClick={() => {
                        this.viewer.scene.morphTo2D(2);
                    }}>二维
                    </div>
                </div>
                <div>
                    <div id="cesiumContainer" ref={element => this.cesiumContainer = element}
                         style={{width: "100%", height: "100%"}}>
                    </div>
                    <div id="credit" hidden/>
                </div>

                <div id="heatmap" style={{display: 'none', width: '1600px', height: '1400px'}}/>
            </div>
        );
    }

    componentDidMount() {
        //随机创建300个点（经度、纬度、热力值）
        for (let i = 0; i < this.len; i++) {
            let point = {
                lat: this.latMin + Math.random() * (this.latMax - this.latMin),
                lon: this.lonMin + Math.random() * (this.lonMax - this.lonMin),
                value: Math.floor(Math.random() * 100)
            };
            this.dataRaw.push(point);
        }

        //随机创建300个点（x、y、热力值）
        for (let i = 0; i < this.len; i++) {
            let dataItem = this.dataRaw[i];
            let point = {
                x: Math.floor((dataItem.lat - this.latMin) / (this.latMax - this.latMin) * this.width),
                y: Math.floor((dataItem.lon - this.lonMin) / (this.lonMax - this.lonMin) * this.height),
                value: Math.floor(dataItem.value)
            };
            this.max = Math.max(this.max, dataItem.value);
            this.points.push(point);
        }


        let heatmapInstance = heatmap.create({
            container: document.querySelector('#heatmap'),
            radius: 5,
            maxOpacity: .4,
            minOpacity: .2,
            blur: .75
        });

        let data = {
            max: this.max,
            data: this.points
        };

        heatmapInstance.setData(data);

        this.initCesium();
    }
}

export default Test
