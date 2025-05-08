"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three-stdlib";

interface GalleryElegantProps {
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

const GalleryElegant: React.FC<GalleryElegantProps> = ({
  isAnimating,
  onAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationCompleted, setAnimationCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // 장면 생성
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f2f0e6"); // 따뜻한 베이지 색상의 배경

    // 약간의 안개 추가 (멀리 있는 객체를 흐리게 만듦)
    scene.fog = new THREE.Fog("#f2f0e6", 30, 70);

    // 카메라 설정
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 초기 위치를 더 낮고 가까이 설정 - 더 나은 시야각을 위해
    camera.position.set(0, 1.7, 20);
    camera.lookAt(0, 1.7, 0);

    // 렌더러 설정
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // OrbitControls 설정 (사용자 컨트롤용)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 부드러운 움직임
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 1.5; // 바닥 아래로 카메라가 내려가지 않도록 제한
    controls.enabled = false; // 애니메이션 중에는 컨트롤 비활성화

    // 조명 설정
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 메인 조명 (태양광 같은 느낌)
    const mainLight = new THREE.DirectionalLight(0xfdf9d8, 1.2);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -20;
    mainLight.shadow.camera.right = 20;
    mainLight.shadow.camera.top = 20;
    mainLight.shadow.camera.bottom = -20;
    scene.add(mainLight);

    // 부드러운 반대편 조명 (푸른 색조)
    const fillLight = new THREE.DirectionalLight(0xd8e8fd, 0.6);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // ----- 갤러리 구성 -----

    // 바닥 생성 (대리석 효과)
    const floorGeometry = new THREE.PlaneGeometry(30, 50);

    // 대리석 바닥과 같은 재질
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "#f0efe9",
      roughness: 0.2,
      metalness: 0.1,
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // 천장 생성
    const ceilingGeometry = new THREE.PlaneGeometry(30, 50);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.9,
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = 7;
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);

    // 벽 생성
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "#f9f7f0",
      roughness: 0.7,
    });

    // 왼쪽 벽
    const leftWallGeometry = new THREE.PlaneGeometry(50, 7);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-15, 3.5, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // 오른쪽 벽
    const rightWallGeometry = new THREE.PlaneGeometry(50, 7);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(15, 3.5, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // 끝 벽 (뒷벽)
    const endWallGeometry = new THREE.PlaneGeometry(30, 7);
    const endWall = new THREE.Mesh(endWallGeometry, wallMaterial);
    endWall.position.set(0, 3.5, -25);
    endWall.receiveShadow = true;
    scene.add(endWall);

    // 정문 입구 (앞벽)
    const frontWallGeometry = new THREE.PlaneGeometry(30, 7);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(0, 3.5, 25);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // 기둥 생성
    const createPillar = (x: number, z: number) => {
      const pillarGeometry = new THREE.CylinderGeometry(0.6, 0.6, 7, 16);
      const pillarMaterial = new THREE.MeshStandardMaterial({
        color: "#f0ebe0",
        roughness: 0.3,
        metalness: 0.1,
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.set(x, 3.5, z);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      scene.add(pillar);

      // 기둥 장식 (상단)
      const capGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.3, 16);
      const capMaterial = new THREE.MeshStandardMaterial({
        color: "#e8e2d5",
        roughness: 0.3,
        metalness: 0.1,
      });
      const cap = new THREE.Mesh(capGeometry, capMaterial);
      cap.position.set(x, 6.85, z);
      cap.castShadow = true;
      scene.add(cap);

      // 기둥 장식 (하단)
      const baseGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 16);
      const baseMaterial = new THREE.MeshStandardMaterial({
        color: "#e8e2d5",
        roughness: 0.3,
        metalness: 0.1,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.set(x, 0.15, z);
      base.castShadow = true;
      scene.add(base);
    };

    // 양쪽 벽을 따라 기둥 배치
    for (let z = -20; z <= 20; z += 10) {
      createPillar(-14, z);
      createPillar(14, z);
    }

    // 중앙 조형물 받침대
    const pedestalGeometry = new THREE.CylinderGeometry(1, 1.2, 2, 64);
    const pedestalMaterial = new THREE.MeshStandardMaterial({
      color: "#e6c8a0",
      roughness: 0.3,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.set(0, 1, 0);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // ----- 새로운 중앙 조형물 코드 시작 -----

    // 조형물을 담을 그룹 생성
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(0, 3, 0); // 위치 설정

    // 1. 내부 유리 구조 추가
    const glassGeometry = new THREE.IcosahedronGeometry(0.8, 10);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 0.9, // 투명도
      roughness: 0.05,
      ior: 1.5, // 굴절률
      thickness: 0.5,
    });

    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.y = 0.2;
    glass.castShadow = true;
    glass.receiveShadow = true;
    sculptureGroup.add(glass);

    // 2. 부유하는 입자들 추가
    const particlesGroup = new THREE.Group();
    const particleGeometry = new THREE.SphereGeometry(0.08, 16, 16);

    const particleColors = [
      "#ff7e5f", // 코랄
      "#feb47b", // 피치
      "#ffcdb2", // 살구색
      "#ede7e3", // 크림
    ];

    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.3;
      const height = -0.5 + Math.random() * 1;

      const particleMaterial = new THREE.MeshStandardMaterial({
        color: particleColors[i % particleColors.length],
        roughness: 0.2,
        metalness: 0.8,
        emissive: particleColors[i % particleColors.length],
        emissiveIntensity: 0.2,
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      // 각 입자에 개별적인 애니메이션을 위한 정보 저장
      particle.userData = {
        initialPosition: particle.position.clone(),
        speed: 0.001 + Math.random() * 0.002,
        amplitude: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      };

      particle.castShadow = true;
      particlesGroup.add(particle);
    }

    // 입자 그룹을 유리 안에 배치
    particlesGroup.position.y = 0.2;
    sculptureGroup.add(particlesGroup);

    // 유리 주변을 감싸는 반투명 링 추가
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 100);
    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 0.8,
      roughness: 0.1,
      metalness: 0.3,
      ior: 1.3,
      thickness: 0.4,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    sculptureGroup.add(ring);

    // 3. 상단 장식 링
    const topDecorGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 100);
    const topDecorMaterial = new THREE.MeshStandardMaterial({
      color: "#e6c8a0", // 황금빛 구리색 (나선과 동일)
      roughness: 0.1,
      metalness: 0.9,
    });

    const topDecor = new THREE.Mesh(topDecorGeometry, topDecorMaterial);
    topDecor.position.y = 1.5;
    topDecor.rotation.x = Math.PI / 2;
    topDecor.castShadow = true;
    sculptureGroup.add(topDecor);

    // 4. 내부 조명 효과
    const light1 = new THREE.PointLight("#ff7e5f", 1, 5);
    light1.position.set(0, 0.2, 0);
    sculptureGroup.add(light1);

    const light2 = new THREE.PointLight("#6797e9", 0.8, 5);
    light2.position.set(0, 1.5, 0);
    sculptureGroup.add(light2);

    // 전체 조형물 추가
    scene.add(sculptureGroup);

    // ----- 새로운 중앙 조형물 코드 끝 -----

    // 세련된 그림 추가 - 고급스러운 색상
    const paintingColors = [
      "#3d405b", // 딥 네이비
      "#81b29a", // 세이지 그린
      "#f2cc8f", // 파스텔 오렌지
      "#e07a5f", // 테라코타
      "#d4a373", // 카멜
      "#264653", // 딥 틸
      "#2a9d8f", // 터쿼이즈
      "#457b9d", // 스틸 블루
    ];

    // 그림 프레임 생성 함수
    const createPainting = (
      wallSide: "left" | "right" | "end",
      position: number,
      colorIndex: number
    ) => {
      const frameWidth = 3;
      const frameHeight = 4;
      const frameDepth = 0.1;

      // 벽에 따른 위치 및 회전 계산
      let x = 0,
        z = 0,
        rotationY = 0;

      if (wallSide === "left") {
        x = -14.9;
        z = position;
        rotationY = -Math.PI / 2;
      } else if (wallSide === "right") {
        x = 14.9;
        z = position;
        rotationY = Math.PI / 2;
      } else if (wallSide === "end") {
        x = position;
        z = -24.9;
        rotationY = 0;
      }

      // 그림 생성
      const paintingGeometry = new THREE.PlaneGeometry(
        frameWidth - 0.4,
        frameHeight - 0.4
      );
      const paintingMaterial = new THREE.MeshStandardMaterial({
        color: paintingColors[colorIndex % paintingColors.length],
        roughness: 0.5,
        metalness: 0.1,
      });
      const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
      painting.position.set(x, 4, z);
      painting.rotation.y = rotationY;

      // 벽에 따라 위치 미세 조정
      if (wallSide === "left") {
        painting.position.x += 0.06;
      } else if (wallSide === "right") {
        painting.position.x -= 0.06;
      } else if (wallSide === "end") {
        painting.position.z += 0.06;
      }

      scene.add(painting);

      // 그림 프레임 생성
      const frameGeometry = new THREE.BoxGeometry(
        frameWidth,
        frameHeight,
        frameDepth
      );
      const frameMaterial = new THREE.MeshStandardMaterial({
        color: "#d8c3a5", // 골드에 가까운 크림색
        roughness: 0.2,
        metalness: 0.6,
      });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set(x, 4, z);
      frame.rotation.y = rotationY;

      // 벽에 따라 위치 미세 조정
      if (wallSide === "left") {
        frame.position.x += 0.05;
      } else if (wallSide === "right") {
        frame.position.x -= 0.05;
      } else if (wallSide === "end") {
        frame.position.z += 0.05;
      }

      frame.castShadow = true;
      scene.add(frame);

      // 그림 조명
      const spotLight = new THREE.SpotLight(
        0xffffff,
        3,
        10,
        Math.PI / 6,
        0.5,
        2
      );
      // 벽에 따른 조명 위치 조정
      if (wallSide === "left") {
        spotLight.position.set(x + 1.5, 6, z);
        spotLight.target.position.set(x, 4, z);
      } else if (wallSide === "right") {
        spotLight.position.set(x - 1.5, 6, z);
        spotLight.target.position.set(x, 4, z);
      } else if (wallSide === "end") {
        spotLight.position.set(x, 6, z + 1.5);
        spotLight.target.position.set(x, 4, z);
      }

      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 512;
      spotLight.shadow.mapSize.height = 512;
      scene.add(spotLight);
      scene.add(spotLight.target);
    };

    // 왼쪽 벽에 그림 배치
    createPainting("left", -18, 0);
    createPainting("left", -9, 1);
    createPainting("left", 0, 2);
    createPainting("left", 9, 3);
    createPainting("left", 18, 4);

    // 오른쪽 벽에 그림 배치
    createPainting("right", -18, 5);
    createPainting("right", -9, 6);
    createPainting("right", 0, 7);
    createPainting("right", 9, 0);
    createPainting("right", 18, 1);

    // 끝 벽에 그림 배치
    createPainting("end", -10, 2);
    createPainting("end", 0, 3);
    createPainting("end", 10, 4);

    // ----- 애니메이션 및 렌더링 -----

    // 애니메이션 루프
    let animationId: number | null = null;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // 전체 조형물 회전
      sculptureGroup.rotation.y += 0.002;

      // 개별 입자 애니메이션
      particlesGroup.children.forEach((particle) => {
        const data = particle.userData;
        const time = performance.now() * data.speed;

        // 각 입자가 자체 궤도를 따라 움직이도록
        particle.position.x =
          data.initialPosition.x + Math.sin(time + data.phase) * data.amplitude;
        particle.position.y =
          data.initialPosition.y + Math.cos(time * 0.7) * data.amplitude * 0.5;
        particle.position.z =
          data.initialPosition.z + Math.sin(time * 0.5) * data.amplitude;
      });

      // 조명 색상 변화 (부드럽게)
      const time = performance.now() * 0.001;
      light1.color.setHSL((Math.sin(time * 0.2) + 1) * 0.5, 0.7, 0.5);
      light2.color.setHSL((Math.sin(time * 0.1 + 2) + 1) * 0.5, 0.7, 0.5);

      // 상단 장식 링도 회전
      topDecor.rotation.z += 0.003;

      // 유리 구조에 약간의 스케일 애니메이션 추가
      const pulseScale = 1 + Math.sin(time * 0.8) * 0.02;
      glass.scale.set(pulseScale, pulseScale, pulseScale);

      // OrbitControls 업데이트 (damping 효과를 위해 필요)
      if (animationCompleted) {
        controls.update();
      }

      renderer.render(scene, camera);
    };
    animate();

    // 화면 크기 변경 처리
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    if (isAnimating) {
      // 1단계: 정면에서 부드럽게 전진
      gsap.to(camera.position, {
        z: 8,
        y: 2.2,
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(0, 4.5, 0),
        onComplete: () => {
          // 2단계: 좌측으로 회전하며 약간 대각선 시점으로
          gsap.to(camera.position, {
            x: 8,
            z: 6,
            duration: 2.5,
            ease: "power1.inout",
            onUpdate: () => camera.lookAt(0, 4.5, 0),
            onComplete: () => {
              setAnimationCompleted(true);
              controls.enabled = true;
              onAnimationComplete();
            },
          });
        },
      });
    }
  }, [isAnimating, onAnimationComplete, animationCompleted]);

  return <div ref={containerRef} className="fixed inset-0" />;
};

export default GalleryElegant;
