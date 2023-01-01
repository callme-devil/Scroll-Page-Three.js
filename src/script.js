import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'

const gltfLoader = new GLTFLoader()

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
        material.color.set(parameters.materialColor)
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
// const material = new THREE.MeshToonMaterial({color: parameters.materialColor})
// const mesh = new THREE.Mesh(
//     new THREE.TorusGeometry,(1 , 2 , 32),
//     material
// )
// const mesh2 = new THREE.Mesh(
//     new THREE.TorusGeometry,(1 , 2 , 32),
//     material
// )
// const mesh3 = new THREE.Mesh(
//     new THREE.TorusGeometry,(1 , 2 , 32),
//     material
// )
// scene.add(mesh,mesh2,mesh3)

gltfLoader.load('models/keyboard.glb', processKeyboard)
gltfLoader.load('models/coin.glb', processCoin)
gltfLoader.load('models/pixel_space_ship.glb', processSpaceShip)

const objectsDistance = 4

let modelKeyboard = new THREE.Object3D()
let modelCoin = new THREE.Object3D()
let modelSpaceShip = new THREE.Object3D()

function processKeyboard(gltf) {

    modelKeyboard.add(gltf.scene)
    modelKeyboard.scale.set(0.2,0.2,0.2)
    scene.add(modelKeyboard)
}

function processCoin(gltf) {

    modelCoin.add(gltf.scene)
    modelCoin.scale.set(1.7,1.7,1.7)
    scene.add(modelCoin)
}

function processSpaceShip(gltf) {

    modelSpaceShip.add(gltf.scene)
    modelSpaceShip.scale.set(0.5,0.5,0.5)
    scene.add(modelSpaceShip)
}

const sectionObjects = [modelKeyboard , modelCoin , modelSpaceShip]


modelKeyboard.position.y = - objectsDistance  * 0
modelCoin.position.y = - objectsDistance * 1
modelSpaceShip.position.y = - objectsDistance * 2

// window.addEventListener('scroll' , ()=>{
//     gsap.to(model.position,{
//         x:1,
//         y:0.2,
//         z:2,
//         duration:1.4
//     })
//     gsap.to(model.rotation,{
//         x:1.7,
//         duration:1.4
//     })
// })


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

window.addEventListener('scroll' , ()=>{
    scrollY = window.scrollY
})
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Camera
    camera.position.y =  - scrollY / sizes.height * objectsDistance


    // Animate Objects
    for(const object of sectionObjects){
        object.rotation.x = elapsedTime * 0.04
        object.rotation.y = elapsedTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()