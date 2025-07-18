import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const gltfLoader = new GLTFLoader()
let mixer = null

//cargar texturas
const textureLoader = new THREE.TextureLoader()
const ballTexture = textureLoader.load('/textures/texture_futbol.jpg')
const paredTexture = textureLoader.load('/textures/text_sala.jpg')
// const Box1Texture = textureLoader.load('/textures/texture_book_harry.jpg')

gltfLoader.load(
    '/models/semestral.glb',
    (gltf) => {
        gltf.scene.scale.set(1, 1, 1)
        scene.add(gltf.scene)
 
   //texture al balon
   gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Solid001") {
        child.material = new THREE.MeshStandardMaterial({
            map: ballTexture,
            roughness: 0.1,        
            metalness: 0.7,      
            emissive: new THREE.Color(0xffffff), 
            emissiveIntensity: 0.5
        })
        child.material.needsUpdate = true
        child.castShadow = true
        child.receiveShadow = true
    }
})
//texture a la pared
gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Plane018") {
        child.material.map = paredTexture
        child.material.needsUpdate = true
    }
})

//texture libro

gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Plane024_1") {
        child.material = new THREE.MeshStandardMaterial({
              color: 0xff69b4,         
            roughness: 0.4,
            metalness: 0.1
        })
        child.material.needsUpdate = true
    }
})
//texture libro
gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Plane023_3") {
        child.material = new THREE.MeshStandardMaterial({
              color: 0xff69b4,         
            roughness: 0.4,
            metalness: 0.1
        })
        child.material.needsUpdate = true
    }
})


//texture cube
gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Cube001") {
        child.material = new THREE.MeshStandardMaterial({
              color: 0x000000,         
            roughness: 0.4,
            metalness: 0.1
        })
        child.material.needsUpdate = true
    }
})
gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Plane023_1") {
        child.material = new THREE.MeshStandardMaterial({
              color: 0xff69b4,         
            roughness: 0.4,
            metalness: 0.1
        })
        child.material.needsUpdate = true
    }
})
// patas del sofá
let sofaLegMaterial = null

gltf.scene.traverse((child) => {
    if (child.isMesh && child.name === "Plane017") {
        sofaLegMaterial = child.material
    }
})

// Crear pata izquierda trasera
const legBackLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.10, 0.10, 0.8, 5),
    sofaLegMaterial
)
legBackLeft.position.set(-1.79, 0.15, 4.3)
scene.add(legBackLeft)

// Clonar a la derecha
const legBackRight = legBackLeft.clone()
legBackRight.position.set(3.2, 0.15, 4.3)
scene.add(legBackRight)

// Clonar a la derecha arriba
const legMiddleBack = legBackLeft.clone()
legMiddleBack.position.set(3.2, 0.15, 2.7)
scene.add(legMiddleBack)


const waterGeometry = new THREE.BoxGeometry(2, 0.9, 0.5); // ejemplo: ajusta a tu pecera

const waterMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x66ccff,            // Color azul claro
  transmission: 1.0,         
  thickness: 0.2,             // Grosor óptico para simulación volumétrica
  roughness: 0.05,            // Suavidad de la superficie
  metalness: 0.0,
  ior: 1.333,                 // Índice de refracción del agua
  transparent: true,
  opacity: 0.75,              // Ajusta según preferencia
  reflectivity: 0.3           // Opcional: agrega reflejo
});

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.position.set(3.2, 0.7, -3.5); // Ajusta la posición según tu pecera
scene.add(water);



       //animations book
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(gltf.scene)

            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play()
            })
        }
    },
    undefined,
    (error) => {
        console.error('Error loading model:', error)
    }

    
)


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
 * Camera y OrbitControls
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(2, 2, 2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

// Límites de zoom recomendados
controls.minDistance = 1      // Distancia mínima al objetivo
controls.maxDistance = 5000   // Distancia máxima (ajusta según tamaño de tu escena)

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
 * - Siempre mantiene el render y las animaciones activas,
 *   independiente de la posición de la cámara.
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


// click en objeto
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const options = {
    selectedColor: '#ff0000',
    pickEnabled: false // 🔁 Esto es lo que marca si está activado
}

gui.addColor(options, 'selectedColor').name('Cambiar color al objeto')
gui.add(options, 'pickEnabled').name('🖱️ Modo selección')

window.addEventListener('click', (event) => {
    if (!options.pickEnabled) return 

    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
        const object = intersects[0].object
        if (object.material && object.material.color) {
            object.material.color.set(options.selectedColor)
        }
    }
})

// Controlar la intensidad de la luz
const lightFolder = gui.addFolder('Luz')
lightFolder.add(directionalLight, 'intensity').min(0).max(5).step(0.1)

