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
gltfLoader.load('models/keyboard.glb', processGhost)

let model = new THREE.Object3D()
// let model2 = new THREE.Object3D()
// let mixer = null

function processGhost(gltf) {
    // mixer = new THREE.AnimationMixer(gltf.scene)
    // const action = mixer.clipAction(gltf.animations[0])

    // action.play()

    // gltf.scene.scale.set(.4,.4,.4)

    // gltf.scene.castShadow = true
    
    // gltf.scene.traverse(function (node) {
    //     if(node.isMesh){
    //         node.castShadow = true
    //     }
    // })

    model.add(gltf.scene)
    model.scale.set(0.2,0.2,0.2)
    scene.add(model)
}
window.addEventListener('scroll' , ()=>{
    gsap.to(model.position,{
        x:1,
        y:0.2,
        z:2,
        duration:1.4
    })
    gsap.to(model.rotation,{
        x:1.7,
        duration:1.4
    })
})


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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()