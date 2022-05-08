
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import Cesium from "cesium/Source/Cesium";
// import WebMapServiceImageryProvider from "cesium/Source/Scene/WebMapServiceImageryProvider";
import {INIT_CAMERA, INIT_CAMERA_2D, MAX_MAP_LEVEL, MIN_MAP_LEVEL,} from "../../../constants/settings";
// import WebMercatorTilingScheme from "cesium/Source/Core/WebMercatorTilingScheme";
// import Singl eTileImageryProvider from "cesium/Source/Scene/SingleTileImageryProvider";
// import TileMapServiceImageryProvider from "cesium/Source/Scene/Tile"
import createTileMapServiceImageryProvider from "cesium/Source/Scene/createTileMapServiceImageryProvider"
import SceneMode from "cesium/Source/Scene/SceneMode";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import Color from "cesium/Source/Core/Color";
import Ellipsoid from "cesium/Source/Core/Ellipsoid";
// import NearFarScalar from "cesium/Source/Core/NearFarScalar";
import Cartesian2 from "cesium/Source/Core/Cartesian2";
import ConstantPositionProperty from "cesium/Source/DataSources/ConstantPositionProperty";
// import LabelStyle from "cesium/Source/Scene/LabelStyle";
// import JulianDate from "cesium/Source/Core/JulianDate";
// import ClockRange from "cesium/Source/Core/ClockRange";
// import SampledPositionProperty from "cesium/Source/DataSources/SampledPositionProperty";
// import CallbackProperty from "cesium/Source/DataSources/CallbackProperty";
import ScreenSpaceEventType from "cesium/Source/Core/ScreenSpaceEventType";
import defined from "cesium/Source/Core/defined";
import GeoJsonDataSource from "cesium/Source/DataSources/GeoJsonDataSource";
import LabelGraphics from "cesium/Source/DataSources/LabelGraphics";
// import SkyBox from 'cesium/Source/Scene/SkyBox';
import GridImageryProvider from "cesium/Source/Scene/GridImageryProvider";
import {normalize} from "../../../utils/helper";
import {
        MATERIAL_CONFLICT,
        MATERIAL_CONFLICT_COLOR,
        MATERIAL_COOPERATION,
        MATERIAL_COOPERATION_COLOR,
        ORAL_CONFLICT,
        ORAL_CONFLICT_COLOR,
        ORAL_COOPERATION,
        ORAL_COOPERATION_COLOR,
        world_map_base_path
} from "../../../constants/constants";
// import defaultValue from "cesium/Source/Core/defaultValue";


// import CallbackProperty from 'cesium/Source/DataSources/CallbackProperty';/**/
// const startTime = JulianDate.fromDate(new Date(2018, 11, 15, 16));


/**
 * Cesium 控制基类
 * */
class CesiumViewModel {
        container = {};
        viewer = {};
        _Cesium = Cesium;

        // dataModel = {};

        constructor(container) {
                this.container = container;
                this.viewer = this.__createCesiumViewer();

                //为了保证底图背景透明，设置成(0, 0, 0, 0)样式，其他颜色可能会影响最终效果
                this.viewer.scene.backgroundColor = Color.TRANSPARENT;
                this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1500000;
                this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 22000000;
                this.viewer.scene.screenSpaceCameraController._minimumZoomRate = 300000; // ←
                this.viewer.scene.screenSpaceCameraController._maximumZoomRate=5906376272000
                // this.changeToGridImageryLayer();
                // const imageryLayers = this.viewer.imageryLayers;
                // const layer = imageryLayers.addImageryProvider(new GridImageryProvider(
                //       {
                //               cells: 4,
                //               color: Color.GRAY.withAlpha(0.1),
                //               glowColor: Color.GRAY.withAlpha(0.1),
                //               glowWidth: 2,
                //               backgroundColor: Color.fromCssColorString('#152c47')
                //       }
                // ));
                // layer.name = "Grid";
        }

        getCesium = () => {
                return this._Cesium;
        };

        getViewer = () => {
                return this.viewer;
        };

        __createCesiumViewer = () => {
                return new Viewer(this.container, {
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
                        // imageryProvider: new SingleTileImageryProvider({
                        //         url: '../assets/earth_background.png'
                        // })
                        // imageryProvider: new WebMapServiceImageryProvider({
                        //         url: WMS_URL,
                        //         layers: DEFAULT_MAP_LAYER,
                        //         enablePickFeatures: false,
                        //         maximumLevel: MAX_MAP_LEVEL,
                        //         minimumLevel: MIN_MAP_LEVEL,
                        //         tilingScheme: new WebMercatorTilingScheme(),
                        //         parameters: {
                        //                 format: 'image/png',
                        //                 transparent: true,
                        //                 service: 'WMS',
                        //                 request: 'GetMap',
                        //                 version: '1.1.1',
                        //                 srs: 'EPSG:3857',
                        //         }
                        // })
                });
        };

        /**
         *  保存当前视角
         * */
        saveCamera = () => {
                let saveData = {};
                const sceneMode = this.viewer.scene.mode;
                saveData['sceneMode'] = sceneMode;
                let options = {
                        position: null,
                        direction: null,
                        up: null,
                        frustum: null
                };
                if (sceneMode === SceneMode.SCENE3D) {
                        options.position = this.viewer.camera.positionWC.clone();
                } else {
                        const cartographic = this.viewer.scene.mapProjection.unproject(this.viewer.camera.position);
                        options.position = this.viewer.scene.mapProjection.ellipsoid.cartographicToCartesian(cartographic);
                }
                options.up = this.viewer.camera.up.clone();
                options.direction = this.viewer.camera.direction.clone();
                options.frustum = this.saveFrustum(this.viewer.camera.frustum.clone());
                saveData['camera'] = options;
                console.log('saveCamera:', saveData);
                this.savedCamera = saveData;
        };

        /**
         *  重置视角
         *  @param {Object} cameraInfo 视角对象,默认是由saveCamera方法保存的视角对象
         * */
        resetCamera = (cameraInfo = this.savedCamera) => {
                console.log('resetCamera');
                //恢复Scene
                const sceneMode = cameraInfo.sceneMode;
                if (sceneMode !== this.viewer.scene.mode) {
                        if (sceneMode === SceneMode.SCENE2D) {
                                this.viewer.scene.morphTo2D(2.0);
                        } else if (sceneMode === SceneMode.SCENE3D) {
                                this.viewer.scene.morphTo3D(2.0);
                        } else if (sceneMode === SceneMode.COLUMBUS_VIEW) {
                                this.viewer.scene.morphToColumbusView(2.0);
                        }
                        this.viewer.scene.morphComplete.addEventListener(() => {
                                this.updateCamera(cameraInfo.camera);
                        });
                } else {
                        this.updateCamera(cameraInfo.camera);
                }
        };

        /**
         *  重置到初始化视角
         * */
        resetInitCamera = () => {
                this.resetCamera(INIT_CAMERA);
        };

        /**
         *  载入视锥
         * */
        loadFrustum = (frustum) => {
                if (frustum.near !== null) {
                        this.viewer.camera.frustum.near = frustum.near;
                }
                if (frustum.far !== null) {
                        this.viewer.camera.frustum.far = frustum.far;
                }
                if (frustum.top !== undefined) {
                        this.viewer.camera.frustum.top = frustum.top;
                }
                if (frustum.bottom !== undefined) {
                        this.viewer.camera.frustum.bottom = frustum.bottom;
                }
                if (frustum.left !== undefined) {
                        this.viewer.camera.frustum.left = frustum.left;
                }
                if (frustum.right !== undefined) {
                        this.viewer.camera.frustum.right = frustum.right;
                }
                if (frustum.xOffset !== undefined) {
                        this.viewer.camera.frustum.xOffset = frustum.xOffset;
                }
                if (frustum.yOffset !== undefined) {
                        this.viewer.camera.frustum.yOffset = frustum.yOffset;
                }
                if (frustum.fov !== undefined) {
                        this.viewer.camera.frustum.fov = frustum.fov;
                }
                if (frustum.aspectRatio !== undefined) {
                        this.viewer.camera.frustum.aspectRatio = frustum.aspectRatio;
                }
        };

        /**
         *  保存视锥
         * */
        saveFrustum = (frustum) => {
                let options = {};
                if (frustum.near !== undefined) {
                        options['near'] = frustum.near;
                }
                if (frustum.far !== undefined) {
                        options['far'] = frustum.far;
                }
                if (frustum.top !== undefined) {
                        options['top'] = frustum.top;
                }
                if (frustum.bottom !== undefined) {
                        options['bottom'] = frustum.bottom;
                }
                if (frustum.left !== undefined) {
                        options['left'] = frustum.left;
                }
                if (frustum.right !== undefined) {
                        options['right'] = frustum.right;
                }
                if (frustum.xOffset !== undefined) {
                        options['xOffset'] = frustum.xOffset;
                }
                if (frustum.yOffset !== undefined) {
                        options['yOffset'] = frustum.yOffset;
                }
                if (frustum.fov !== undefined) {
                        options['fov'] = frustum.fov;
                }
                if (frustum.aspectRatio !== undefined) {
                        options['aspectRatio'] = frustum.aspectRatio;
                }
                return options;
        };

        /**
         *  更新视角
         * */
        updateCamera = (camera) => {
                this.viewer.camera.flyTo({
                        destination: camera.position,
                        orientation: {
                                direction: camera.direction,
                                up: camera.up
                        }
                });
                this.loadFrustum(camera.frustum);
        };

        /**
         *  清空屏幕
         * */
        clearScreen = () => {
                this.viewer.entities.removeAll();
                console.log('clear Screen');
        };

        /**
         * 变换到2D模式
         * @param {Number} duration --变换动画时长(float)
         * @param {Function} callback -- 变换完成后的回调
         */
        transTo2D = (duration, callback = undefined) => {
                this.clearScreen();
                this.viewer.scene.morphTo2D(duration);
                const clock = setInterval(() => {
                        if (this.viewer.scene.mode === SceneMode.SCENE2D) {
                                const {x, y, z} = INIT_CAMERA_2D.camera.position;
                                this.viewer.camera.flyTo({
                                        duration: 0.9,
                                        destination: Cartesian3.fromDegrees(x, y, z)
                                });

                                if (callback) {
                                        callback();
                                }
                                clearInterval(clock);
                        }
                }, 200);
        };

        /**
         * 变换到3D模式
         * @param {Number} duration --变换动画时长(float)
         * @param {function} callback -- 变换完成后的回调
         */
        transTo3D = (duration, callback = undefined) => {
                this.clearScreen();
                this.viewer.scene.morphTo3D(duration);
                const clock = setInterval(() => {
                        // console.log('mode:', this.viewer.scene.mode);
                        if (this.viewer.scene.mode === SceneMode.SCENE3D) {
                                this.resetCamera(INIT_CAMERA);
                                if (callback) {
                                        callback();
                                }
                                clearInterval(clock);
                        }
                }, 200);
        };


        onDelaultHeightListener = (drawSomeThing = null, clearSomeThing = null) => {
                let isDraw = false;
                this.viewer.screenSpaceEventHandler.setInputAction(() => {
                        const height = Math.ceil(this.viewer.camera.positionCartographic.height);
                        if (height < 1000000) {
                                // console.log('current Height:', height);
                                if (isDraw === false) {
                                        drawSomeThing();
                                }
                        } else {
                                if (isDraw) {
                                        clearSomeThing();
                                        isDraw = false;
                                }
                        }
                }, ScreenSpaceEventType.WHEEL);
                return 1;
        };

        /**
         *  添加鼠标点击事件监听
         * */
        addClickEventListener = (modelClickCallback) => {
                const scene = this.viewer.scene;
                this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
                        const pickedObj = scene.pick(movement.position);
                        if (!defined(pickedObj) || pickedObj.id.name == null) {
                                return;
                        }
                        const pickedEntity = pickedObj.id;
                        const pickedObjName = pickedEntity.name;
                        let clickNodeObj = null;
                        // let clickNodeSystem = null;

                        modelClickCallback({
                                name: pickedObjName,
                                obj: clickNodeObj,
                                // com_system_name: clickNodeSystem
                        })
                }, ScreenSpaceEventType.LEFT_CLICK);

                this.viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        };

        __initOverlayPanel = () => {
                let nameOverlay = document.createElement('div');
                this.viewer.container.appendChild(nameOverlay);
                nameOverlay.className = 'backdrop';
                nameOverlay.style.display = 'none';
                nameOverlay.style.position = 'absolute';
                nameOverlay.style.bottom = '0';
                nameOverlay.style.left = '0';
                nameOverlay.style['pointer-events'] = 'none';
                nameOverlay.style.padding = '4px';
                nameOverlay.style.backgroundColor = 'rgba(0,0,0,0.4)';

                return nameOverlay;

        };

        /**
         *  添加鼠标Over事件监听
         *
         * */
        addMouseOverListener = (onOverHandler) => {
                const nameOverlay = this.__initOverlayPanel();
                const scene = this.viewer.scene;
                this.viewer.screenSpaceEventHandler.setInputAction((movement) => {
                        const pickedFeature = scene.pick(movement.endPosition);
                        if (!defined(pickedFeature) || pickedFeature.id.name == null) {
                                nameOverlay.style.display = 'none';
                                return 1;
                        }

                        if (pickedFeature.id.name == null) {
                                debugger;
                        }
                        onOverHandler(pickedFeature.id, nameOverlay, movement);

                }, ScreenSpaceEventType.MOUSE_MOVE);
        };

        /**
         * 加载GeoJson
         *
         * */

        loadGloablGeoJson = (isTransMode = false) => {
                if (!isTransMode) {
                        this.changeToGridImageryLayer();
                }
                GeoJsonDataSource.load(`${world_map_base_path}/GeoJson/test2.json`, {
                        stroke: isTransMode ? Color.TRANSPARENT : Color.WHITE,
                        fill: isTransMode ? Color.TRANSPARENT : Color.fromCssColorString('#538cc4'),
                        strokeWidth: isTransMode ? 0 : 10,
                        markerSymbol: '?'
                }).then(
                      (dataSource) => {
                              this.p = dataSource.entities.values;
                              // const tmp = this.p;
                              // for (let i = 0; i < tmp.length; i++) {
                              //         let entity = tmp[i];
                              // // this.p.forEach(entity => {
                              //         if (!entity.position && entity.polygon) {
                              //                 let center = Cesium.BoundingSphere.fromPoints(entity.polygon.positions.getValue()).center;
                              //                 Ellipsoid.WGS84.scaleToGeodeticSurface(center, center);
                              //                 entity.position = new ConstantPositionProperty(center);
                              //         }
                              //
                              //         const coordinadas = entity.properties.coordinates;
                              //         const coordsArreglo = coordinadas.split(',');
                              //         const lat = coordsArreglo[0];
                              //         const lon = coordsArreglo[1];
                              //
                              //         entity.label = new LabelGraphics({
                              //                 // position: Cartesian3.fromDegrees(lat, lon),
                              //                 show: true,
                              //                 text: entity.name,
                              //                 font: '12px sans-serif',
                              //                 fillColor: Color.WHITE,
                              //                 // pixelOffset: new Cartesian2(0, 10),
                              //         });
                              // }
                              this.viewer.dataSources.add(dataSource);
                              //               this.viewer.zoomTo(dataSource);
                      });
                this.viewer.scene.globe.showGroundAtmosphere = false;
        };

        findCountryEntity = (countryName) => {
                const p = this.p;
                if (!p) return 1;
                for (let i = 0; i < p.length; i++) {
                        if (countryName === p[i].name) {
                                // console.log('countryEntity:', p[i]);
                                return p[i]
                        }
                }
        };

        flyToCountryEntity = (countryEntity) => {
                if (countryEntity == null) {
                        return 1;
                }
                this.viewer.flyTo(countryEntity, {
                        duration: 1.5,
                        maximumHeight: 1000000
                });
        };

        colorTheCountries = (countriesData) => {
                const p = this.p;
                if (!p) {
                        return 1;
                }
                countriesData.forEach((countryItem) => {
                        for (let i = 0; i < p.length; i++) {
                                if (countryItem.name === p[i].name) {
                                        p[i].polygon.material = Color.fromCssColorString(countryItem.color);
                                        const _height = normalize(countryItem.value, 255, 1) * 1000;
                                        p[i].polygon.extrudedHeight = _height;// or height property
                                }
                        }
                });
        };

        changeToGridImageryLayer = () => {
                const imageryLayers = this.viewer.imageryLayers;
                imageryLayers.removeAll(true);
                const layer = imageryLayers.addImageryProvider(new GridImageryProvider(
                      {
                              cells: 4,
                              color: Color.GRAY.withAlpha(0.1),
                              glowColor: Color.GRAY.withAlpha(0.1),
                              glowWidth: 2,
                              backgroundColor: Color.fromCssColorString('#152c47')
                      }
                ));
                layer.name = "grid"
        };

        changeToTMSImageryLayer = () => {
                const imageryLayers = this.viewer.imageryLayers;
                imageryLayers.removeAll(true);
                const layer = imageryLayers.addImageryProvider(new createTileMapServiceImageryProvider(
                      {
                              url: `${world_map_base_path}/world_map`,
                              maximumLevel: MAX_MAP_LEVEL,
                              minimumLevel: MIN_MAP_LEVEL
                      }
                ));
                layer.name = "tms"
        };

        clearDataSource = () => {
                this.viewer.dataSources.removeAll();
        };

        drawEventPoint = (event) => {
                const eventEntity = {
                        name: event.eventID,
                        position: Cartesian3.fromDegrees(Number(event.longtitude), Number(event.latitude), 0),
                        point: {
                                pixelSize: event.numMentions > 90 ? 20 : 10,
                                color: Color.fromCssColorString(this.__getEventColor(event.eventType)),
                                outlineColor: Color.PEACHPUFF.withAlpha(0.5),
                                outlineWidth: 1
                        },
                        // label:{
                        //         text:event.title,
                        //         font: '12px sans-serif',
                        //         fillColor: Color.WHITE,
                        //         pixelOffset: new Cartesian2(0, 10),
                        // }
                };
                return this.viewer.entities.add(eventEntity);
        };
        __getEventColor = (eventType) => {
                switch (eventType) {
                        case ORAL_COOPERATION:
                                return ORAL_COOPERATION_COLOR;
                        case ORAL_CONFLICT:
                                return ORAL_CONFLICT_COLOR;
                        case MATERIAL_COOPERATION:
                                return MATERIAL_COOPERATION_COLOR;
                        case MATERIAL_CONFLICT:
                                return MATERIAL_CONFLICT_COLOR;
                        default:
                                return null;
                }
        }

}

export default CesiumViewModel;
