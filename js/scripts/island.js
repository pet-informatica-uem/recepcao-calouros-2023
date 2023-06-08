// @ts-check
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// @ts-ignore
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

// @ts-ignore
import island from '../../assets/models/grid6.glb';
// @ts-ignore
import tex from '../../assets/models/tex.png';
// @ts-ignore
import palmeira from '../../assets/palmeira_sprite.png';

const NUMERO_PALMEIRAS = 6;
const CORES_PALMEIRAS = [
    0x5becff,
    0xf4ff61,
    0x9dffa1
]
const BLOOM_PARAMS = {
    exposure: .8,
    bloomStrength: .25,
    bloomThreshold: 1,
    bloomRadius: 0,
}

let ANIMATION_ON = true;

// @ts-ignore
class CameraComponent {
    #composer;
    #outputPass;
    #bloomPass;
    #renderPass;

    // @ts-ignore
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

        this.camera.position.x = Math.sin(this.rotation)*this.depth*this.distance+this.anchor.x;
        this.camera.position.y = Math.sin(this.angle)*this.depth*this.distance;
        this.camera.position.z = Math.cos(this.rotation)*this.depth*this.distance+this.anchor.z;
    }

    // @ts-ignore
    update(dt) {
        if (!this.camera) throw new Error('Camera não inicializada');
        
        this.camera.position.x = Math.sin(this.rotation)*this.depth*this.distance+this.anchor.x;
        this.camera.position.y = Math.sin(this.angle)*this.depth*this.distance;
        this.camera.position.z = Math.cos(this.rotation)*this.depth*this.distance+this.anchor.z;

        this.camera.lookAt(this.anchor);
    }

    // @ts-ignore
    draw(renderer, scene) {
        if (!this.camera) throw new Error('Camera não inicializada');
        
        this.#composer.render();
    }

    rotate(rotation) {
        this.rotation += rotation;

        this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotation.x);
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y);
    }

    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.#composer.setSize( width, height );
    }
}

(async () => {
    const mountainsDiv = document.getElementById('render');
    const width = mountainsDiv?.clientWidth??innerWidth;
    const height = mountainsDiv?.clientHeight??innerHeight;
    
    const playButton = document.querySelector(".ph-play");
    playButton?.addEventListener("click", () => {
        ANIMATION_ON = !ANIMATION_ON;
    });
    
    const vejaHorarios = document.querySelector(".veja-horarios");
    vejaHorarios?.addEventListener("click", () => {
        window.scroll({
            top: height
        })
    });
    
    if (width < height) {
        ANIMATION_ON = false;
    }

    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(0x000019, 1);
    scene.fog = fog;

    const camera = new CameraComponent({
        angle: 15*Math.PI/180,
        distance: .225,
        width,
        height,
        depth: 1,
        rotation: 1/2*Math.PI
    })

    const loader = new GLTFLoader();
    let obj;

    const gltf = await loader.loadAsync(island);

    obj = gltf.scene.children[0];
    obj.scale.set(10, 10, 10);

    let texture = await new THREE.TextureLoader().loadAsync(tex);

    texture.matrixAutoUpdate = false;
    texture.needsUpdate = false;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(.15, .15);
    texture.updateMatrix();

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        emissive: 0xff64ff,
        emissiveIntensity: 10,
        emissiveMap: texture,
        roughness: .6,
    });

    //@ts-ignore: material existe na mesh mas ta dando erro
    obj.material = material;
    obj.matrixAutoUpdate = false;
    obj.translateY(-.05);
    obj.updateMatrix();
    scene.add(obj);

    await setupPalms(scene);

    let sun = new THREE.IcosahedronGeometry(.02, 1);
    let sunMat = new THREE.MeshStandardMaterial({
        roughness: 1,
        metalness: 1,
        emissive: 0xffffff,
        emissiveIntensity: 2,
        toneMapped: false,
    });
    let sunMesh = new THREE.Mesh(sun, sunMat);
    sunMesh.position.set(-.035, .05, -.035);
    scene.add(sunMesh);

    let light = new THREE.PointLight(0xffffff, .3, .5);
    light.position.set(-.035, .05, .035);
    scene.add(light);

    mountainsDiv?.appendChild(renderer.domElement);
    camera.setupPostProcessing(renderer, scene);
    
    window.addEventListener('resize', () => {
        onWindowResize(camera, renderer)
    });    

    let _time = 0;
    let dt = 0;
    function render(ms) {
        requestAnimationFrame(render);
        dt = (ms - _time)/1000;
        _time = ms;

        if (ANIMATION_ON){
            camera.rotate(-dt/2);
            camera.update(dt);   
        }
        camera.draw(renderer, scene);
    }
    render(0);
})();

function onWindowResize(camera, renderer) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ANIMATION_ON = height < width;

    camera.resize(width, height);

    renderer.setSize(width, height);
}

async function setupPalms(scene) {
    const texture = await new THREE.TextureLoader().loadAsync(palmeira);

    for (let i = 0; i < NUMERO_PALMEIRAS; i++) {
        const palm = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture,
            color: CORES_PALMEIRAS[
                i%CORES_PALMEIRAS.length
            ]
        }));
        palm.center.set(0.5, 0);
        palm.scale.set(.02, .02, .02);

        const direction = (Math.random() + i)/2 * Math.PI;
        //entre 0.07 e 0.09
        const getDistance = () => ((Math.random()*20) + 70)/1000;
        palm.position.set(Math.cos(direction)*getDistance(), -0.05, Math.sin(direction)*getDistance());
        scene.add(palm);
    }
}
