import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';

const AnimatedSphere = ({ position, color, speed }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.5;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 100, 100]} position={position}>
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </Sphere>
    );
};

const Background3D = () => {
    return (
        <div className="fixed inset-0 -z-10 opacity-30">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00d4aa" />

                {/* Animated Spheres */}
                <AnimatedSphere position={[-2, 1, 0]} color="#00d4aa" speed={0.2} />
                <AnimatedSphere position={[2, -1, -2]} color="#ff4757" speed={0.15} />
                <AnimatedSphere position={[0, 0, -3]} color="#0a0e27" speed={0.1} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};

export default Background3D;
