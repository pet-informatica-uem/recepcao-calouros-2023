"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var cronograma = document.querySelector(".sec-cronograma");
var seletores = document.querySelectorAll(".seletor-data > li > a");
var dias = document.querySelectorAll(".programacao-dia");
var primeiroId = "dia-28-junho";
window.onscroll = function () {
  var atual = primeiroId;
  var posiçãoCronograma = cronograma.offsetTop - scrollY;
  console.log(posiçãoCronograma);
  dias.forEach(function (seção) {
    var posiçãoSeção = posiçãoCronograma + seção.offsetTop;

    // TODO ver se não tem um jeito de deixar isso não-hardcoded
    if (posiçãoSeção <= 124) {
      atual = seção.getAttribute("id");
    }
  });
  seletores.forEach(function (seletor) {
    seletor.classList.remove("active");
    if (seletor.getAttribute("href").includes(atual)) {
      seletor.classList.add("active");
    }
  });
  console.log(atual);
};

// @ts-check
// @ts-ignore
var CameraComponent = /*#__PURE__*/function () {
  function CameraComponent(_ref) {
    var angle = _ref.angle,
      distance = _ref.distance,
      width = _ref.width,
      height = _ref.height,
      depth = _ref.depth,
      rotation = _ref.rotation,
      _ref$anchor = _ref.anchor,
      anchor = _ref$anchor === void 0 ? new THREE.Vector3() : _ref$anchor;
    _classCallCheck(this, CameraComponent);
    this.angle = angle;
    this.distance = distance / 4;
    this.width = width;
    this.height = height;
    this.aspect = width / height;
    this.depth = depth;
    this.rotation = rotation;
    this.anchor = anchor;
    this.locked = false;
    this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 10000);
    this.resetPerspectiveCam();
  }
  _createClass(CameraComponent, [{
    key: "resetPerspectiveCam",
    value: function resetPerspectiveCam() {
      if (!this.camera) throw new Error('Camera não inicializada');

      // this.distance = .75;

      this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
      this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -this.angle);
      this.camera.position.x = Math.sin(this.rotation) * this.depth * this.distance + this.anchor.x;
      this.camera.position.y = Math.sin(this.angle) * this.depth * this.distance;
      this.camera.position.z = Math.cos(this.rotation) * this.depth * this.distance + this.anchor.z;
    }
  }, {
    key: "update",
    value: function update() {
      if (!this.camera) throw new Error('Camera não inicializada');
      this.camera.position.x = Math.sin(this.rotation) * this.depth * this.distance + this.anchor.x;
      this.camera.position.y = Math.sin(this.angle) * this.depth * this.distance;
      this.camera.position.z = Math.cos(this.rotation) * this.depth * this.distance + this.anchor.z;
      this.camera.lookAt(this.anchor);
    }
  }, {
    key: "draw",
    value: function draw(renderer, scene) {
      if (!this.camera) throw new Error('Camera não inicializada');
      renderer.render(scene, this.camera);
    }
  }, {
    key: "rotate",
    value: function rotate(rotation) {
      // this.rotation = rotation;

      this.rotation += rotation;
      this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotation.x);
      this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y);
    }
  }]);
  return CameraComponent;
}();
(function () {
  var _mountainsDiv$clientW, _mountainsDiv$clientH;
  var mountainsDiv = document.getElementById('render');
  var width = (_mountainsDiv$clientW = mountainsDiv === null || mountainsDiv === void 0 ? void 0 : mountainsDiv.clientWidth) !== null && _mountainsDiv$clientW !== void 0 ? _mountainsDiv$clientW : innerWidth;
  var height = (_mountainsDiv$clientH = mountainsDiv === null || mountainsDiv === void 0 ? void 0 : mountainsDiv.clientHeight) !== null && _mountainsDiv$clientH !== void 0 ? _mountainsDiv$clientH : innerHeight;
  var scene = new THREE.Scene();
  var camera = new CameraComponent({
    angle: 35 * Math.PI / 180,
    distance: 1,
    width: width,
    height: height,
    depth: 1000,
    rotation: 0
  });
  var boxGeometry = new THREE.BoxGeometry(100, 100, 100);
  var boxMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff
  });
  var box = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(box);

  // const light = new THREE.DirectionalLight(0xffffff, 1);
  // light.position.y = 10;
  // light.position.x = 10;

  // light.castShadow = true;
  // scene.add(light);

  var renderer = new THREE.WebGLRenderer({
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  mountainsDiv === null || mountainsDiv === void 0 ? void 0 : mountainsDiv.appendChild(renderer.domElement);
  var _time = 0;
  var dt = 0;
  function render(ms) {
    requestAnimationFrame(render);
    dt = (ms - _time) / 1000;
    _time = ms;
    camera.rotate(dt);
    camera.update();
    camera.draw(renderer, scene);
  }
  render(0);
  console.log(mountainsDiv);
})();
// Hello, world!