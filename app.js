// Get the canvas element

// TODO: Fix scalling
// TODO: Modular code 



const canvas = document.getElementById('renderCanvas');

let engine = null;
let scene = null;
let sceneToRender = null;
const createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};

// TODO: Items that need to be rendered start in this function
const createScene = async function () {
  // This creates a basic Babylon Scene object (non-mesh)
  const scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 1, -5), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Added directional light
  var dirLight = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0, 0, 1), scene);
  dirLight.position = new BABYLON.Vector3(0, 5, -5);

  const xr = await scene.createDefaultXRExperienceAsync({
    uiOptions: {
      sessionMode: 'immersive-ar',
      referenceSpaceType: "local-floor",
            onError: (error) => {
                alert(error);
            }
    },
    optionalFeatures: true,
  });

  const fm = xr.baseExperience.featuresManager;

  const xrTest = fm.enableFeature(BABYLON.WebXRHitTest, 'latest');

  // Create donut - original hit test

  // const marker = BABYLON.MeshBuilder.CreateTorus('marker', {
  //   diameter: 0.15,
  //   thickness: 0.05
  // });
  // marker.isVisible = false;
  // marker.rotationQuaternion = new BABYLON.Quaternion();

  // Create Kiosk model
  const kioskScale = 0.3;

  // TODO: Clean scaling 

  //GUI

  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var rect1 = new BABYLON.GUI.Rectangle();
  rect1.width = 0.5;
  rect1.top = 200;
  rect1.height = "100px";
  rect1.color = "white";
  rect1.thickness = 1;
  rect1.alpha = 0.40
  rect1.background = "green";
  advancedTexture.addControl(rect1);

  var infoText = new BABYLON.GUI.TextBlock();
  infoText.text = "Welcome to Service Canada AR \n\n Scan the floor to place your kiosk";
  infoText.color = "white";
  infoText.fontSize = 24;
  rect1.addControl(infoText);

// GHOST KIOSK
// FIXME: Placing the ghost Kiosk instead of the actual Kiosk 
 const baseKiosk = await BABYLON.SceneLoader.ImportMeshAsync(null, "assets/models/", "SC_Kiosk.gltf").then((result) => {
    const kiosk = result.meshes[0];
    kiosk.scaling.x = kioskScale;
    kiosk.scaling.y = kioskScale;
    kiosk.scaling.z = -kioskScale;
    kiosk.id = "myKiosk";
    kiosk.setEnabled(true);
    kiosk.rotationQuaternion = new BABYLON.Quaternion();
    kiosk.rotation;
    return kiosk;
  });

  console.log(baseKiosk);

  const kioskCopy = baseKiosk.clone('ghost');
  console.log(kioskCopy);
  for (var child of kioskCopy.getChildMeshes()){
      child.material = new BABYLON.StandardMaterial("mat");
      child.material.alpha = 0.25;
  }

  kioskCopy.rotationQuaternion = new BABYLON.Quaternion();

  kioskCopy.isVisible = true;
  
  // Place objects in AR if plane detected/generated
  
  var hitTestCheck = xrTest.onHitTestResultObservable.add((results) => {
    if (results.length) {
      // make donut visible in AR hit test and decompose the location matrix
      // marker.isVisible = true;
      kioskCopy.isVisible = true;
      hitTest = results[0];
      // hitTest.transformationMatrix.decompose(marker.scaling, marker.rotationQuaternion, marker.position);
      hitTest.transformationMatrix.decompose(undefined, kioskCopy.rotationQuaternion, kioskCopy.position);
    } else {
      // marker.isVisible = false;
      kioskCopy.isVisible = false;
      //model.setEnabled(false);
    }
  });

  // Touch screen pointer event to place kiosk in AR at donut location
  scene.onPointerDown = (evt, pickInfo) => {
    if (hitTest && xr.baseExperience.state === BABYLON.WebXRState.IN_XR) {
      // make kiosk visible in AR hit test and decompose the location matrix
      const kiosk = scene.getMeshByID("myKiosk");
      kiosk.setEnabled(true);

      //kiosk.position.y = hitTest.position.y + 0.5;
      hitTest.transformationMatrix.decompose(undefined, kiosk.rotationQuaternion, kiosk.position); 
      xrTest.onHitTestResultObservable.remove(hitTestCheck);
      // marker.isVisible = false; 
      rect1.isVisible = false;   
    } 
  }
  
  return scene;
};

initFunction = async function () {
  const asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log('the available createEngine function failed. Creating the default engine instead');
      return createDefaultEngine();
    }
  };

  engine = await asyncEngineCreation();
  if (!engine) {
    throw new Error('engine should not be null.');
  }
  scene = createScene();
};
initFunction().then(() => {
  scene.then((returnedScene) => {
    sceneToRender = returnedScene;
  });

  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener('resize', function () {
  engine.resize();
}); 