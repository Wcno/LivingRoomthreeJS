import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Configuración inicial de la escena
const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const gltfLoader = new GLTFLoader()
let mixer = null

// Cargar texturas para aplicar a los objetos
const textureLoader = new THREE.TextureLoader()
const ballTexture = textureLoader.load('/textures/texture_futbol.jpg')
const paredTexture = textureLoader.load('/textures/text_sala.jpg')

// Cargar modelo 3D de la sala y configurar materiales
gltfLoader.load(
    '/models/semestral.glb',
    (gltf) => {
        gltf.scene.scale.set(1, 1, 1)
        scene.add(gltf.scene)
 
        // Aplicar textura de fútbol al balón
        gltf.scene.traverse((child) => {
            if (child.isMesh && child.name === "Solid001") {
                child.material = new THREE.MeshStandardMaterial({
                    map: ballTexture,
                    roughness: 0.1,        
                    metalness: 0.5,      
                    emissive: new THREE.Color(0xffffff), 
                    emissiveIntensity: 0.3
                })
                child.material.needsUpdate = true
                child.castShadow = true
                child.receiveShadow = true
            }
        })

        // Aplicar textura a la pared
        gltf.scene.traverse((child) => {
            if (child.isMesh && child.name === "Plane018") {
                child.material.map = paredTexture
                child.material.needsUpdate = true
            }
        })

        // Configurar material de los libros (color rosa)
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
 
        

        // Crear patas adicionales para el sofá
        let sofaLegMaterial = null

        // Obtener material de las patas existentes del sofá
        gltf.scene.traverse((child) => {
            if (child.isMesh && child.name === "Plane017") {
                sofaLegMaterial = child.material
            }
        })

        // Crear patas traseras del sofá
        const legBackLeft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.10, 0.10, 0.8, 5),
            sofaLegMaterial
        )
        legBackLeft.position.set(-1.79, 0.15, 4.3)
        scene.add(legBackLeft)

        const legBackRight = legBackLeft.clone()
        legBackRight.position.set(3.2, 0.15, 4.3)
        scene.add(legBackRight)

        const legMiddleBack = legBackLeft.clone()
        legMiddleBack.position.set(3.2, 0.15, 2.7)
        scene.add(legMiddleBack)

        // Crear simulación de agua para la pecera
        const waterGeometry = new THREE.BoxGeometry(2, 1.2, 0.5)
        const waterMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x66ccff,
            transmission: 1.0,
            thickness: 0.1,
            depthWrite: false,
            roughness: 0.05,
            metalness: 0.0,
            
            ior: 1.333,
            transparent: true,
            opacity: 0.3,
            reflectivity: 0.1,
        })

        const water = new THREE.Mesh(waterGeometry, waterMaterial)
        
        water.position.set(3.25, 0.7, -3.5)
        water.renderOrder = 1; // Asegúrate de que los peces tengan renderOrder < 1
        scene.add(water)

        

        // Configurar animaciones del modelo 
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

// Configuración de iluminación
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

// Configuración responsiva del canvas
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

// Configuración de cámara y controles
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(2, 2, 2)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true
controls.minDistance = 1
controls.maxDistance = 5000

// Configuración del renderizador
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Loop de animación principal
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Actualizar animaciones del modelo si existen
    if (mixer) {
        mixer.update(deltaTime)
    }

    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(tick)
}

tick()

// Sistema de selección de objetos con raycast
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

const options = {
    selectedColor: '#ff0000',
    pickEnabled: false
}

// Controles de la interfaz gráfica
gui.addColor(options, 'selectedColor').name('Cambiar color al objeto')
gui.add(options, 'pickEnabled').name('🖱️ Modo selección')

// Event listener para clicks en objetos
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

// Controles de iluminación en la GUI
const lightFolder = gui.addFolder('Luz Escena')
lightFolder.add(directionalLight, 'intensity').min(0).max(5).step(0.1)

const lightControls = {
    apagarLuz: () => {
        directionalLight.intensity = 0
        ambientLight.intensity = 0
    },
    encenderLuz: () => {
        directionalLight.intensity = 1.8
        ambientLight.intensity = 2.4
    }
}

lightFolder.add(lightControls, 'apagarLuz').name('🔴 Apagar luz')
lightFolder.add(lightControls, 'encenderLuz').name('🟢 Encender luz')

const tvLight = new THREE.RectAreaLight(0xffffff, 10, 2, 1.2)
tvLight.position.set(2.7, 1.5, -3.8) // Ajusta según la posición del TV
tvLight.rotation.y = Math.PI         
scene.add(tvLight)


