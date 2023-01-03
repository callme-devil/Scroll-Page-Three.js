import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

const gltfLoader = new GLTFLoader()

const textureLoader = new THREE.TextureLoader()

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>{
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const particleTexture = textureLoader.load('particles/9.png')

gltfLoader.load('models/keyboard.glb', processKeyboard)
gltfLoader.load('models/coin.glb', processCoin)
gltfLoader.load('models/pixel_space_ship.glb', processSpaceShip)

const objectsDistance = 4

let modelKeyboard = new THREE.Object3D()
let modelCoin = new THREE.Object3D()
let modelSpaceShip = new THREE.Object3D()

function processKeyboard(gltf) {

    modelKeyboard.add(gltf.scene)
    modelKeyboard.scale.set(0.1,0.1,0.1)
    modelKeyboard.rotation.x  = 1.5
    scene.add(modelKeyboard)
}

function processCoin(gltf) {

    modelCoin.add(gltf.scene)
    modelCoin.scale.set(1.4,1.4,1.4)
    scene.add(modelCoin)
}

function processSpaceShip(gltf) {

    modelSpaceShip.add(gltf.scene)
    modelSpaceShip.scale.set(0.15,0.15,0.15)
    scene.add(modelSpaceShip)
}

const sectionObjects = [modelKeyboard , modelCoin , modelSpaceShip]


modelKeyboard.position.y = - objectsDistance  * 0
modelCoin.position.y = - objectsDistance * 1.2
modelSpaceShip.position.y = - objectsDistance * 1.5

modelKeyboard.position.x = 1
modelCoin.position.x = - 2
modelSpaceShip.position.x = -0.8

modelKeyboard.position.z = 2.6

/**
 * Particles
 */
// Geometry
const particlesCount = 600
const positions = new Float32Array(particlesCount * 3)
const colors = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++){
    positions[i * 3] = (Math.random() - 0.5) * 15
    positions[i * 3 + 1] = objectsDistance * 0.4 - Math.random() * objectsDistance * sectionObjects.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5
    colors[i * 3] = Math.random()
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position' ,
    new THREE.BufferAttribute(positions , 3))
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors , 3)
)
// Material
const particlesMaterial = new THREE.PointsMaterial({
    transparent : true,
    alphaMap:particleTexture,
    size: 0.2,
    sizeAttenuation: true,
    depthWrite : false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

const particles = new THREE.Points(particlesGeometry , particlesMaterial)
scene.add(particles)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff' , 1)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll' , ()=>{

    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection){
        currentSection = newSection

        // gsap.to(sectionObjects[currentSection].rotation,{
        //     duration: 1.5,
        //     ease: 'power2.inOut',
        //     x: '+=6',
        //     y: '+=3'
        // })

        gsap.to(modelKeyboard.rotation,{
            duration: 1.5,
            ease: 'power2.inOut',
            y: '+=3',
        })

        gsap.to(modelCoin.rotation , {
            duration: 1.5,
            ease: 'power2.inOut',
            y: '+=3'
        })

        gsap.to(modelSpaceShip.scale,{
            delay:3.5,
            x:'0.4',
            y:'0.4',
            z:'0.4',
            duration: 4
        })
        
        gsap.to(modelSpaceShip.position,{
            delay:1.5,
            x: '2',
            y: -'4' * '2.2',
            duration: 4
        })

    }

})
// gsap.to(particles.position,{
//     x:'2',
//     y:'2',
//     duration:3,
//     repeat: -1,
// })

// gsap.to(particles.position,{
//     x:'-2',
//     y:'-2',
//     duration:3,
//     repeat: -1,
// })

var tl = gsap.timeline({repeat: -1});
tl.to(particles.position, {x: 2, duration: 3});
tl.to(particles.position, {x: -1.4, duration: 3});

// tl.reversed( true ); 

// //toggles the orientation
// tl.reversed( !tl.reversed() ); 

// tl.pause();
// tl.resume();
// tl.seek(100);

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove' , (event)=>{
    cursor.x = event.clientX /sizes.width - 0.5
    cursor.y = event.clientY /sizes.height - 0.5
})

/**
 * Camera
 */
//Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate Camera
    camera.position.y =  - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY =  - cursor.y * 0.5
    cameraGroup.position.x +=(parallaxX - cameraGroup.position.x) * 1.5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 1.5 * deltaTime


    // Animate Objects
    for(const object of sectionObjects){
        // object.rotation.x += deltaTime * 0.04
        object.rotation.y += deltaTime * 0.32
    }
    modelKeyboard.rotation.x += deltaTime * 0.7

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()