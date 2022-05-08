import * as THREE from "three";

export function loaderCubeMap() {
    let cubeTextureLoader = new THREE.CubeTextureLoader();

    let a = require('./../images/Park/posx.jpg');
    let b = require('./../images/Park/negx.jpg');
    let c = require('./../images/Park/posy.jpg');
    let d = require('./../images/Park/negy.jpg');
    let e = require('./../images/Park/posz.jpg');
    let f = require('./../images/Park/negz.jpg');
    let arr = [a,b,c,d,e,f];
    return new Promise( (resolve, reject) => {
        let res = cubeTextureLoader.load(arr);
        resolve(res)
    })

}

// 加载地球图片
export function loaderEarthPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/Earth.png");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        resolve(res)
    })
}

// 加载地板图片
export function loaderFloorPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/floor.jpg");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        res.wrapS = res.wrapT = THREE.RepeatWrapping;
        res.repeat.set(20, 20);
        resolve(res)
    })
}

// 加载墙面图片
export function wallPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/rack_inside.jpg");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        resolve(res)
    })
}

// 加载小方块前面图片
export function rackFrontPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/rack_front_door.jpg");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        resolve(res)
    })
}

// 加载小方块后面图片
export function rackBackPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/rack_door_back.jpg");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        resolve(res)
    })
}

// 加载小方块右面图片
export function rackRightPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/rack.jpg");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        resolve(res)
    })
}

// 加载小方块左面图片
export function rackLeftPic() {
    let earthLoader = new THREE.TextureLoader();
    let planetTexture = require("./../images/rack_inside.jpg");
    return new Promise( (resolve, reject) => {
        let res = earthLoader.load(planetTexture);
        resolve(res)
    })
}
