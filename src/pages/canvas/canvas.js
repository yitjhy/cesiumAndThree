import React, { Component } from 'react';
import './canvas.css'
import * as THREE from 'three';
import * as getMesh from './getMesh/getMesh'
import OrbitControls from 'three-orbitcontrols'
import DragControls from 'three-dragcontrols';

import { Spin } from 'antd';

class Canvas extends Component {
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

        this.chassisName = 'rack_door_back';

        this.testMesh = '';

        this.requestAnimationFrameId = 0;

        this.animationOpenDoorId = 0;
        this.earthAnimationId = 0;

        this.doorMesh = null;
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

        // controls.maxDistance = 600;

        //是否开启右键拖拽

        this.controls.enablePan = true;
    }

    initDragControls() {
        // 添加平移控件
        // var transformControls = new THREE.TransformControls(camera, renderer.domElement);
        // scene.add(transformControls);

        // 过滤不是 Mesh 的物体,例如辅助网格对象
        let objects = this.scene.children.filter((item) => {
            if(item.isMesh){
                return item.name.indexOf(this.chassisName) > -1
            }
        });
        // 初始化拖拽控件
        let dragControls = new DragControls(objects, this.camera, this.renderer.domElement);

        // 鼠标略过事件
        dragControls.addEventListener('hoveron', (event) => {
            // 让变换控件对象和选中的对象绑定
            // transformControls.attach(event.object);
            let arr = this.scene.children.filter((item) => {
                return item.name.indexOf(this.chassisName) > -1
            });
            let lastColor = '';
            arr.forEach((item) => {
                item.material.forEach((item) => {
                    if(item){
                        item.color.set( item.lastColor );
                        lastColor = item.lastColor;
                    }
                });
                // 设置所有门的颜色
                item.children[0].children[0].material.forEach(item => {
                    item.color.set(lastColor);
                })
            });
            event.object.material.forEach((item) => {
                if(item){
                    item.color.set( '#FFFF00' );
                }
            });
            // 设置当前选中门的颜色
            event.object.children[0].children[0].material.forEach(item => {
                item.color.set('#FFFF00');
            });

            let currentObj = event.object;

            this.scaleAnimation(arr, currentObj);

            // webgl坐标转换为屏幕坐标
            // let clientX = event.object.position.x + this.mainCanvas.getBoundingClientRect().left + this.mainCanvas.offsetWidth / 2 ;
            // let clientY = this.mainCanvas.getBoundingClientRect().top + this.mainCanvas.offsetHeight / 2 - event.object.position.y + 50 ;

            // let menu = document.getElementById('myContextMenu');
            // menu.style.left = clientX -50 + 'px';
            // menu.style.top = clientY + 'px';

            this.setState({
                isShow: true,
                chassisName: event.object.name
            })
        });

        // 开始拖拽
        dragControls.addEventListener('dragstart', (event) => {
            this.controls.enabled = false;
            this.setState({
                isShow: false
            });
        });
        // 拖拽结束
        dragControls.addEventListener('dragend', (event) => {
            this.controls.enabled = true;
        });
        // 拖拽中
        dragControls.addEventListener('drag', (event) => {
            this.controls.enabled = false;
            this.setState({
                isShow: false
            });
            event.object.position.y = 65;
            if(event.object.position.x > 290){
                event.object.position.x = 290
            }
            if(event.object.position.x < -290){
                event.object.position.x = -290
            }

            if(event.object.position.z > 290){
                event.object.position.z = 290
            }
            if(event.object.position.z < -280){
                event.object.position.z = -280
            }
        });
    }

    scaleAnimation(arr, currentObj) {
        arr.forEach((item) => {
            if(item.scale.x > 1){
                item.scale.x -=0.02;
                item.scale.y -=0.02;
                item.scale.z -=0.02;
            }else{
                cancelAnimationFrame(this.requestAnimationFrameId);
            }
            if(item.position.y > 55){
                item.position.y -=1;
            }else{
                cancelAnimationFrame(this.requestAnimationFrameId);
            }
        });
        if(currentObj.scale.x < 1.5){
            currentObj.scale.x +=0.04;
            currentObj.scale.y +=0.04;
            currentObj.scale.z +=0.04;
        }else{
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
        if(currentObj.position.y < 64 || currentObj.position.y === 50 || currentObj.position.y === 64){
            currentObj.position.y +=2;
        }else{
            cancelAnimationFrame(this.requestAnimationFrameId);
            return false
        }
        if(this.requestAnimationFrameId !==0 ){
            cancelAnimationFrame(this.requestAnimationFrameId);
        }
        this.requestAnimationFrameId = requestAnimationFrame(() => {
            this.scaleAnimation(arr, currentObj)
        });
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

    onClick(e) {
        this.setState({
            isShow: false
        });
        let intersects = this.getIntersects(e);

        let arr = this.scene.children.filter((item) => {
            return item.name.indexOf(this.chassisName) > -1
        });

        //选中后进行的操作
        if(intersects.length){
            let SELECTED = intersects[0].object;
            if(SELECTED.name === 'doorMesh'){
                cancelAnimationFrame(this.earthAnimationId);

                this.animationOpenDoor(arr, SELECTED);

                let earthObj = SELECTED.parent.parent.children[1];

                this.earthAnimate(earthObj);
            }

        }
    }

    earthAnimate(earthObj) {
        earthObj.rotation.y +=0.03;
        this.earthAnimationId = requestAnimationFrame(() => {
            this.earthAnimate(earthObj)
        });
    }

    animationOpenDoor(arr, SELECTED) {
        arr.forEach((item) => {
            if(item.children[0].rotation.y>0){
                item.children[0].rotation.y -=0.05
            }else{
                cancelAnimationFrame(this.animationOpenDoorId);
            }
        });
        if(SELECTED.parent.rotation.y < 2.2){
            SELECTED.parent.rotation.y += 0.1;
        }else{
            cancelAnimationFrame(this.animationOpenDoorId);
            return false
        }
        this.animationOpenDoorId = requestAnimationFrame(() => {
            this.animationOpenDoor(arr, SELECTED)
        });
    }

    onContextMenu(e) {
        let intersects = this.getIntersects(e);
        if (intersects.length) {
            let firstIntersects = intersects[0];
            // 只绑定机柜的点击事件
            if ( firstIntersects.object.name.indexOf(this.chassisName) > -1 ) {
                e.preventDefault ? (e.preventDefault()) : (e.returnValue = false);
                let menu = document.getElementById('myContextMenu'),
                    pageX = e.pageX ? e.pageX : (e.clientX+(document.body.scrollLeft || document.documentElement.scrollLeft)),
                    pageY = e.pageY ? e.pageY : (e.clientY+(document.body.scrollTop || document.documentElement.scrollTop));
                menu.style.left = pageX - this.leftBarWidth + 'px';
                menu.style.top = pageY - this.topBarHeight + 'px';

                this.setState({
                    isShow: true,
                    chassisName: firstIntersects.object.name
                })
            }
        }
    }

    onMousemove(e) {
        let intersects = this.getIntersects(e);
        if(intersects.length){
            let firstIntersects = intersects[0];
            if ( firstIntersects.object.name.indexOf(this.chassisName) > -1 ) {
                e.preventDefault ? (e.preventDefault()) : (e.returnValue = false);
                let menu = document.getElementById('myContextMenu'),
                    pageX = e.pageX ? e.pageX : (e.clientX+(document.body.scrollLeft || document.documentElement.scrollLeft)),
                    pageY = e.pageY ? e.pageY : (e.clientY+(document.body.scrollTop || document.documentElement.scrollTop));
                menu.style.left = pageX - this.leftBarWidth + 'px';
                menu.style.top = pageY - this.topBarHeight + 'px';
                this.setState({
                    isShow: true,
                    chassisName: firstIntersects.object.name
                });
            }

            if(firstIntersects.object.name.indexOf('floorMesh') > -1){
                let arr = this.scene.children.filter((item) => {
                    return item.name.indexOf(this.chassisName) > -1
                });
                arr.forEach((item) => {
                    item.scale.set(1,1,1);
                    item.material.forEach((item) => {
                        item.color.set( item.lastColor );
                    })
                });
                this.setState({
                    isShow: false
                });
            }
        }
    }

    onWindowResize() {
        // 重新设置相机宽高比例
        this.width = document.getElementById('canvas-frame').clientWidth;
        this.height = document.getElementById('canvas-frame').clientHeight;
        this.camera.aspect = this.width / this.height;
        // 更新相机投影矩阵
        this.camera.updateProjectionMatrix();
        // 重新设置渲染器渲染范围
        this.renderer.setSize(this.width, this.height);
    }

    async setMesh() {
        let floorMesh = await getMesh.getFloorMesh();
        this.scene.add(floorMesh);
        let leftWallMesh = await getMesh.getLeftWallMesh();
        floorMesh.add(leftWallMesh);
        let rightWallMesh = await getMesh.getRightWallMesh();
        floorMesh.add(rightWallMesh);
        let forwardWallMesh = await getMesh.getForwardWallMesh();
        floorMesh.add(forwardWallMesh);

        // let arrTestMesh = await getMesh.getCubePicMesh();
        // this.testMesh = arrTestMesh[0];
        // this.scene.add(this.testMesh);
        // this.doorMesh = arrTestMesh[1];

        let obj = {
            creatNum: 100,
            startPositionArr: [-240, 0, -251],
            planeToCoordinateLengthY: 10,
            rackSizing: [20, 80, 20],
            rackSpacingX: 30,
            arrangedByWhitch: 'x',
            isPositiveDerection: true,
            xRange: 600,
            rackSpacingZ: 30
        };

        let meshArr = await getMesh.creatRack(obj);
        meshArr.forEach((item) => {
            this.scene.add(item);
        });

        this.initDragControls();

        return new Promise((resolve, reject) => {
            resolve();
        })
    }

    threeStart() {
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initControls();
        this.setMesh().then(() => {
            this.onWindowResize();
            this.animation();
            window.addEventListener( 'contextmenu', (e) => {
                this.onContextMenu(e)
            }, false );
            window.addEventListener('resize', (e) => {
                this.onWindowResize(e)
            },false);

            // window.addEventListener( 'mousemove', (e) => {
            //     this.onMousemove(e)
            // }, false );
            window.addEventListener("click", (e) => {
                this.onClick(e)
            },false);

            this.setState({
                loading: false
            })

        });
    }

    animation() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animation();
        });
    }

    render() {
        return (
            <div className="threeJs">
                <Spin tip="Loading..." spinning={this.state.loading}>
                    <ul id='myContextMenu' >
                        <li><div >机柜详情{this.state.chassisName}</div></li>
                        <li><div >分组详情</div></li>
                    </ul>
                    <div id="canvas-frame"></div>
                </Spin>
            </div>
        );
    }

    componentDidMount() {
        this.mainCanvas = document.getElementById("canvas-frame");
        this.threeStart();
    }

    componentWillUnmount() {
        //清除WebGL缓存
        let cvs = this.renderer.domElement;
        let cxt = cvs.getContext("webgl");
        cxt.clear(cxt.DEPTH_BUFFER_BIT);
    }
}

export default Canvas;
