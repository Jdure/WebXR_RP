//TODO: Items that need to be rendered start in this function
// var createScene = async function () {

//     // This creates a basic Babylon Scene object (non-mesh)
//     var scene = new BABYLON.Scene(engine);

//     // This creates and positions a free camera (non-mesh)
//     var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 1, -5), scene);

//     // This targets the camera to scene origin
//     camera.setTarget(BABYLON.Vector3.Zero());

//     // This attaches the camera to the canvas
//     camera.attachControl(canvas, true);

//     // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
//     var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

//     // Default intensity is 1. Let's dim the light a small amount
//     light.intensity = 0.7;

//     var xr = await scene.createDefaultXRExperienceAsync({
//         uiOptions: {
//             sessionMode: "immersive-ar",
//             referenceSpaceType: "local-floor"
//         },
//         optionalFeatures: true
//     });

//     const fm = xr.baseExperience.featuresManager;

//     const hitTest = fm.enableFeature(BABYLON.WebXRHitTest, "latest");

//     const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);

//     box.isVisible = false;
//     hitTest.onHitTestResultObservable.add((results) => {
//         if (results.length) {
//           box.isVisible = true;
//         } else {
//           box.isVisible = false;
//         }
//       });

//     // const marker = BABYLON.MeshBuilder.CreateTorus('marker', {
//     //     diameter: 0.15,
//     //     thickness: 0.05
//     // });
//     // marker.isVisible = false;
//     // marker.rotationQuaternion = new BABYLON.Quaternion();

//     // xrTest.onHitTestResultObservable.add((results) => {
//     //     if (results.length) {
//     //         marker.isVisible = true;
//     //         hitTest = results[0];
//     //         hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
//     //     } else {
//     //         marker.isVisible = false;
//     //     }
//     // });

//     return scene;
// };

const canvas = document.getElementById("renderCanvas"); // Get the canvas element

const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function () {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    
    var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
    sphere.position.y = 2;
    sphere.position.z = 5;
    

    const xr = scene.createDefaultXRExperienceAsync({
        uiOptions: {
            sessionMode: 'immersive-ar',
            referenceSpaceType: "local-floor"
        },
        optionalFeatures: true
    });

    return scene;
}; 


const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });


// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});