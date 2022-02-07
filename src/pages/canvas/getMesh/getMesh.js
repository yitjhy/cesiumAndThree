import * as THREE from "three";
import * as loaderImage from './../loaderImg/loaderImg'

// import myJson from 'three/examples/fonts/optimer_regular.typeface.json'

export function getEarthMesh() {
    return new Promise((resolve, reject) => {
        loaderImage.loaderEarthPic().then(response => {
            let geometry = new THREE.SphereGeometry(100, 20, 20);
            let material = new THREE.MeshBasicMaterial({map: response});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = 50;
            mesh.position.y = 130.5;
            mesh.position.z = 0;
            mesh.name = "sphere";
            resolve(mesh)
        }).catch(err => {
            console.log(err)
        })
    })
}

export function getFloorMesh() {
    return new Promise((resolve, reject) => {
        loaderImage.loaderFloorPic().then(response => {
            let geometry = new THREE.BoxGeometry(600, 20, 600);
            let material = new THREE.MeshBasicMaterial({map: response, color: 0x98AEB5});
            let floorMesh = new THREE.Mesh(geometry, material);
            floorMesh.name = 'floorMesh';
            resolve(floorMesh)
        }).catch(err => {
            console.log(err)
        })
    })
}

export function getLeftWallMesh() {
    return new Promise((resolve, reject) => {
        loaderImage.loaderFloorPic().then(response => {
            let geometry = new THREE.BoxGeometry(15, 150, 600);
            let material = new THREE.MeshBasicMaterial({map: response});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = -308.001;
            mesh.position.y = 64.5;
            mesh.position.z = 0;
            resolve(mesh)
        }).catch(err => {
            console.log(err)
        })
    })
}

export function getRightWallMesh() {
    return new Promise((resolve, reject) => {
        loaderImage.loaderFloorPic().then(response => {
            let geometry = new THREE.BoxGeometry(15, 150, 600);
            let material = new THREE.MeshBasicMaterial({map: response});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = 308.001;
            mesh.position.y = 64.5;
            mesh.position.z = 0;
            resolve(mesh)
        }).catch(err => {
            console.log(err)
        })
    })
}

export function getForwardWallMesh() {
    return new Promise((resolve, reject) => {
        loaderImage.loaderFloorPic().then(response => {
            let geometry = new THREE.BoxGeometry(630, 150, 15);
            let material = new THREE.MeshBasicMaterial({map: response});
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = 0;
            mesh.position.y = 64.5;
            mesh.position.z = -300;
            resolve(mesh)
        }).catch(err => {
            console.log(err)
        })
    })
}

export function getCubePicMesh() {
    return new Promise((resolve, reject) => {
        loaderImage.rackFrontPic().then((rackFrontPic) => {
            loaderImage.rackBackPic().then((rackBackPic) => {
                loaderImage.rackRightPic().then((rackRightPic) => {
                    let arr = [rackRightPic, rackRightPic, rackRightPic, rackRightPic, rackFrontPic, rackBackPic];
                    let geometry = new THREE.BoxGeometry(30, 100, 29);
                    let mats = [];
                    for (let i = 0; i < geometry.faces.length; i++) {
                        let material = null;
                        if(i!==4){
                            material = new THREE.MeshBasicMaterial({map: arr[i]});
                            material.side = 2
                        }
                        mats.push(material);
                    }
                    let boxMesh = new THREE.Mesh(geometry, mats);
                    boxMesh.receiveShadow = true;
                    boxMesh.name = 'rack_doo1r_back_1';

                    let doorGroup = new THREE.Group();
                    let doorGeometry = new THREE.BoxGeometry(30, 100, 1);
                    let doorMaterial = new THREE.MeshLambertMaterial( { map: rackFrontPic} );  /*color:0xFFFF00,*/
                    let doorMesh = new THREE.Mesh( doorGeometry, doorMaterial);
                    doorMesh.name = 'doorMesh';
                    doorGroup.add(doorMesh);

                    doorMesh.position.set(-15, -50, 0);
                    doorGroup.position.set(15, 50, 15);

                    boxMesh.add(doorGroup);


                    boxMesh.position.y = 61;
                    let meshArr = [boxMesh, doorGroup];

                    resolve(meshArr)

                });
            });
        });
    })
}

export function creatRack(obj) {
    let creatNum = obj.creatNum || 15;     // 生成的机柜数量
    let startPositionArr = obj.startPositionArr || [-240, 0, -280];    // 生成的机柜排列的开始位置
    let planeToCoordinateLengthY = obj.planeToCoordinateLengthY || 10;   // 平面到坐标轴的垂直距离
    let rackSizing = obj.rackSizing || [18, 80, 18];    // 机柜大小
    let rackSpacingX = obj.rackSpacingX || 10;            // 机柜x轴之间的间距
    let arrangedByWhitch = obj.arrangedByWhitch || 'x';  // 沿x轴或者z轴方向（只能是x轴或者z轴）
    let isPositiveDerection = obj.isPositiveDerection;   // 正反方向
    let xRange = obj.xRange || 600;                      // 沿x轴边界
    let rackSpacingZ = obj.rackSpacingZ || 50;           // 机柜z轴之间的间距
    let zRange = 600;                   // 沿z轴边界
    let meshArr = [];               // 生成的mesh数组
    let index = 0;                  // 第几行
    let rackName = 'rack_door_back';
    return new Promise((resolve, reject) => {
        getImage().then(res => {
            // 生成一个机柜
            function creatGeometry(creatNum, startPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, isPositiveDerection, xRange) {
                let arr = res;
                // 生成立方体模型 start
                let geometry = new THREE.BoxGeometry(...rackSizing);
                let mats = [];
                let colorArr = ['#3A4752', '#BE3F39', '#93A2B1', '#484D56'];
                let num = Math.floor(Math.random() * 3);
                for (let i = 0; i < geometry.faces.length; i++) {
                    let material = '';
                    if(i!==4){
                        material = new THREE.MeshBasicMaterial({map: arr[i], color: colorArr[num]});
                        // 控制纹理内外都可以看见（1：只渲染半块；2：渲染全部）
                        material.side = 2;
                        material.lastColor = colorArr[num];
                    }
                    mats.push(material);
                }
                let boxMesh = new THREE.Mesh(geometry, mats);
                // boxMesh.receiveShadow = true;

                let doorGroup = new THREE.Group();
                doorGroup.name = 'doorGroup';
                let doorGeometry = new THREE.BoxGeometry(20, 80, 1.5);
                let doorMats = [];
                for (let i = 0; i < doorGeometry.faces.length; i++) {
                    let material = '';
                    material = new THREE.MeshBasicMaterial({map: arr[i], color: colorArr[num]});
                    material.side = 2;
                    material.lastColor = colorArr[num];
                    doorMats.push(material);
                }
                let doorMesh = new THREE.Mesh( doorGeometry, doorMats);
                doorMesh.name = 'doorMesh';
                doorGroup.add(doorMesh);

                // 设置门的旋转中心 start
                doorMesh.position.set(-10, -40, 0);
                doorGroup.position.set(10, 40, 10);
                // 设置门的旋转中心 end
                boxMesh.add(doorGroup);

                let earthGeometry = new THREE.SphereGeometry(9, 9, 9);
                let earthmaterial = new THREE.MeshBasicMaterial({map: arr[6]});
                let artchMesh = new THREE.Mesh(earthGeometry, earthmaterial);
                artchMesh.name = "earth";
                boxMesh.add(artchMesh);

                // let loader = new THREE.FontLoader();
                // // let myJson = require('three/examples/fonts/optimer_regular.typeface.json');
                // loader.load(myJson, function ( font ) {
                //     let geometry222 = new THREE.TextGeometry( 'hjkh', {
                //         font: font,
                //         size: 80,
                //         height: 5,
                //         curveSegments: 12,
                //         bevelEnabled: true,
                //         bevelThickness: 10,
                //         bevelSize: 8,
                //         bevelSegments: 5
                //     } );
                //     boxMesh.add(geometry222);
                // } );


                // 生成立方体模型 end

                if (arrangedByWhitch === 'x') {
                    if (isPositiveDerection) {
                        let xPosition = '';
                        if(meshArr.length === 0){
                            xPosition = startPositionArr[0];
                        }else{
                            xPosition = (rackSizing[0] + rackSpacingX) + startPositionArr[0];
                        }
                        // let xPosition = (rackSizing[0] + rackSpacingX) + startPositionArr[0];
                        // 正向遇到边界
                        if ((xPosition > (xRange / 2 - rackSizing[0] / 2) || xPosition === (xRange / 2 - rackSizing[0] / 2))) {
                            index++;

                            // 沿x轴正向边界点的最后一个机柜的x坐标
                            let nextStartPositionX = meshArr[meshArr.length - 1].position.x + (rackSizing[0] + rackSpacingX);
                            let nextStartPositionArr = [nextStartPositionX, startPositionArr[1], startPositionArr[2]];
                            if (meshArr.length < creatNum) {
                                if (index % 2 === 0) {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, true, xRange)
                                } else {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, false, xRange)
                                }
                            }
                        } else {
                            boxMesh.position.x = xPosition;
                            boxMesh.position.y = rackSizing[1] / 2 + planeToCoordinateLengthY;
                            boxMesh.position.z = startPositionArr[2] + index * (rackSpacingZ + rackSizing[2]);
                            boxMesh.name = `${rackName}_${meshArr.length}`;
                            meshArr.push(boxMesh);

                            let nextStartPositionX = meshArr[meshArr.length - 1].position.x;
                            let nextStartPositionArr = [nextStartPositionX, startPositionArr[1], startPositionArr[2]];
                            if (meshArr.length < creatNum) {
                                creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, true, xRange)
                            }
                        }
                    } else {
                        let xPosition = -(rackSizing[0] + rackSpacingX) + startPositionArr[0];
                        // 反向遇到边界
                        if ((xPosition < -(xRange / 2 - rackSizing[0] / 2) || xPosition === (xRange / 2 - rackSizing[0] / 2))) {
                            index++;
                            // 沿x轴反向边界点的最后一个机柜的x坐标
                            let nextStartPositionX = meshArr[meshArr.length - 1].position.x - (rackSizing[0] + rackSpacingX);
                            let nextStartPositionArr = [nextStartPositionX, startPositionArr[1], startPositionArr[2]];
                            if (meshArr.length < creatNum) {
                                if (index % 2 === 0) {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, true, xRange)
                                } else {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, false, xRange)
                                }
                            }
                        } else {
                            boxMesh.position.x = xPosition;
                            boxMesh.position.y = rackSizing[1] / 2 + planeToCoordinateLengthY;
                            boxMesh.position.z = startPositionArr[2] + index * (rackSpacingZ + rackSizing[2]);
                            boxMesh.name = `${rackName}_${meshArr.length}`;
                            meshArr.push(boxMesh);
                            let nextStartPositionX = meshArr[meshArr.length - 1].position.x;
                            let nextStartPositionArr = [nextStartPositionX, startPositionArr[1], startPositionArr[2]];
                            if (meshArr.length < creatNum) {
                                creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, false, xRange)
                            }
                        }
                    }
                }

                if (arrangedByWhitch === 'z') {
                    if (isPositiveDerection) {
                        let xPosition = '';
                        if(meshArr.length === 0){
                            xPosition = startPositionArr[2];
                        }else{
                            xPosition = (rackSizing[2] + rackSpacingZ) + startPositionArr[2];
                        }
                        // let xPosition = (rackSizing[2] + rackSpacingZ) + startPositionArr[2];
                        // 正向遇到边界
                        if ((xPosition > (zRange / 2 - rackSizing[2] / 2) || xPosition === (zRange / 2 - rackSizing[2] / 2))) {
                            index++;
                            let nextStartPositionX = meshArr[meshArr.length - 1].position.z + (rackSizing[0] + rackSpacingX);
                            let nextStartPositionArr = [startPositionArr[0], startPositionArr[1], nextStartPositionX];
                            if (meshArr.length < creatNum) {
                                if (index % 2 === 0) {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, true, xRange)
                                } else {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, false, xRange)
                                }
                            }
                        } else {
                            /*startPositionArr[2] + index * (rackSpacingZ + rackSizing[2]);*/
                            boxMesh.position.x = startPositionArr[0] + index * (rackSpacingX + rackSizing[0]);
                            boxMesh.position.y = rackSizing[1] / 2 + planeToCoordinateLengthY;
                            boxMesh.position.z = xPosition;
                            boxMesh.name = `${rackName}_${meshArr.length}`;
                            meshArr.push(boxMesh);

                            let nextStartPositionX = meshArr[meshArr.length - 1].position.z;
                            let nextStartPositionArr = [startPositionArr[0], startPositionArr[1], nextStartPositionX];
                            if (meshArr.length < creatNum) {
                                creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, true, xRange)
                            }
                        }
                    } else {
                        let xPosition = -(rackSizing[2] + rackSpacingZ) + startPositionArr[2];
                        // 反向遇到边界
                        if ((xPosition < -(zRange / 2 - rackSizing[2] / 2) || xPosition === (zRange / 2 - rackSizing[2] / 2))) {
                            index++;
                            let nextStartPositionX = meshArr[meshArr.length - 1].position.z - (rackSizing[0] + rackSpacingX);
                            let nextStartPositionArr = [startPositionArr[0], startPositionArr[1], nextStartPositionX];
                            if (meshArr.length < creatNum) {
                                if (index % 2 === 0) {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, true, xRange)
                                } else {
                                    creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, false, xRange)
                                }
                            }
                        } else {
                            boxMesh.position.x = startPositionArr[0] + index * (rackSpacingX + rackSizing[0]);
                            boxMesh.position.y = rackSizing[1] / 2 + planeToCoordinateLengthY;
                            boxMesh.position.z = xPosition;
                            boxMesh.name = `${rackName}_${meshArr.length}`;
                            meshArr.push(boxMesh);
                            let nextStartPositionX = meshArr[meshArr.length - 1].position.z;
                            let nextStartPositionArr = [startPositionArr[0], startPositionArr[1], nextStartPositionX];
                            if (meshArr.length < creatNum) {
                                creatGeometry(creatNum, nextStartPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, false, xRange)
                            }
                        }
                    }
                }
            }
            creatGeometry(creatNum, startPositionArr, planeToCoordinateLengthY, rackSizing, rackSpacingX, arrangedByWhitch, isPositiveDerection, xRange);
            resolve(meshArr)
        });
    })
}

// 加载机箱需要的图片
function getImage() {
    return new Promise((resolve, reject) => {
        loaderImage.rackFrontPic().then((rackFrontPic) => {
            loaderImage.rackBackPic().then((rackBackPic) => {
                loaderImage.rackRightPic().then((rackRightPic) => {
                    loaderImage.loaderEarthPic().then(earthPic => {
                        let arr = [rackRightPic, rackRightPic, rackRightPic, rackRightPic, rackFrontPic, rackBackPic, earthPic];
                        resolve(arr)
                    }) ;
                })
            })
        })
    });
}
