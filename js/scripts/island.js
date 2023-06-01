// @ts-check
// @ts-ignore
class CameraComponent {
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

    resetPerspectiveCam() {
        if (!this.camera) throw new Error('Camera não inicializada');

        // this.distance = .75;

        this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), -this.angle);

        this.camera.position.x = Math.sin(this.rotation)*this.depth*this.distance+this.anchor.x;
        this.camera.position.y = Math.sin(this.angle)*this.depth*this.distance;
        this.camera.position.z = Math.cos(this.rotation)*this.depth*this.distance+this.anchor.z;
    }

    update() {
        if (!this.camera) throw new Error('Camera não inicializada');
        
        this.camera.position.x = Math.sin(this.rotation)*this.depth*this.distance+this.anchor.x;
        this.camera.position.y = Math.sin(this.angle)*this.depth*this.distance;
        this.camera.position.z = Math.cos(this.rotation)*this.depth*this.distance+this.anchor.z;
        this.camera.lookAt(this.anchor);
    }

    draw(renderer, scene) {
        if (!this.camera) throw new Error('Camera não inicializada');

        renderer.render(scene, this.camera);
    }

    rotate(rotation) {
        // this.rotation = rotation;

        this.rotation += rotation;

        this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotation.x);
        this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y);
    }
}

(() => {
    const mountainsDiv = document.getElementById('render');
    const width = mountainsDiv?.clientWidth??innerWidth;
    const height = mountainsDiv?.clientHeight??innerHeight;

    const scene = new THREE.Scene();
    const camera = new CameraComponent({
        angle: 35*Math.PI/180,
        distance: 1,
        width,
        height,
        depth: 1000,
        rotation: 0,
    })

    const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
    })
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    
    scene.add(box);

    // const light = new THREE.DirectionalLight(0xffffff, 1);
    // light.position.y = 10;
    // light.position.x = 10;

    // light.castShadow = true;
    // scene.add(light);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);

    mountainsDiv?.appendChild(renderer.domElement);
    
    let _time = 0;
    let dt = 0;
    function render(ms) {
        requestAnimationFrame(render);
        dt = (ms - _time)/1000;
        _time = ms;

        camera.rotate(dt);
        camera.update();
        camera.draw(renderer, scene);
    }
    render(0);

    console.log(mountainsDiv);
})();