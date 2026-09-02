"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Stars, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function EarthModel({ scale = 1.3, posY = 0 }: { scale?: number; posY?: number }) {
  const { scene } = useGLTF("/earth.glb");
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.4}>
      <group ref={modelRef} scale={scale} position={[0, posY, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

useGLTF.preload("/earth.glb");

function FallbackLoader() {
  return (
    <mesh>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="#8b3fe0" wireframe />
    </mesh>
  );
}

export default function HeroScene() {
  // Configured dimensions: Width: 450px, Height: 330px, Scale: 1.3, PosY: 0
  return (
    <div className="relative flex items-center justify-center w-full">
      <div
        className="relative rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center transition-all duration-300"
        style={{
          width: "450px",
          height: "330px",
          maxWidth: "100%",
        }}
      >
        <Canvas
          camera={{ position: [0, 0.4, 4.8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ width: "100%", height: "100%", background: "transparent" }}
        >
          <ambientLight intensity={1.3} />
          <directionalLight position={[6, 8, 5]} intensity={2.6} color="#ffffff" />
          <directionalLight position={[-6, -4, -3]} intensity={1.2} color="#8b3fe0" />
          <pointLight position={[0, 5, 2]} intensity={1.5} color="#ffd6f5" />

          <Suspense fallback={<FallbackLoader />}>
            <EarthModel scale={1.3} posY={0} />
          </Suspense>

          <ContactShadows
            position={[0, -1.6, 0]}
            opacity={0.35}
            scale={7.5}
            blur={2.4}
            far={3.8}
            color="#1a0f33"
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            rotateSpeed={0.6}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={(2 * Math.PI) / 3}
          />

          <Stars radius={60} depth={30} count={500} factor={2} saturation={0.5} fade speed={0.8} />
        </Canvas>
      </div>
    </div>
  );
}
