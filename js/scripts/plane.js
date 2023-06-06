// @ts-check
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import mountains from '../../assets/models/mountains.glb';
import tex from '../../assets/models/tex.png';

const BLOOM_PARAMS = {
    exposure: .8,
    bloomStrength: .1,
    bloomThreshold: 1,
    bloomRadius: 0,
}

// @ts-ignore
class CameraComponent {
    #composer;
    #outputPass;
    #bloomPass;
    #renderPass;

    #pos = 0;

    constructor({
        angle,
        distance,
        width,
        height,
        depth,
        rotation,
        anchor = new THREE.Vector3,
    }) {
        this.angle = angle;
        this.distance = distance;
        this.width = width;
        this.height = height;
        this.aspect = width / height;
        this.depth = depth;
        this.rotation = rotation;
        this.anchor = anchor;
    
        this.locked = false;
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.001, 10000);
        this.resetPerspectiveCam();
    }
    
    setupPostProcessing(renderer, scene) {
        this.#renderPass = new RenderPass(scene, this.camera);

        this.#bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.width, this.height),
            BLOOM_PARAMS.bloomStrength,
            BLOOM_PARAMS.bloomRadius,
            BLOOM_PARAMS.bloomThreshold
        );
        // @ts-ignore
        this.#outputPass = new OutputPass(THREE.ReinhardToneMapping, BLOOM_PARAMS.exposure);

        this.#composer = new EffectComposer(renderer);
        this.#composer.addPass(this.#renderPass);
        this.#composer.addPass(this.#bloomPass);
        this.#composer.addPass(this.#outputPass);

        console.log(this.#composer);
    }

    resetPerspectiveCam() {
        if (!this.camera) throw new Error('Camera não inicializada');

        // this.distance = .75;

        this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -this.angle);

        // this.camera.position.x = Math.sin(this.rotation)*this.depth*this.distance+this.anchor.x;
        this.camera.position.y = Math.sin(this.angle)*this.depth*this.distance;
        // this.camera.position.z = Math.cos(this.rotation)*this.depth*this.distance+this.anchor.z;
    
        this.anchor.z = this.#pos - .5;
        this.camera.position.z = this.anchor.z;
    }

    update(dt) {
        if (!this.camera) throw new Error('Camera não inicializada');
        
        // this.camera.position.x = Math.sin(this.rotation)*this.depth*this.distance+this.anchor.x;
        this.camera.position.y = Math.sin(this.angle)*this.depth*this.distance;
        this.camera.position.x = this.distance;
        // this.camera.position.z = Math.cos(this.rotation)*this.depth*this.distance+this.anchor.z;
        
        this.#pos = (this.#pos + dt/25) % 1;

        this.anchor.z = this.#pos - .5;
        this.camera.position.z = this.anchor.z;

        this.camera.lookAt(this.anchor);
    }

    draw(renderer, scene) {
        if (!this.camera) throw new Error('Camera não inicializada');
        
        this.#composer.render();
    }

    rotate(rotation) {
        this.rotation += rotation;

        this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotation.x);
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y);
    }
}

(() => {
    const mountainsDiv = document.getElementById('render');
    const width = mountainsDiv?.clientWidth??innerWidth;
    const height = mountainsDiv?.clientHeight??innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const fog = new THREE.Fog(0x000000, 0, .4);
    scene.fog = fog;

    const camera = new CameraComponent({
        angle: 5*Math.PI/180,
        distance: .3,
        width,
        height,
        depth: 1,
        rotation: 1/2*Math.PI
    })

    const loader = new GLTFLoader();
    let obj;

    loader.load(mountains, (gltf) => { 
        obj = gltf.scene.children[0];
        obj.scale.set(1, 1, 1);

        // @ts-ignore: material existe na mesh mas ta dando erro
        let mat = obj.material
        mat.magFilter = THREE.NearestFilter;
        mat.minFilter = THREE.LinearFilter;
        mat.emmisive = 0xff00ff;
        
        // let material = new THREE.TextureLoader().load(tex);

        // material.anisotropy = 4;
        // material.matrixAutoUpdate = false;
        // material.needsUpdate = false;
        // material.magFilter = THREE.NearestFilter;
        // material.minFilter = THREE.LinearFilter;
        // material.wrapS = THREE.MirroredRepeatWrapping;
        // material.wrapT = THREE.MirroredRepeatWrapping;
        // material.repeat.set(1, 1);

        // //@ts-ignore: material existe na mesh mas ta dando erro
        // obj.material = new THREE.MeshStandardMaterial({
        //     // roughness: .8,
        //     emissive: 0xff64ff,
        //     emissiveIntensity: 10,
        //     emissiveMap: material,
        //     flatShading: true,
            
        // });
        let obj1 = obj.clone();
        obj1.position.z = -1;
        
        let obj2 = obj.clone();
        obj2.position.z = 1;

        scene.add(obj);
        scene.add(obj1);
        scene.add(obj2);
    });
    // const ico = new THREE.IcosahedronGeometry(1, 2);
    // const icoMaterial = new THREE.MeshStandardMaterial({
    //     emissive: 0xff00ff,
    //     emissiveIntensity: 5,
    //     toneMapped: false,
    // })
    // const icoMesh = new THREE.Mesh(ico, icoMaterial);

    // scene.add(icoMesh);

    // const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
    // const boxMaterial = new THREE.MeshStandardMaterial({
    //     color: 0xffffff,
    //     emissive: 0xffffff,
    // })
    // const box = new THREE.Mesh(boxGeometry, boxMaterial);
    
    // scene.add(box);

    // const light = new THREE.AmbientLight(0xffffff, 1);
    // light.position.y = 10;
    // light.position.x = 10;

    // light.castShadow = true;
    // scene.add(light);

    mountainsDiv?.appendChild(renderer.domElement);
    camera.setupPostProcessing(renderer, scene);
    
    let _time = 0;
    let dt = 0;
    function render(ms) {
        requestAnimationFrame(render);
        dt = (ms - _time)/1000;
        _time = ms;

        // camera.rotate(dt/10);
        camera.update(dt);
        camera.draw(renderer, scene);
    }
    render(0);

    console.log(mountainsDiv);
})();