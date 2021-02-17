// import Axios from 'axios'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Reflector } from 'three/examples/jsm/objects/Reflector'
import * as THREE from 'three'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  initTree (context) {
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('renderer').appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('white')

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1 /* near */, 1000 /* far */)
    camera.position.set(0, 10, 20)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()

    const skyColor = 0xB1E1FF
    const groundColor = 0xB97A20
    const intensity = 1
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
    scene.add(light)

    // Directional light
    const color = 0xFFFFFF
    const dIntensity = 1
    const dLight = new THREE.DirectionalLight(color, dIntensity)
    dLight.position.set(5, 10, 2)
    scene.add(dLight)
    scene.add(dLight.target)

    // Mirror plane
    let geometry = new THREE.PlaneGeometry(3000, 3000)
    const groundMirror = new Reflector(geometry, {
      clipBias: 0.2,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x51c7ff
    })
    groundMirror.position.y = 0
    groundMirror.rotateX(-Math.PI / 2)
    scene.add(groundMirror)

    // Model
    const loader = new GLTFLoader()

    loader.load(GeoHelperAPI.split('/api')[0] + '/uploads/' + context.fileName.split('.')[0] + '/scene.gltf', (gltf) => {
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const size = box.getSize(new THREE.Vector3())
      gltf.scene.position.y = size.y / 1.5
      controls.target.set(0, size.y / 1.5, 0)
      scene.add(gltf.scene)
    })

    const animate = function () {
      requestAnimationFrame(animate)

      renderer.render(scene, camera)
    }

    animate()
  }
}
