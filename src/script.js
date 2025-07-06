import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Debug UI
 */
const gui = new GUI()

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Load Model (without Draco)
 */
const gltfLoader = new GLTFLoader()

let mixer = null

gltfLoader.load(
    '/models/semestral.glb', // <-- Make sure this path is correct
    (gltf) => {
        gltf.scene.scale.set(1, 1, 1)
    
        scene.add(gltf.scene)
    
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error)
    }
)
// === ADD NEW OBJECTS ===

// 1. Rug (a flat red circle)
const rug = new THREE.Mesh(
    new THREE.CircleGeometry(2.5, 32),
    new THREE.MeshStandardMaterial({ color: '#808080', roughness: 1.5 })
)
rug.rotation.x = -Math.PI / 2
rug.position.set(0, 0.01, 0) // Slightly above floor to avoid z-fighting
scene.add(rug)


// TV base
const tv = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 3.2, 0.05),
    new THREE.MeshStandardMaterial({ color: '#000000' })
)
tv.position.set(0, 1.2, -1.49) // Adjust to your wall
scene.add(tv)

// TV screen (optional lighter frame or glow)
const tvFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 0.01),
    new THREE.MeshStandardMaterial({ color: '#8B0000', emissive: '#111111' })
)
tvFrame.position.copy(tv.position)
tvFrame.position.z -= 0.01
scene.add(tvFrame)

// === END OF NEW OBJECTS ===
const bookBase = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.02, 0.3),
    new THREE.MeshStandardMaterial({ color: '#804000' }) // brown cover
)
bookBase.position.set(0.5, 0.02, -0.8)
scene.add(bookBase)

// Page (single animated mesh)
const bookPage = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.28),
    new THREE.MeshStandardMaterial({ color: '#ffffff', side: THREE.DoubleSide })
)
bookPage.rotation.x = -Math.PI / 2
bookPage.position.set(0.5, 0.03, -0.8)
scene.add(bookPage)

// Animation for the book page
const bookPageAnimation = {
    angle: 0,
    update: function(delta) {
        this.angle += delta * 0.5; // Adjust speed as needed
        if (this.angle > Math.PI / 2) this.angle = 0; // Reset after a full flip
        bookPage.rotation.y = this.angle; // Rotate around Y-axis
    }
};  

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(-5, 5, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animation Loop
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (mixer) {
        mixer.update(deltaTime)
    }

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()
