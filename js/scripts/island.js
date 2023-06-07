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
import palmeira from '../../assets/palms.png';


const BLOOM_PARAMS = {
    exposure: .8,
    bloomStrength: .25,
    bloomThreshold: 1,
    bloomRadius: 0,
}

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

(() => {
    const mountainsDiv = document.getElementById('render');
    const width = mountainsDiv?.clientWidth??innerWidth;
    const height = mountainsDiv?.clientHeight??innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    // const fog = new THREE.Fog(0x000000, 0, 75); 
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

    loader.load(island, (gltf) => {
        obj = gltf.scene.children[0];
        obj.scale.set(10, 10, 10);
        
        // @ts-ignore: material existe na mesh mas ta dando erro
        const mat = obj.material;

        mat.emissiveIntensity = 5;
        mat.reflectivity = 0;

        // let grid = rectangleGeometry(100, 100);
        // let gridMat = new THREE.MeshStandardMaterial({
        //     wireframe: true,
        //     wireframeLinewidth: 1,
        //     emissive: 0xff64ff,
        //     emissiveIntensity: 5,
        // });
        // const mesh = new THREE.Mesh(grid, gridMat);

        // scene.add(mesh);

        // let line = new THREE.LineSegments()
        // line.geometry = new THREE.WireframeGeometry(obj.geometry);
        // line.material = new THREE.LineBasicMaterial({
        //     color: new THREE.Color(4, 1, 4),
        //     linewidth: 1,
        // });

        let material = new THREE.TextureLoader().load(tex);
    
        material.matrixAutoUpdate = false;
        material.needsUpdate = false;
        material.magFilter = THREE.NearestFilter;
        material.minFilter = THREE.LinearMipMapLinearFilter;
        material.wrapS = THREE.RepeatWrapping;
        material.wrapT = THREE.RepeatWrapping;
        material.repeat.set(.1, .1);

        //@ts-ignore: material existe na mesh mas ta dando erro
        obj.material = new THREE.MeshStandardMaterial({
            // roughness: .8,
            map: material,
            emissive: 0xff64ff,
            emissiveIntensity: 10,
            emissiveMap: material,
            roughness: .5,
        });

        obj.translateY(-.05);
        // scene.add(line);
        scene.add(obj);
    });

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

        camera.rotate(-dt/2);
        camera.update(dt);
        camera.draw(renderer, scene);
    }
    render(0);

    console.log(mountainsDiv);
})();

function onWindowResize(camera, renderer) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.resize(width, height);

    renderer.setSize(width, height);
}