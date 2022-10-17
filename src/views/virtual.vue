<template>
    <el-card style="width:90%;height:90%;margin: 20px auto;">
        <div id="render-container">

        </div>
        <!-- <el-button></el-button> -->
    </el-card>
</template>

<script>
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Lut } from 'three/examples/jsm/math/Lut.js';
import axios from 'axios';


let moduledata;
let container, canvas;
let perpCamera, orthoCamera, renderer, lut;
let mesh, sprite;
let scene, uiScene;
let params = {
    wireframe: false,
};

let cwidth, cheight;
const colormap = [[0.0, 0x0000FF], [0.25, 0x00FFFF], [0.5, 0x00FF00], [0.75, 0xFFFF00], [1.0, 0xFF0000]];

export default {
    data() {
        return {

        }
    },
    methods: {
        init() {
            container = document.getElementById('render-container');
            // 场景
            // cwidth = container.clientWidth;
            // cheight = container.clientHeight;
            cwidth = 980;
            cheight = 500;
            // console.log(cwidth, cheight);
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            uiScene = new THREE.Scene();
            lut = new Lut();
            lut.addColorMap('colormap', colormap);
            // 相机
            // perpCamera = new THREE.PerspectiveCamera(60, 400 / 400, 1, 1000);
            perpCamera = new THREE.PerspectiveCamera(60, cwidth / cheight, 1, 1000);
            perpCamera.position.set(0, -1, 4);
            const ambientlight = new THREE.AmbientLight(0xffffff, 1);
            perpCamera.add(ambientlight);
            scene.add(perpCamera);
            orthoCamera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 1, 2);
            orthoCamera.position.set(0.7, 0, 1);
            // 渲染器
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.autoClear = false;
            renderer.setPixelRatio(window.devicePixelRatio);
            // renderer.setSize(400, 400);
            renderer.setSize(cwidth, cheight);
            canvas = renderer.domElement;
            container.appendChild(canvas);
            // 模型
            sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                map: new THREE.CanvasTexture(lut.createCanvas())
            }));
            sprite.scale.x = 0.075;
            uiScene.add(sprite);
            mesh = new THREE.Mesh(undefined, new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                vertexColors: true,
                wireframe: params.wireframe
            }));
            // 模型放入场景渲染
            scene.add(mesh);

            let render = () => {
                renderer.clear();
                renderer.render(scene, perpCamera);
                renderer.render(uiScene, orthoCamera);
            }

            let setColors = () => {
                lut.setColorMap('colormap');
                const geometry = mesh.geometry;
                const pressures = geometry.attributes.pressure;
                const colors = geometry.attributes.color;
                lut.setMax(Math.max.apply(null, pressures.array));
                lut.setMin(Math.min.apply(null, pressures.array));
                for (let i = 0; i < pressures.array.length; i++) {
                    const colorValue = pressures.array[i];
                    const color = lut.getColor(colorValue);
                    if (color === undefined) {
                        console.log('Unable to determine color for value:', colorValue);
                    } else {
                        colors.setXYZ(i, color.r, color.g, color.b);
                    }
                }
            };

            let loadModel = () => {
                const load = new THREE.BufferGeometryLoader();
                const geometry = load.parse(moduledata);
                geometry.center();
                geometry.computeVertexNormals();
                const colors = [];
                for (let i = 0, n = geometry.attributes.position.count; i < n; ++i) {
                    colors.push(1, 1, 1);
                }
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                mesh.geometry = geometry;
                setColors();
                render();
            };

            loadModel();

            const controls = new OrbitControls(perpCamera, renderer.domElement);
            controls.addEventListener('change', render);
            const gui = new GUI();
            gui.add(params, 'wireframe').onChange((e) => {
                mesh.material.wireframe = e;
                render();
            });
        },
        start() {
            let outerthis = this;
            axios({
                method: 'get',
                url: 'http://localhost:8081/num',
            }).then((response) => {
                moduledata = response.data;
                outerthis.$message({
                    message: '数据加载成功',
                    type: 'success'
                });
                outerthis.init();
            }).catch(() => {
                outerthis.$message({
                    message: '数据加载失败',
                    type: 'error'
                });
            })
        }
    },
    mounted() {
        this.start();
    }
}
</script>

<style>
#render-container {
    margin: 20px auto;
    width: 80%;
    height: 500px;
}
</style>