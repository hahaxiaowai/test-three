import * as THREE from "three";
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { SkyMesh } from 'three/addons/objects/SkyMesh.js';
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { WebGPURenderer } from "three/webgpu";
export function initScene(domId, type = "webgpu") {
  let camera, scene, renderer, stats;
  const container = document.getElementById(domId);
  // 初始化场景和相机
  scene = new THREE.Scene();
  // 背景
  scene.background = new THREE.Color(0xCCE0FF);
  // 雾
  scene.fog = new THREE.Fog(0xCCE0FF, 500, 10000);
  camera = new THREE.PerspectiveCamera(
    30,
    container.offsetWidth / container.offsetHeight,
    1,
    10000,
  );
  camera.position.set(10, 5, 15);
  scene.add(camera);
  // light
  const sunLight = new THREE.DirectionalLight( 0xFFE499, 5 );
  sunLight.castShadow = true;
  sunLight.shadow.camera.near = .1;
  sunLight.shadow.camera.far = 5;
  sunLight.shadow.camera.right = 2;
  sunLight.shadow.camera.left = - 2;
  sunLight.shadow.camera.top = 1;
  sunLight.shadow.camera.bottom = - 2;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.bias = - 0.001;
  sunLight.position.set( .5, 3, .5 );

  const waterAmbientLight = new THREE.HemisphereLight( 0x333366, 0x74ccf4, 5 );
  const skyAmbientLight = new THREE.HemisphereLight( 0x74ccf4, 0, 1 );

  scene.add( sunLight );
  scene.add( skyAmbientLight );
  scene.add( waterAmbientLight );

  // 辅助线
  const axesHelper = new THREE.AxesHelper(1000);
  axesHelper.position.set(0, 0, 0);
  scene.add(axesHelper);

  // 渲染
  if (type === "webgpu") {
    renderer = new WebGPURenderer();
  }
  else {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  }
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  // 控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  // controls.minDistance = 500;
  // controls.maxDistance = 5000;
  // 惯性阻尼
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  // 帧数
  stats = new Stats();
  stats.dom.style.position = "absolute";
  // stats.dom.style.left = null;
  // stats.dom.style.right = "0px";
  container.appendChild(stats.dom);
  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    stats.update();
  });
  loadCityModel(scene)
  return {
    camera,
    scene,
    renderer,
    stats,
  };
}

export function loadCityModel(scene,renderer,camera) {
  const loader = new GLTFLoader();
  loader.load("redCar.glb", async (gltf) => {
    console.log(gltf.scene);
    // await renderer.compileAsync( gltf.scene, camera, scene );
    scene.add(gltf.scene)
  });
}