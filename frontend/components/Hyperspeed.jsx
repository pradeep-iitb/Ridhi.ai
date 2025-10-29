'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hyperspeed = ({ effectOptions = {} }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Default options
    const options = {
      distortion: 'turbulentDistortion',
      length: 400,
      roadWidth: 10,
      islandWidth: 2,
      lanesPerRoad: 4,
      fov: 90,
      fovSpeedUp: 150,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 20,
      lightPairsPerRoadWay: 40,
      shoulderLinesWidthPercentage: 0.05,
      brokenLinesWidthPercentage: 0.1,
      brokenLinesLengthPercentage: 0.5,
      lightStickWidth: [0.12, 0.5],
      lightStickHeight: [1.3, 1.7],
      movingAwaySpeed: [60, 80],
      movingCloserSpeed: [-120, -160],
      carLightsLength: [400 * 0.03, 400 * 0.2],
      carLightsRadius: [0.05, 0.14],
      carWidthPercentage: [0.3, 0.5],
      carShiftX: [-0.8, 0.8],
      carFloorSeparation: [0, 5],
      colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0xFFFFFF,
        brokenLines: 0xFFFFFF,
        leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
        rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
        sticks: 0x03B3C3,
      },
      ...effectOptions,
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(options.colors.background);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      options.fov,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Road geometry
    const roadGeometry = new THREE.PlaneGeometry(options.roadWidth, options.length);
    const roadMaterial = new THREE.MeshBasicMaterial({ color: options.colors.roadColor });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0;
    scene.add(road);

    // Island (center divider)
    const islandGeometry = new THREE.PlaneGeometry(options.islandWidth, options.length);
    const islandMaterial = new THREE.MeshBasicMaterial({ color: options.colors.islandColor });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.rotation.x = -Math.PI / 2;
    island.position.y = 0.01;
    scene.add(island);

    // Create car lights
    const carLights = [];
    for (let i = 0; i < 20; i++) {
      const lightColor = i % 2 === 0 ? options.colors.leftCars[0] : options.colors.rightCars[0];
      const light = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.1, options.carLightsLength[0]),
        new THREE.MeshBasicMaterial({ color: lightColor })
      );
      
      light.position.x = (i % 2 === 0 ? -1 : 1) * (options.roadWidth / 4);
      light.position.y = 0.2;
      light.position.z = -i * 20;
      
      scene.add(light);
      carLights.push({ mesh: light, speed: options.movingAwaySpeed[0] });
    }

    // Light sticks
    const sticks = [];
    for (let i = 0; i < options.totalSideLightSticks; i++) {
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, options.lightStickHeight[0]),
        new THREE.MeshBasicMaterial({ color: options.colors.sticks })
      );
      
      stick.position.x = (i % 2 === 0 ? -1 : 1) * (options.roadWidth / 2 + 1);
      stick.position.y = options.lightStickHeight[0] / 2;
      stick.position.z = -i * 20;
      
      scene.add(stick);
      sticks.push(stick);
    }

    // Animation
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Move car lights
      carLights.forEach((light) => {
        light.mesh.position.z += light.speed * 0.016;
        
        if (light.mesh.position.z > 20) {
          light.mesh.position.z = -options.length;
        }
      });

      // Move light sticks
      sticks.forEach((stick) => {
        stick.position.z += options.movingAwaySpeed[0] * 0.016;
        
        if (stick.position.z > 20) {
          stick.position.z = -options.length;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current?.dispose();
    };
  }, [effectOptions]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Hyperspeed;
