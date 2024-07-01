import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import CSG from "./three-csg.js"

let allArticleFunctions = [];
document.getElementById('myfile').onchange = function(e) {
    LoadAndAddNewProfiles(this);
};

let canvas, renderer;

const scenes = [];

//init();
const LoadAndAddNewProfiles = async(fileInput) => {
    allArticleFunctions = [];
    await LoadNewProfiles(fileInput);
    setTimeout(
        ()=>{
            //console.log(this);
            for ( var i in window) {
                //console.log(window[i]);
                if((typeof window[i]).toString()=="function" && window[i].name.includes("article")){
                    allArticleFunctions.push(window[i].name);
                }
            }
            //console.log(allArticleFunctions);
            init();
        }, 1000);
}

async function LoadNewProfiles(fileInput){
    return new Promise(async (resolve, reject) => {
        if(fileInput.files.length > 0){
            for(let f in fileInput.files){
                if(fileInput.files[f].type == "text/javascript"){
                    //console.log("we have a js file");
                    let article = document.createElement('script');

                    let s = await fileInput.files[f].text();
                    //console.log(s);
                    s = "import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';" + s.replaceAll("function", "export function");
                    //console.log(s);
                    article.src = URL.createObjectURL(new Blob([s], { type: "application/javascript" }));
                    
                    article.type = "module";
                    document.body.appendChild(article);
                    //console.log(article);
                    import(article.src).then((funcs) => {for(let i in funcs){allArticleFunctions.push(funcs[i]) }});
                }
            }
        }
        resolve('OK')
    });
}

function init() {

    canvas = document.getElementById( 'c' );

    const geometries = [
        new THREE.BoxGeometry( 1, 1, 1 ),
        new THREE.SphereGeometry( 0.5, 12, 8 ),
        new THREE.DodecahedronGeometry( 0.5 ),
        new THREE.CylinderGeometry( 0.5, 0.5, 1, 12 )
    ];

    const content = document.getElementById( 'content' );
    for ( let i = 0; i < allArticleFunctions.length; i ++ ) {

        const scene = new THREE.Scene();

        // make a list item
        const element = document.createElement( 'div' );
        element.className = 'list-item';

        const sceneElement = document.createElement( 'div' );
        element.appendChild( sceneElement );

        const descriptionElement = document.createElement( 'div' );
        descriptionElement.innerText = allArticleFunctions[i].name;
        element.appendChild( descriptionElement );

        // the element that represents the area we want to render the scene
        scene.userData.element = sceneElement;
        content.appendChild( element );
        //console.log(sceneElement);
        const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 1, 5000);
        //const camera = new THREE.PerspectiveCamera(50, 1, 1, 3000);
        camera.position.z = 1000;
        camera.position.y = 1950;
        camera.position.x = -750;
        scene.userData.camera = camera;

        const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
        controls.minDistance = .1;
        controls.maxDistance = 2000;
        controls.enablePan = true;
        controls.enableZoom = true;
        scene.userData.controls = controls;

        let article = allArticleFunctions[i]();
        const articleGroup = new THREE.Group();
        let shapeMesh = null;
        for (let k in article.shapes) {
            let shape = article.shapes[k];

            let geometry = new THREE.ExtrudeGeometry(shape, {
                steps: 2,
                curveSegments: 2,
                bevelEnabled: false,
                extrudePath: new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(0, 100, 0),
                ], false, "centripetal", 0.5)
            });

            const material = new THREE.MeshStandardMaterial( {

                color: new THREE.Color().setHSL( Math.random(), 1, 0.75, THREE.SRGBColorSpace ),
                roughness: 0.5,
                metalness: 0,
                side: THREE.DoubleSide,
                flatShading: true
    
            } );
            shapeMesh = new THREE.Mesh(geometry, material);
            shapeMesh = CutAngle(shapeMesh, 100, [{Miters: [{Angle:45}]},{Miters: [{Angle:0}]}]);
            articleGroup.add(shapeMesh);
            const bbox = new THREE.Box3();
            shapeMesh.geometry.computeBoundingBox();
            bbox.copy(shapeMesh.geometry.boundingBox).applyMatrix4(shapeMesh.matrixWorld);
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            center.y = 100;
            //console.log(center);
            controls.target = center;
        }


        // add one random mesh to each scene
        // const geometry = geometries[ geometries.length * Math.random() | 0 ];

        // const material = new THREE.MeshStandardMaterial( {

        //     color: new THREE.Color().setHSL( Math.random(), 1, 0.75, THREE.SRGBColorSpace ),
        //     roughness: 0.5,
        //     metalness: 0,
        //     flatShading: true

        // } );

        scene.add( articleGroup );

        scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444, 3 ) );

        const light = new THREE.DirectionalLight( 0xffffff, 1.5 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        scenes.push( scene );

    }


    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setAnimationLoop( animate );

}

function updateSize() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height !== height ) {

        renderer.setSize( width, height, false );

    }

}

function animate() {

    updateSize();

    canvas.style.transform = `translateY(${window.scrollY}px)`;

    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( false );
    renderer.clear();

    renderer.setClearColor( 0xe0e0e0 );
    renderer.setScissorTest( true );

    scenes.forEach( function ( scene ) {

        // so something moves
        //scene.children[ 0 ].rotation.y = Date.now() * 0.001;

        // get the element that is a place holder for where we want to
        // draw the scene
        const element = scene.userData.element;

        // get its position relative to the page's viewport
        const rect = element.getBoundingClientRect();

        // check if it's offscreen. If so skip it
        if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
                rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {

            return; // it's off screen

        }

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );

        const camera = scene.userData.camera;
        //console.log(camera.position);
        //camera.aspect = width / height; // not changing in this example
        //camera.updateProjectionMatrix();

        //scene.userData.controls.update();

        renderer.render( scene, camera );

    } );


    
}

function CutAngle(shapeMesh, memberLength, endPreps) {
    let _angleA = 0.0;
    let _angleB = 0.0;
    if (endPreps[0].Miters != null) {
      _angleA = endPreps[0].Miters[0].Angle;
    }
    if (endPreps[1].Miters != null) {
        _angleB = endPreps[1].Miters[0].Angle;
    }

    let memberLengthVector = new THREE.Vector3(0, memberLength, 0)
    
    shapeMesh = CutMember(shapeMesh, new THREE.Vector3(0,0,0), memberLengthVector, -_angleA, _angleB);
    
    return shapeMesh;
}

function CutMember(shapeMesh, pos1, pos2, angleA, angleB) {
    const BoxMaterial = new THREE.MeshBasicMaterial();
    const cutPlaneA = new THREE.Mesh(new THREE.BoxGeometry(1000, 500, 500), BoxMaterial);
    //const cutPlaneB = new THREE.Mesh(new THREE.BoxGeometry(1000, 500, 500), BoxMaterial);
    cutPlaneA.position.set(pos1.x, pos1.y, pos1.z);
    //cutPlaneB.position.set(pos2.x, pos2.y, pos2.z);
    let _directionA = angleA <= 0 ? -1 : 1;
    let _directionB = angleB < 0 ? -1 : 1;

    cutPlaneA.rotateX(-angleA * Math.PI / 180.0);
    //cutPlaneB.rotateX(-angleB * Math.PI / 180.0);

    cutPlaneA.position.z -= Math.cos((45.0 - angleA * _directionA) * Math.PI / 180.0) * 353.553;
    //cutPlaneB.position.z -= Math.cos((45.0 - angleB * _directionB) * Math.PI / 180.0) * 353.553;

    cutPlaneA.position.y += _directionA * Math.sin((45.0 - angleA * _directionA) * Math.PI / 180.0) * 353.553;
    //cutPlaneB.position.y += _directionB * Math.sin((45.0 - angleB * _directionB) * Math.PI / 180.0) * 353.553;

    shapeMesh.updateMatrix();
    cutPlaneA.updateMatrix();
    //cutPlaneB.updateMatrix();
    let bspA = CSG.fromMesh(cutPlaneA);
    //let bspB = CSG.fromMesh(cutPlaneB);
    let cube = shapeMesh;
    let clone = cube.clone();
    clone = CSG.fromMesh(clone);
    clone = clone.subtract(bspA);
    //clone = clone.subtract(bspB);
    clone = CSG.toMesh(clone, shapeMesh.matrix, shapeMesh.material);
    shapeMesh = clone;

    //shapeMesh.add(cutPlaneA);
    //shapeMesh.add(cutPlaneB);

    return shapeMesh;
}
