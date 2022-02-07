

import React, { Component } from 'react';

import * as THREE from 'three';

import * as OBJLoader from 'three-obj-loader'

// import {MTLLoader, OBJLoader} from 'three-obj-mtl-loader'

import * as MTLLoader from './MTLLoader'

import * as OBJMTLLoader from './OBJMTLLoader'

// OBJMTLLoader(THREE);

// import OBJMTLLoader from 'three-objmtll-loader'

// OBJLoader(THREE);

// MTLLoader(THREE);



// OBJMTLLoader(THREE);

class Ply2 extends Component {
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
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearAlpha(0.3);
        document.getElementById('canvas-frame').appendChild(this.renderer.domElement);
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        this.camera.position.x = 10;    // 50
        this.camera.position.y = 10;   // 300
        this.camera.position.z = 10;   // 800
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
        this.light.position.set(20, 20, 20);
        this.scene.add(this.light);
    }

    loadPLYObjLoad() {
        // let mtlLoader = new MTLLoader();
        //
        // let objLoader = new OBJLoader();

        var loader = new this.THREE.OBJMTLLoader();

        loader.load('../assets/models/butterfly.obj', '../assets/models/butterfly.mtl', function (object) {

            // configure the wings
            var wing2 = object.children[5].children[0];
            var wing1 = object.children[4].children[0];

            debugger

            wing1.material.opacity = 0.6;
            wing1.material.transparent = true;
            wing1.material.depthTest = false;
            wing1.material.side = this.THREE.DoubleSide;

            wing2.material.opacity = 0.6;
            wing2.material.depthTest = false;
            wing2.material.transparent = true;
            wing2.material.side = this.THREE.DoubleSide;

            object.scale.set(140, 140, 140);
            // mesh = object;
            this.scene.add(object);

            object.rotation.x = 0.2;
            object.rotation.y = -1.3;
        });
    }

    loadPlyObj() {
        // this.THREE = THREE;
        let that = this;
        const loader = new this.THREE.PLYLoader();
        let group = new THREE.Group();
        loader.load("../assets/models/test.ply", function (geometry) {
            console.log(geometry);
            let material = new THREE.PointCloudMaterial({
                color: 0xffffff,
                size: 0.4,
                opacity: 0.6,
                transparent: true,
                blending: THREE.AdditiveBlending,
                map: that.generateSprite()
            });

            group = new THREE.PointCloud(geometry, material);
            group.sortParticles = true;

            that.scene.add(group);
        });
    }

    generateSprite() {

        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;

    }

    loadObj() {
        // this.THREE = THREE;
        let that = this;
        const loader = new this.THREE.OBJLoader();
        loader.load('../assets/models/pinecone.obj', function (loadedMesh) {
            var material = new THREE.MeshLambertMaterial({color: 0x5C3A21});
            loadedMesh.children.forEach(function (child) {
                child.material = material;
                child.geometry.computeFaceNormals();
                child.geometry.computeVertexNormals();
            });

            that.mesh = loadedMesh;
            loadedMesh.scale.set(100, 100, 100);
            loadedMesh.rotation.x = -0.3;
            that.scene.add(loadedMesh);
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
            <div className="ply">
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
        // this.loadPlyObj();
        // this.loadObj();

        // this.loadPLYObjLoad()

        this.renderObj();
    }

    setTHREE() {
        this.THREE = THREE;
    }
}

export default Ply2;
