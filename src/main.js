
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Noise from './noise'
import {other} from './noise'

var targetGeo;
var sourceMesh;
var n;

var what = true;

// u is a value from 0 to 1
function lerp(a, b, u) {
  return a + u * (b - a);
}

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // LOOK: the line below is synyatic sugar for the code above. Optional, but I sort of recommend it.
  // var {scene, camera, renderer, gui, stats} = framework; 

  // initialize a simple box and material
  var box = new THREE.BoxGeometry(1, 1, 1);

  var pointMat = new THREE.PointsMaterial( { color: 0xffffff });  
  pointMat.sizeAttenuation = false;

  targetGeo = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); // Start

  var sourceGeo = new THREE.Geometry();

  n = targetGeo.vertices.length;
  for (var i = 0; i < n; i++) {
      var pos = new THREE.Vector3(Math.random() * 1.0, Math.random() * 1.0, Math.random() * 1.0);
      sourceGeo.vertices.push(pos);
  }

  sourceMesh = new THREE.Points(sourceGeo, pointMat); // Mesh
  scene.add(sourceMesh);

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
}

// called on frame updates
function onUpdate(framework) {
  if (sourceMesh) {
    var d = new Date();
    var t = d.getTime();

    for (var i = 0; i < n; i++) {
      var targetPos = targetGeo.vertices[i];
      var sourcePos = sourceMesh.geometry.vertices[i];

      sourceMesh.geometry.vertices[i] = new THREE.Vector3(
          lerp(sourcePos.x, targetPos.x, 0.001),
          lerp(sourcePos.y, targetPos.y, 0.001),
          lerp(sourcePos.z, targetPos.z, 0.001));

      //sourceMesh.geometry.vertices[i] = new THREE.Vector3(Math.random(t) * 1.0, Math.random() * 1.0, Math.random() * 1.0);
    }

    // Make sure to update
    sourceMesh.geometry.verticesNeedUpdate = true;
  }

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

// console.log('hello world');

// console.log(Noise.generateNoise());

// Noise.whatever()

// console.log(other())