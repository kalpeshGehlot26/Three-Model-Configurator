import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Home from "./pages/Home";
// import { usePlane } from "use-cannon";

function Plane() {
  const [ref] = usePlane(() => ({
    type: "Static",
    mass: 1,
    args: [10, 10],
    position: [0, 0, 0],
  }));

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} ref={ref}>
      <planeBufferGeometry args={[10, 10]} />
      <meshStandardMaterial color="#cfcfcf" />
    </mesh>
  );
}

function Box(props) {
  const boxRef = useRef();

  const [ref, api] = useBox(() => ({
    type: "Static",
    mass: 1,
    position: props.position,
    onCollide: () => console.log("collided"),
    ...props,
  }));

  const bind = useDrag(({ offset: [x, y] }) => {
    api.position.set(x / 100, -y / 100, 0);
  });

  return (
    <mesh
      ref={(mesh) => {
        ref.current = mesh;
        boxRef.current = mesh;
      }}
      castShadow
      receiveShadow
      {...bind()}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f00" />
    </mesh>
  );
}

function Box2(props) {
  const boxRef = useRef();

  const [ref, api] = useBox(() => ({
    type: "Static",
    mass: 1,
    position: props.position,
    onCollide: () => console.log("collided"),
    ...props,
  }));

  const bind = useDrag(({ offset: [x, y] }) => {
    api.position.set(x / 100, -y / 100, 0);
  });

  return (
    <mesh
      ref={(mesh) => {
        ref.current = mesh;
        boxRef.current = mesh;
      }}
      castShadow
      receiveShadow
      {...bind()}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f00" />
    </mesh>
  );
}

function App() {
  return (
    <div style={{ width: "100vh" }}>
      <Home />
    </div>
  );
}

export default App;
