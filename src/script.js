import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import * as dat from 'dat.gui'


const so= document.querySelector('.b')
let my=document.querySelector('#s')
so.addEventListener('click',()=>{my.play()})
// Texture Loader
const loader = new THREE.TextureLoader();
const cross = loader.load('whitedots.png');

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometryx = new THREE.IcosahedronBufferGeometry(1,1);
const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 100;

const posArray = new Float32Array(particlesCnt*3);

for(let i=0; i<particlesCnt*3; i++){
    posArray[i] = (Math.random() - 0.5) * 5
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));


// Materials

const material = new THREE.PointsMaterial({
    size: 0.008
})
const materialx = new THREE.MeshStandardMaterial()
materialx.color = new THREE.Color(0x340143)
materialx.wireframe=true

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.012, 
    map: cross, 
    transparent: true,
    blending: THREE.AdditiveBlending
})

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particlesMesh)

const spherex = new THREE.Mesh(geometryx,materialx)
scene.add(spherex)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const pointLight2 = new THREE.PointLight(0xffffff, 0.1)
pointLight2.position.set(1.26,-0.41,-0.5)
pointLight2.intensity = 2.15

scene.add(pointLight2)

const pointLight4 = new THREE.PointLight(0xffffff, 0.1)
pointLight4.position.set(-1.26,+0.41,0.5)
pointLight4.intensity = 2.15

scene.add(pointLight4)

const pointLight1 = new THREE.PointLight(0xff0000, 3)
pointLight1.position.x = 2
pointLight1.position.y = 3
pointLight1.position.z = 4

scene.add(pointLight1)
const pointLight3 = new THREE.PointLight(0x808080, 2)
pointLight3.position.x = -1.34
pointLight3.position.y = -1
pointLight3.position.z = 2
pointLight3.intensity=3

scene.add(pointLight3)
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
    composer.setSize(sizes.width, sizes.height)
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
const composer = new EffectComposer(renderer);
renderer.setSize(sizes.width, sizes.height)
composer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Mouse
document.addEventListener('mousemove', animateParticles)
document.addEventListener('touchmove', animatetouchParticles)
document.addEventListener('touchstart', animatetouchParticless)
document.addEventListener('touchend', animatetouchParticlese)

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseY = event.clientY
    mouseX = event.clientX
}

function animatetouchParticles(event){
    let touch= event.touches[0]
    mouseY = touch.pageX - canvas.offsetLeft
    mouseX = touch.pageY - canvas.offsetTop
}
function animatetouchParticless(event) {
    let touchs = event.touches[0]
    mouseY = touchs.pageX - canvas.offsetLeft
    mouseX = touchs.pageY - canvas.offsetTop
}
function animatetouchParticlese(event) {
    let touche = event.touches[0]
    mouseY = touche.pageX - canvas.offsetLeft
    mouseX = touche.pageY - canvas.offsetTop
}

const renderpass = new RenderPass(scene,camera);
composer.addPass(renderpass);
const bloompass = new UnrealBloomPass(1,1,1,0);
const glitchpass = new GlitchPass()
glitchpass.rendertoScreen=true;
bloompass.renderToScreen=true;
//composer.addPass(bloompass);
composer.addPass(glitchpass)



/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    particlesMesh.rotation.x = -mouseY * (10 *  0.00008)
    particlesMesh.rotation.y = mouseX * (10 * 0.00008)
    particlesMesh.rotation.x+=0.08*elapsedTime
    particlesMesh.rotation.y+=0.08*elapsedTime

    spherex.rotation.y = .5 * elapsedTime
    spherex.rotation.y += .5 * (0.001*(mouseX -  (window.innerWidth/2)) -spherex.rotation.y)
    spherex.rotation.x += .5 * (0.001*(-mouseY + (window.innerHeight/2)) - spherex.rotation.x)
    if(sphere.position.z<1)
        {spherex.position.z += .5 * (0.001008*(-mouseY + (window.innerHeight/2)) - spherex.rotation.x)}

    // Update Orbital Controls
    // controls.update()

    // Render
    // renderer.render(scene, camera)
    composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()