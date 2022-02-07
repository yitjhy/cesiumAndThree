import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols'

import * as loaderImage from './../canvas/loaderImg/loaderImg'

class Env extends Component {
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
        this.camera.position.x = 50;    // 50
        this.camera.position.y = 300;   // 300
        this.camera.position.z = 700;   // 800
        this.camera.up.x = 0;
        this.camera.up.y = 1;
        this.camera.up.z = 0;
        // this.camera.lookAt({
        //     x : 0,
        //     y : 0,
        //     z : 0
        // });
        this.camera.lookAt(this.scene.position);
    }

    initScene() {
        this.scene = new THREE.Scene();
    }

    initLight() {
        this.light = new THREE.AmbientLight(0xFFFFFF);
        this.light.position.set(100, 100, 200);
        this.scene.add(this.light);
        this.light = new THREE.PointLight(0x00FF00);
        this.light.position.set(0, 0,300);
        this.scene.add(this.light);
    }

    initControls() {
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        // 如果使用animate方法时，将此函数删除

        //controls.addEventListener( 'change', render );

        // 使动画循环使用时阻尼或自转 意思是否有惯性

        // controls.enableDamping = true;

        //动态阻尼系数 就是鼠标拖拽旋转灵敏度

        //controls.dampingFactor = 0.25;

        //是否可以缩放

        // controls.enableZoom = true;

        //是否自动旋转

        // controls.autoRotate = true;

        //设置相机距离原点的最远距离

        // controls.minDistance = 200;

        //设置相机距离原点的最远距离

        this.controls.maxDistance = 600;

        //是否开启右键拖拽

        this.controls.enablePan = true;
    }

    getIntersects(e) {
        //光线投射，用于确定鼠标点击位置
        let raycaster = new THREE.Raycaster();
        //创建二维平面
        let mouse = new THREE.Vector2();
        // 将世界坐标系换算成webgl的坐标
        mouse.x = ((e.clientX - this.mainCanvas.getBoundingClientRect().left) / this.mainCanvas.offsetWidth ) * 2 - 1;
        mouse.y = -((e.clientY - this.mainCanvas.getBoundingClientRect().top) / this.mainCanvas.offsetHeight ) * 2 + 1;
        //以camera为z坐标，确定所点击物体的3D空间位置
        raycaster.setFromCamera( mouse, this.camera );
        //确定所点击位置上的物体数量
        let intersects = raycaster.intersectObjects( this.scene.children, true );
        return intersects
    }

    creatCube() {
        let geometry = new THREE.CubeGeometry(50,50,50);
        let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }

    createSkyBox() {
        loaderImage.loaderCubeMap().then(res => {
            let textureCube = res;
            let shader = THREE.ShaderLib["cube"];
            shader.uniforms["tCube"].value = textureCube;
            let material = new THREE.ShaderMaterial({
                fragmentShader: shader.fragmentShader,
                vertexShader: shader.vertexShader,
                uniforms: shader.uniforms,
                depthWrite: false,
                side: THREE.DoubleSide
            });
            let skybox = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), material);
            this.scene.add(skybox);
        })
    }

    createSkyBox2() {
        let textureCube = this.createCubeMap();

        let shader = THREE.ShaderLib["cube"];
        shader.uniforms["tCube"].value = textureCube;

        let material = new THREE.ShaderMaterial({

            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.DoubleSide

        });

        // create the skybox
        let skybox = new THREE.Mesh(new THREE.BoxGeometry(10000, 10000, 10000), material);
        this.scene.add(skybox);
    }



    render() {
        return (
            <div className="Env">
                <div id="canvas-frame"></div>
            </div>
        )
    }

    componentDidMount() {
        this.mainCanvas = document.getElementById("canvas-frame");
        this.init()
    }

    init() {
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initControls();

        // this.creatCube();

        this.createSkyBox();

        this.animation()
    }

    animation() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animation();
        });
    }

    componentWillUnmount() {
        //清除WebGL缓存
        let cvs = this.renderer.domElement;
        let cxt = cvs.getContext("webgl");
        cxt.clear(cxt.DEPTH_BUFFER_BIT);
    }
}

export default Env;
