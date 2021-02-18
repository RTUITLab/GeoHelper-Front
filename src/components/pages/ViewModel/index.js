// import Axios from 'axios'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

const GeoHelperAPI = process.env.VUE_APP_API

export default {
  initTree (context) {
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.getElementById('renderer').appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf4f4f4)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1 /* near */, 1000 /* far */)
    camera.position.set(0, 10, 20)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()

    const skyColor = 0xFFFFFF
    const groundColor = 0xFFFFFF
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
