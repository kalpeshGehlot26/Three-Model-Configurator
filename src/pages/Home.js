import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import glb from "../assets/glb/model.glb";
import texture1 from "../assets/images/texture1.jpg";
import texture2 from "../assets/images/texture2.jpeg";

const colors = [
  {
    color: "66533C",
  },
  {
    color: "173A2F",
  },
  {
    color: "153944",
  },
  {
    color: "27548D",
  },
  {
    color: "438AAC",
  },
  {
    texture: texture1,
    size: [2, 2, 2],
    shininess: 60,
  },
  {
    texture: texture2,
    size: [4, 4, 4],
    shininess: 0,
  },
];

const swatchData = [
  {
    img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/legs.svg",
    dataOption: "legs",
  },
  {
    img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/cushions.svg",
    dataOption: "cushions",
  },
  {
    img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/base.svg",
    dataOption: "base",
  },
  {
    img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/supports.svg",
    dataOption: "supports",
  },
  {
    img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/back.svg",
    dataOption: "back",
  },
];

const Home = () => {
  const [activeOption, setActiveOption] = useState("cushions");
  const [theModel, setTheModel] = useState({});

  const containerRef = useRef(null);
  const renderOnce = useRef(true);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;
  camera.position.x = 0;

  scene.background = new THREE.Color(0xd8d8d8);
  scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 3;
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.1;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.2;
  controls.minDistance = 4;
  controls.maxDistance = 12;

  const INITIAL_MTL = new THREE.MeshPhongMaterial({
    color: 0xf1f1f1,
    shininess: 10,
  });

  const INITIAL_MAP = [
    { childID: "back", mtl: INITIAL_MTL },
    { childID: "base", mtl: INITIAL_MTL },
    { childID: "cushions", mtl: INITIAL_MTL },
    { childID: "legs", mtl: INITIAL_MTL },
    { childID: "supports", mtl: INITIAL_MTL },
  ];

  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  scene.add(dirLight);

  const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
  scene.add(ambientLight);

  const loader = new GLTFLoader();

  const initColor = (parent, type, mtl) => {
    parent.traverse((o) => {
      if (o.isMesh) {
        if (o.name.includes(type)) {
          o.material = mtl;
          o.nameID = type;
        }
      }
    });
  };

  const resizeRendererToDisplaySize = useCallback((renderer) => {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }, []);

  const animate = useCallback(() => {
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  }, [camera, controls, resizeRendererToDisplaySize, scene, renderer]);

  const selectOption = (dataOption) => {
    setActiveOption(dataOption);
  };

  const selectSwatch = (_color, type) => {
    let color = colors.find((ele) => ele[type] === _color);
    let new_mtl;

    if (type !== "color") {
      let txt = new THREE.TextureLoader().load(color.texture);
      txt.repeat.set(color.size[0], color.size[1], color.size[2]);
      txt.wrapS = THREE.RepeatWrapping;
      txt.wrapT = THREE.RepeatWrapping;
      new_mtl = new THREE.MeshPhongMaterial({
        map: txt,
        shininess: color.shininess ? color.shininess : 10,
      });
    } else {
      new_mtl = new THREE.MeshPhongMaterial({
        color: parseInt("0x" + color.color),
        shininess: color.shininess ? color.shininess : 10,
      });
    }

    theModel.traverse((o) => {
      if (o.isMesh && o.nameID != null) {
        if (o.nameID == activeOption) {
          o.material = new_mtl;
        }
      }
    });
  };

  useEffect(() => {
    console.log("first")
    if (renderOnce.current) {
      loader.load(
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb",
        // glb,
        (gltf) => {
          var _theModel = gltf.scene;
          _theModel.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
          _theModel.scale.set(2, 2, 2);
          _theModel.rotation.y = Math.PI;

          _theModel.position.y = -1;

          for (let object of INITIAL_MAP) {
            initColor(_theModel, object.childID, object.mtl);
          }
          setTheModel(_theModel);
          scene.add(gltf.scene);
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
      renderOnce.current = false;
      containerRef.current.appendChild(renderer.domElement);
      animate();
    }
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef}></div>
      <div style={{ display: "flex", position: "absolute", bottom: "0" }}>
        {colors?.map(({ color, texture }, index) => {
          if (color) {
            return (
              <div
                key={index}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: `#${color}`,

                  display: "flex",
                }}
                onClick={() => selectSwatch(color, "color")}
              ></div>
            );
          } else {
            return (
              <div
                key={index}
                style={{
                  width: "50px",
                  height: "50px",

                  display: "flex",
                }}
                onClick={() => selectSwatch(texture, "texture")}
              >
                <img src={texture} />
              </div>
            );
          }
        })}
      </div>
      <div
        className="options"
        style={{ position: "absolute", left: "0", top: "0px" }}
      >
        {swatchData?.map((swatch, index) => {
          return (
            <div
              key={index}
              className="option"
              onClick={() => selectOption(swatch?.dataOption)}
            >
              <img src={swatch?.img} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
