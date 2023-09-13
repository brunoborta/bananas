import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function Box() {
  const [clicked, setClicked] = useState(false);
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.position.z = THREE.MathUtils.lerp(
      ref.current.position.z,
      clicked ? 1 : 0,
      0.1
    );
  });
  return (
    <mesh ref={ref} onClick={() => setClicked(!clicked)}>
      <boxGeometry />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      <Box />
    </Canvas>
  );
}
