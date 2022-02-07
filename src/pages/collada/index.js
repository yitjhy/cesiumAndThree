

import React, { Component } from 'react';

import * as THREE from 'three';

import ColladaLoader  from 'three-collada-loader'

class Collada extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isShow: false,
            chassisName: '',
            loading: true
        };
        this.mainCanvas = '';
        this.renderer = '';
        this.controls = true;
        this.width = '';
        this.height = '';
        this.camera = '';
        this.scene = '';
        this.light = '';
        this.leftBarWidth = 50; //左侧菜单宽度
        this.topBarHeight = 50; //顶部工具栏高度

        this.requestAnimationFrameId = 0;
        this.animationOpenDoorId = 0;
        this.earthAnimationId = 0;

        this.mesh = '';
        this.THREE = {};
    }

    initThree() {
        this.width = document.getElementById('canvas-frame').clientWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: true });  // 反锯齿antialias:true
        this.renderer.setClearColor(new THREE.Color(0xcccccc, 1.0));
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearAlpha(0.3);
        this.renderer.shadowMapEnabled = true;
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 10000);
        this.camera.position.x = 150;    // 50
        this.camera.position.y = 150;   // 300
        this.camera.position.z = 150;   // 800
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        this.camera.lookAt(this.scene.position);
        this.THREE = '';
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initLight() {
        // this.light = new THREE.DirectionalLight(0xFFFFFF);
        // this.light.position.set(30, 40, 50);
        // this.scene.add(this.light);
        this.light = new THREE.PointLight(0xFFFFFF);
        // this.light.position.set(0, 0,300);
        this.light.position.set(150, 150, 150);
        this.light.intensity = 2;
        this.scene.add(this.light);
    }

    loadColladaObj() {
        let that = this;
        const loader = new ColladaLoader();
        // let group = new THREE.Group();
        loader.load("../assets/models/dae/Truck_dae.dae", function (result) {
            console.log(result);
            let mesh = {};
            mesh = result.scene.children[0].children[0].clone();
            mesh.scale.set(3, 3, 3);
            that.scene.add(mesh);
        });
    }

    renderObj() {
        if (this.mesh) {
            this.mesh.rotation.y += 0.006;
            this.mesh.rotation.x += 0.006;
        }
        requestAnimationFrame(() => {
            this.renderObj()
        });
        this.renderer.render(this.scene, this.camera);
    }


    render() {
        return (
            <div className="Collada">
               <div id='canvas-frame'></div>
            </div>
        );
    }

    componentDidMount() {
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.setTHREE();
        this.loadColladaObj();
        this.renderObj();
    }

    setTHREE() {
        this.THREE = THREE;
    }
}

export default Collada;
