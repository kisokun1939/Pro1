window.addEventListener('load', init);

function init () {
  //基本設定
var width = 900;
var height = 900;

var Camera_rotX = 0; // 角度
var Camera_rotY = 0; // 角度
var Cube_rotX = 0;
var mouseX = 0; // マウス座標
var mouseY = 0; // マウス座標

var x_position = 0;
var y_position = 0;
var z_position = 0;

var speedX = 0;
var speedY = 0;
var fov = 60;
var Camera_deceleration = 0.1;
var Cube_deceleration = 0.1;
var high = 0
var pointer = 'on'

var input_key_buffer = new Array;
var down_w = false;
var down_r = false;
var down_space = false;
var jump = false;
var up = false;
var gravity = 0.1;
var jump_high = 4;
var box_fly = false;

// マウス座標はマウスが動いた時のみ取得できる
document.addEventListener("mousemove", (event) => {
  mouseX = event.pageX;
  mouseY = event.pageY;
});
var renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  alpha: false //背景を透過する
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 50, 2000);

// var axes = new THREE.AxisHelper(50);
// scene.add(axes);

// カメラ設定
var camera = new THREE.PerspectiveCamera(fov, width / height);

// ライト設定
// const AmbientLight = new THREE.AmbientLight(0xFFFFFF, 0.4);
// scene.add(AmbientLight);

const PointLight = new THREE.PointLight(0xFFFFFF, 1.1);
PointLight.position.set(0, 200, 0)
// PointLight.position.set(200, 200, 200)
PointLight.castShadow = true;
PointLight.shadow.mapSize.width = 2048;
PointLight.shadow.mapSize.height = 2048;
scene.add(PointLight);

const plane = new THREE.Mesh(
  new THREE.BoxGeometry( 500, 0.01, 500),
  new THREE.MeshStandardMaterial({color: 0x4b2c15, roughness:1})
);
plane.position.set(0, -5, 0)
plane.receiveShadow = true;
scene.add( plane );

const cube = new THREE.Mesh(
  new THREE.BoxGeometry( 10, 10, 10 ),
  new THREE.MeshStandardMaterial({color: 0x6699FF, roughness:1})
);
cube.position.set(0, 0, 0)
cube.castShadow = true;
scene.add( cube );

const box = new THREE.Mesh(
  new THREE.BoxGeometry( 5, 5, 5 ),
  new THREE.MeshStandardMaterial({color: 0xFF0000, roughness:1})
);
box.position.set(0, 0, 0)
box.castShadow = true;
scene.add( box );

createStarField();

function createStarField() {
  // 形状データを作成
  const geometry = new THREE.Geometry();
  for (var i = 0; i < 5000; i++) {
    geometry.vertices.push(
      new THREE.Vector3(
        3000 * (Math.random() - 0.5),
        -500 + 5000 * (Math.random()),
        3000 * (Math.random() - 0.5)
      )
    );
  }
  // マテリアルを作成
  const material = new THREE.PointsMaterial({
    size: 10,
    color: 0xFFFFFF
  });

  // 物体を作成
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
}

const Cone_geometry = new THREE.Geometry()
const Cylinder_geometry = new THREE.Geometry()

for (let i = 0; i < 200; i++) {

  const x = 450 * (Math.random() - 0.5);
  const z = 450 * (Math.random() - 0.5);

  const Cone = new THREE.Mesh(new THREE.ConeGeometry(10, 40, 50));
  Cone.position.set(x, 45, z);
  Cone_geometry.mergeMesh(Cone);

  const Cylinder = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 30, 50));
  Cylinder.position.set(x, 10, z);
  Cylinder_geometry.mergeMesh(Cylinder);
}

const Cone_material = new THREE.MeshStandardMaterial({color: 0x829A5B, roughness:0});
const Cone_mesh = new THREE.Mesh(Cone_geometry, Cone_material);
Cone_mesh.castShadow = true;
scene.add(Cone_mesh);

const Cylinder_material = new THREE.MeshStandardMaterial({color: 0x907346, roughness:0});
const Cylinder_mesh = new THREE.Mesh(Cylinder_geometry, Cylinder_material);
Cylinder_mesh.castShadow = true;
scene.add(Cylinder_mesh);

// const controls = new THREE.OrbitControls(camera);
// controls.enableKeys = false;

// for (let index = 0; index < 170; index++) {
// new THREE.MTLLoader().setPath('./three/')
//   .load('obj.mtl',
//   function(materials){
//     materials.preload();
//     new THREE.OBJLoader().setPath('./three/').setMaterials(materials).load('tinker.obj',
//       function(object){
//         objmodel = object.clone();
//         obj = new THREE.Object3D();
//         obj.add(objmodel);
//         obj.position.set(
//           450 * (Math.random() - 0.5),
//           25,
//           450 * (Math.random() - 0.5)
//         );
//         obj.scale.set(0.7, 0.7, 0.7);
//         obj.rotation.set(0, 0, 0);
//         scene.add(obj);
//       }
//     );
//   });
// var obj = new THREE.Mesh();
// }

parameters()

function parameters() {
  var elem = document.getElementById('range');
  var target = document.getElementById('value');
  var rangeValue = function (elem, target) {
    return function(evt){
      Camera_deceleration = elem.value;
      target.innerHTML = elem.value;
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));

  var elem = document.getElementById('range2');
  var target = document.getElementById('value2');
  var rangeValue = function (elem, target) {
    return function(evt){
      Cube_deceleration = elem.value;
      target.innerHTML = elem.value;
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));

  var elem = document.getElementById('range3');
  var target = document.getElementById('value3');
  var rangeValue = function (elem, target) {
    return function(evt){
      fov = elem.value;
      target.innerHTML = elem.value;
      camera.fov = Number(fov);
      camera.updateProjectionMatrix();
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));

  var elem = document.getElementById('range4');
  var target = document.getElementById('value4');
  var rangeValue = function (elem, target) {
    return function(evt){
      high = elem.value;
      target.innerHTML = elem.value;
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));

  var elem = document.getElementById('range5');
  var target = document.getElementById('value5');
  var rangeValue = function (elem, target) {
    return function(evt){
      gravity = elem.value;
      jump_high = 10;
      target.innerHTML = elem.value;
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));


  var elem = document.getElementById('check');
  var target = document.getElementById('value6');
  var rangeValue = function (elem, target) {
    return function(evt){
      if (elem.value == 'on') {elem.value = 'off';}
      else {elem.value = 'on';}
      target.innerHTML = elem.value;
      pointer = elem.value;
    }
  }
  elem.addEventListener('input', rangeValue(elem, target));
}

const stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '10px';
        document.body.appendChild(stats.domElement);


animate();


function valueKey() {
  document.onkeydown = function (e){
    if(!e) e = window.event; // レガシー

    input_key_buffer[e.keyCode] = true;
  };

  document.onkeyup = function (e){
    if(!e) e = window.event; // レガシー

    input_key_buffer[e.keyCode] = false;
  };

  window.onblur = function (){

    // 配列をクリアする
    input_key_buffer.length = 0;
  };

  function KeyIsDown(key_code){

    if(input_key_buffer[key_code])	return true;

    return false;
  }

  // Wキーが押されているか調べる
	if(KeyIsDown(87)){
    down_w = true;
	}else{
    down_w = false;
  }

  // rキー
  if(KeyIsDown(82)){
    down_r = true;
	}else{
    down_r = false;
	}


	// スペースキーが押されているか調べる
	if(KeyIsDown(32)){
    down_space = true;
  }else{
    down_space = false;
  }
}


function animate(){

  valueKey();

  if (down_w) {
    if (speedX < 2){
      speedX += 0.02;
    }
  } else {
    speedX -= 0.02;
    if (speedX < 0.01) {
      speedX = 0
    }
  }


  if ( down_space && !jump) {
    up = true;
    jump = true;
    speedY = jump_high;
  }

  if ( up ) {
    speedY -= gravity;
    if (speedY < gravity) {
      up = false;
    }
  } else if (!up && jump) {
    speedY -= gravity;
    if (y_position < -speedY) {
      jump = false;
      speedY = 0;

      var i = 0;
      while (i < 10) {
        y_position -= y_position * 0.5
        i++
      }
      y_position = 0;
    }
  }

  requestAnimationFrame(animate);//★追加 アニメーション実行

  const target_Camera_RotX = (mouseX / window.innerWidth) * 360;
  const target_Camera_RotY = (window.innerHeight/2 - mouseY)*4;

  Camera_rotX += (target_Camera_RotX - Camera_rotX) * Camera_deceleration;
  Camera_rotY += (target_Camera_RotY - Camera_rotY) * Camera_deceleration;

  // ラジアンに変換する
  const radianX = Camera_rotX * Math.PI / 90;

  Cube_rotX += (radianX - Cube_rotX) * Cube_deceleration;

  x_position += speedX * Math.sin(Cube_rotX);
  y_position += speedY;
  z_position += speedX * Math.cos(Cube_rotX);

  cube.position.set(x_position, y_position, z_position);
  cube.rotation.y = Cube_rotX;
  camera.position.set(
    x_position + (-1 * high * Math.sin(radianX)),
    y_position + 10 + Number(high),
    z_position + (-1 * high * Math.cos(radianX)));

  camera.lookAt(1000000 * Math.sin(radianX), 2000 * Camera_rotY, 1000000 * Math.cos(radianX));

  if (down_r) {
    box_fly = true;
  }

  var list = [camera.rotation.x, camera.rotation.y, camera.rotation.z]
  if (box_fly) {
    console.log(list)
  } else {
    box.position.set(cube .position.x, 10, cube.position.z)
    box.rotation = camera.rotation
  }

  var canvas = document.getElementById('canvas')
  var cursor;
  if (pointer == 'on') {cursor = 'default'}
  else {cursor = 'none'}

  canvas.style.cursor = cursor;

  renderer.render(scene, camera);
  // document.getElementById('info').innerHTML = JSON.stringify(
  //   renderer.info.render,
  //   '',
  //   '    '
  // );

  // フレームレートを表示
  stats.update();
};

// ★追加 画面リサイズ
onResize();
window.addEventListener('resize', onResize);

function onResize() {
  var ranges_high = document.getElementById('info').clientHeight + 15 + document.getElementById('ranges').clientHeight;
  var width = window.innerWidth;
  var height = window.innerHeight - ranges_high;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
}