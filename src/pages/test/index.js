import React, {Component} from 'react';

import './index.css'

import * as THREE from 'three';

import * as getMesh from './../canvas/getMesh/getMesh'

import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import Cesium from "cesium/Source/Cesium";
import Cartesian3 from "cesium/Source/Core/Cartesian3";
import Color from "cesium/Source/Core/Color";

import * as OBJLoader from 'three-obj-loader'
import ColladaLoader from "three-collada-loader";

OBJLoader(THREE);



class Test extends Component {
    constructor(props) {
        super(props);
        this.viewer = '';
        this.minWGS84 = [115.23,39.55];
        this.maxWGS84 = [116.23,41.55];
        this.cesiumContainer = {};
        this.ThreeContainer = {};
        this.state = {};
        this.three = {
            renderer: null,
            camera: null,
            scene: null,
            light: null
        };
        this._3Dobjects = [];
        this.THREE = '';
        this.mesh=''
    }



    initCesium(){
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

        let center = Cartesian3.fromDegrees(
            (that.minWGS84[0] + that.maxWGS84[0]) / 2,
            ((that.minWGS84[1] + that.maxWGS84[1]) / 2)-1,
            200000
        );
        this.viewer.camera.flyTo({
            destination : center,
            orientation : {
                heading : Cesium.Math.toRadians(0),
                pitch : Cesium.Math.toRadians(-60),
                roll : Cesium.Math.toRadians(0)
            },
            duration: 4
        });
    }

    initThree(){
        let fov = 45;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspect = width / height;
        let near = 1;
        let far = 10*1000*1000;

        this.three.scene = new THREE.Scene();
        this.three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.three.renderer = new THREE.WebGLRenderer({alpha: true});

        this.three.light = new THREE.DirectionalLight(0xFFFFFF);
        this.three.light.position.set(30, 40, 50);
        this.three.scene.add(this.three.light);

        // let Amlight=new THREE.AmbientLight(0xffffff,2);
        this.ThreeContainer.appendChild(this.three.renderer.domElement);
    }

    async init3DObject(){

        let that = this;

        let _3DObject = function(){
            this.threeMesh = null;
            this.minWGS84 = null;
            this.maxWGS84 = null;
        };

        let entity = {
            name : 'Polygon',
            polygon : {
                hierarchy : Cartesian3.fromDegreesArray([
                    that.minWGS84[0], that.minWGS84[1],
                    that.maxWGS84[0], that.minWGS84[1],
                    that.maxWGS84[0], that.maxWGS84[1],
                    that.minWGS84[0], that.maxWGS84[1],
                ]),
                material : Color.RED.withAlpha(0.2)
            }
        };
        // 添加cesium的红色几何面
        this.viewer.entities.add(entity);

        this.THREE = THREE;
        const loader = new ColladaLoader();

        let _3DOB = {};

        loader.load("../assets/models/dae/Truck_dae.dae", function (result) {
            let loadedMesh = result.scene.children[0].children[0].clone();
            // that.mesh = loadedMesh;
            loadedMesh.scale.set(2000,2000,2000); //scale object to be visible at planet scale
            loadedMesh.position.z += 15000.0; // translate "up" in Three.js space so the "bottom" of the mesh is the handle
            // loadedMesh.rotation.x = Math.PI / 1.9; // rotate mesh for Cesium's Y-up system
            loadedMesh.rotation.x = Math.PI / 2; // rotate mesh for Cesium's Y-up system

            that.three.scene.add(loadedMesh);
            _3DOB = new _3DObject();
            _3DOB.threeMesh = loadedMesh;
            _3DOB.minWGS84 = that.minWGS84;
            _3DOB.maxWGS84 = that.maxWGS84;
            that._3Dobjects.push(_3DOB);
        });

    }

    renderCesium(){
        this.viewer.render();
    }


    // cesium结合threejs关键函数（重新设置相机的世界矩阵，反矩阵，和最远观看距离，mesh位置）
    renderThreeObj(){
        // register Three.js scene with Cesium
        this.three.camera.fov = Cesium.Math.toDegrees(this.viewer.camera.frustum.fovy); // ThreeJS FOV is vertical
        this.three.camera.updateProjectionMatrix();

        let cartToVec = function(cart){
            return new THREE.Vector3(cart.x, cart.y, cart.z);
        };


        // Configure Three.js meshes to stand against globe center position up direction
        for(let id in this._3Dobjects){
            let minWGS84 = this._3Dobjects[id].minWGS84;
            let maxWGS84 = this._3Dobjects[id].maxWGS84;
            // convert lat/long center position to Cartesian3
            let center = Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2);

            // get forward direction for orienting model
            let centerHigh = Cartesian3.fromDegrees((minWGS84[0] + maxWGS84[0]) / 2, (minWGS84[1] + maxWGS84[1]) / 2,1);

            // use direction from bottom left to top left as up-vector
            let bottomLeft  = cartToVec(Cartesian3.fromDegrees(minWGS84[0], minWGS84[1]));
            let topLeft = cartToVec(Cartesian3.fromDegrees(minWGS84[0], maxWGS84[1]));
            let latDir  = new THREE.Vector3().subVectors(bottomLeft,topLeft ).normalize();

            // configure entity position and orientation
            console.log(center);
            this._3Dobjects[id].threeMesh.position.copy(center);
            this._3Dobjects[id].threeMesh.rotation.y +=0.03;
            // this._3Dobjects[id].threeMesh.position.z +=0.03;
            // this._3Dobjects[id].threeMesh.lookAt(centerHigh);
            // this._3Dobjects[id].threeMesh.up.copy(latDir);
        }

        // Clone Cesium Camera projection position so the
        // Three.js Object will appear to be at the same place as above the Cesium Globe
        this.three.camera.matrixAutoUpdate = false;
        let cvm = this.viewer.camera.viewMatrix;
        let civm = this.viewer.camera.inverseViewMatrix;
        this.three.camera.matrixWorld.set(
            civm[0], civm[4], civm[8 ], civm[12],
            civm[1], civm[5], civm[9 ], civm[13],
            civm[2], civm[6], civm[10], civm[14],
            civm[3], civm[7], civm[11], civm[15]
        );
        this.three.camera.matrixWorldInverse.set(
            cvm[0], cvm[4], cvm[8 ], cvm[12],
            cvm[1], cvm[5], cvm[9 ], cvm[13],
            cvm[2], cvm[6], cvm[10], cvm[14],
            cvm[3], cvm[7], cvm[11], cvm[15]
        );
        this.three.camera.lookAt(new THREE.Vector3(0,0,0));

        let width = this.ThreeContainer.clientWidth;
        let height = this.ThreeContainer.clientHeight;
        let aspect = width / height;
        this.three.camera.aspect = aspect;
        this.three.camera.updateProjectionMatrix();

        this.three.renderer.setSize(width, height);
        this.three.renderer.render(this.three.scene, this.three.camera);
    }

    loop(){
        requestAnimationFrame(() => {
            this.loop();
        });
        this.renderCesium();
        this.renderThreeObj();
        // this.renderObj();
    }

    render() {
        return (
            <div className="Test">
                <div>
                    <div id="cesiumContainer" style={{width: "100%", height: "100%"}}
                         ref={element => this.cesiumContainer = element}/>
                    <div id="credit" hidden/>
                </div>

                <div>
                    <div id="ThreeContainer" ref={element => this.ThreeContainer = element}></div>
                </div>


            </div>
        );
    }

    componentDidMount() {
        this.initCesium();
        this.initThree(); // Initialize Three.js renderer
        this.init3DObject(); // Initialize Three.js object mesh with Cesium Cartesian coordinate system
        this.loop(); // Looping renderer
    }
}

export default Test
