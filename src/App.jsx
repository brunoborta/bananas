import * as THREE from "three";
import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";

function Banana({ z }) {
  const ref = useRef();
  const { viewport, camera } = useThree();
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const { nodes, materials } = useGLTF("/banana-transformed.glb");

  const [data] = useState({
    // randFloatSpread divide the number by 2 and get a positive and
    //a negative portion. If 2 is provided, -1 to 1. If 6, -3 to 3
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  });
  useFrame((state, delta) => {
    // lerp does an interpolation between 2 values. In this case,
    //it is being used to create an animation: On position z,
    //it goes to 0 or 1 with a 0.1 "step"
    // ref.current.position.z = THREE.MathUtils.lerp(
    //   ref.current.position.z,
    //   clicked ? 1 : 0,
    //   0.1
    // );

    // The calculation data.x * width is done to be
    //responsive
    ref.current.position.set(data.x * width, (data.y += 0.01), z);
    ref.current.rotation.set(
      (data.rX += 0.001),
      (data.rY += 0.001),
      (data.rZ += 0.001)
    );
    if (data.y > height) {
      data.y = -height;
    }
  });
  return (
    <mesh
      ref={ref}
      geometry={nodes.Object_35.geometry}
      material={materials.Banana_High}
      material-emissive="orange"
    />
  );
}

export default function App({ count = 100, depth = 80 }) {
  return (
    <Canvas gl={{ alpha: false }} camera={{ fov: 30, near: 0.01, far: 102 }}>
      <color attach="background" args={["#ffbf40"]} />
      <spotLight position={[10, 10, 10]} intensity={1} />
      <Suspense fallback={null}>
        <Environment preset="sunset" />
        {Array.from({ length: count }, (_, i) => (
          <Banana key={i} z={-(i / count) * depth - 20} />
        ))}
        <EffectComposer>
          <DepthOfField
            target={[0, 0, depth * 0.5]}
            focalLength={0.5}
            bokehScale={11}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
