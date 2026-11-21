import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroCanvas3DProps {
	readonly reducedMotion: boolean;
}

interface ModularPiece {
	mesh: THREE.Mesh;
	basePosition: THREE.Vector3;
	radialDir: THREE.Vector3;
	phaseOffset: number;
	spinSpeed: THREE.Vector3;
}

function createRoundedBoxGeometry(
	size: number,
	radius: number,
): THREE.BufferGeometry {
	const half = size * 0.5 - radius;
	const shape = new THREE.Shape();
	shape.moveTo(-half, -half - radius);
	shape.lineTo(half, -half - radius);
	shape.quadraticCurveTo(half + radius, -half - radius, half + radius, -half);
	shape.lineTo(half + radius, half);
	shape.quadraticCurveTo(half + radius, half + radius, half, half + radius);
	shape.lineTo(-half, half + radius);
	shape.quadraticCurveTo(-half - radius, half + radius, -half - radius, half);
	shape.lineTo(-half - radius, -half);
	shape.quadraticCurveTo(-half - radius, -half - radius, -half, -half - radius);

	const extrudeSettings: THREE.ExtrudeGeometryOptions = {
		depth: size - radius * 2,
		bevelEnabled: true,
		bevelSegments: 4,
		steps: 1,
		bevelSize: radius,
		bevelThickness: radius,
	};

	const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	geometry.center();
	return geometry;
}

function createStudioEnvMap(renderer: THREE.WebGLRenderer): THREE.Texture {
	const pmrem = new THREE.PMREMGenerator(renderer);
	pmrem.compileEquirectangularShader();

	const envScene = new THREE.Scene();
	envScene.background = new THREE.Color(0x0b0c0e);

	const overhead = new THREE.Mesh(
		new THREE.PlaneGeometry(14, 14),
		new THREE.MeshBasicMaterial({ color: 0xf7f6f3, side: THREE.DoubleSide }),
	);
	overhead.position.set(0, 7, 2);
	overhead.rotation.x = Math.PI * 0.5;
	envScene.add(overhead);

	const warmStrip = new THREE.Mesh(
		new THREE.PlaneGeometry(10, 4),
		new THREE.MeshBasicMaterial({ color: 0x4db7ff, side: THREE.DoubleSide }),
	);
	warmStrip.position.set(-6, -2, 4);
	warmStrip.lookAt(0, 0, 0);
	envScene.add(warmStrip);

	const sideFill = new THREE.Mesh(
		new THREE.PlaneGeometry(8, 8),
		new THREE.MeshBasicMaterial({ color: 0xe2dfd7, side: THREE.DoubleSide }),
	);
	sideFill.position.set(7, 1, 3);
	sideFill.lookAt(0, 0, 0);
	envScene.add(sideFill);

	const envTarget = pmrem.fromScene(envScene, 0.04);
	pmrem.dispose();
	return envTarget.texture;
}

export function HeroCanvas3D({ reducedMotion }: HeroCanvas3DProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let animationFrameId = 0;
		let isAnimating = false;
		let isVisible = true;
		let isPageVisible = document.visibilityState === "visible";
		let renderer: THREE.WebGLRenderer | null = null;
		let envMap: THREE.Texture | null = null;

		try {
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(
				36,
				container.clientWidth / Math.max(container.clientHeight, 1),
				0.1,
				100,
			);
			camera.position.set(0, 0.15, 7.2);

			renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true,
				powerPreference: "high-performance",
			});
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
			renderer.setSize(container.clientWidth, container.clientHeight);
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.15;
			container.appendChild(renderer.domElement);

			envMap = createStudioEnvMap(renderer);
			scene.environment = envMap;

			const rootGroup = new THREE.Group();
			rootGroup.rotation.set(0.32, -0.58, 0.08);
			scene.add(rootGroup);
			const orbitGroup = new THREE.Group();
			scene.add(orbitGroup);
			const orbitGeometry = new THREE.TorusGeometry(2.55, 0.012, 8, 144);
			const orbitGeometryWide = new THREE.TorusGeometry(3.05, 0.008, 8, 144);
			const orbitWarm = new THREE.MeshBasicMaterial({
				color: 0x0077cc,
				transparent: true,
				opacity: 0.42,
			});
			const orbitCool = new THREE.MeshBasicMaterial({
				color: 0xeae6df,
				transparent: true,
				opacity: 0.2,
			});
			const orbitA = new THREE.Mesh(orbitGeometry, orbitWarm);
			orbitA.rotation.set(1.18, 0.28, -0.22);
			const orbitB = new THREE.Mesh(orbitGeometryWide, orbitCool);
			orbitB.rotation.set(0.42, -0.72, 0.34);
			orbitGroup.add(orbitA, orbitB);

			const boxGeom = createRoundedBoxGeometry(0.78, 0.11);
			const sphereGeom = new THREE.SphereGeometry(0.41, 28, 28);
			const cylinderGeom = new THREE.CylinderGeometry(0.39, 0.39, 0.78, 28);

			const obsidianMat = new THREE.MeshPhysicalMaterial({
				color: 0x111215,
				roughness: 0.14,
				metalness: 0.08,
				clearcoat: 1.0,
				clearcoatRoughness: 0.08,
			});

			const ivoryMat = new THREE.MeshPhysicalMaterial({
				color: 0xeae6df,
				roughness: 0.42,
				metalness: 0.02,
				clearcoat: 0.18,
				clearcoatRoughness: 0.25,
			});

			const terracottaMat = new THREE.MeshPhysicalMaterial({
				color: 0x0077cc,
				roughness: 0.24,
				metalness: 0.06,
				clearcoat: 0.65,
				clearcoatRoughness: 0.14,
			});

			const materials = [obsidianMat, ivoryMat, terracottaMat];
			const geometries = [boxGeom, sphereGeom, cylinderGeom];
			const pieces: ModularPiece[] = [];
			const spacing = 0.86;

			let index = 0;
			for (let x = -1; x <= 1; x += 1) {
				for (let y = -1; y <= 1; y += 1) {
					for (let z = -1; z <= 1; z += 1) {
						const geomIndex = (index + Math.abs(x * 2 + y)) % 3;
						let mat = obsidianMat;
						if ((x + y + z + 3) % 4 === 0) {
							mat = terracottaMat;
						} else if ((index + z + 2) % 3 === 0) {
							mat = ivoryMat;
						}

						const mesh = new THREE.Mesh(geometries[geomIndex], mat);
						const basePosition = new THREE.Vector3(
							x * spacing,
							y * spacing,
							z * spacing,
						);
						mesh.position.copy(basePosition);
						if (geomIndex === 2) {
							mesh.rotation.x = index % 2 === 0 ? Math.PI * 0.5 : 0;
						}

						const radialDir = basePosition.clone();
						if (radialDir.lengthSq() > 0.001) {
							radialDir.normalize();
						} else {
							radialDir.set(0, 1, 0);
						}

						rootGroup.add(mesh);
						pieces.push({
							mesh,
							basePosition,
							radialDir,
							phaseOffset: index * 0.37,
							spinSpeed: new THREE.Vector3(
								(index % 2 === 0 ? 1 : -1) * 0.04,
								0.05,
								0.03,
							),
						});
						index += 1;
					}
				}
			}

			// Studio lighting
			const ambientLight = new THREE.AmbientLight(0xf7f6f3, 0.65);
			scene.add(ambientLight);

			const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
			keyLight.position.set(5, 7, 6);
			scene.add(keyLight);

			const fillLight = new THREE.DirectionalLight(0xeae6df, 1.1);
			fillLight.position.set(-5, -2, 4);
			scene.add(fillLight);

			const rimLight = new THREE.PointLight(0x0077cc, 7, 16);
			rimLight.position.set(-3.2, 2.2, 3.5);
			scene.add(rimLight);

			const targetPointer = { x: 0, y: 0 };
			const currentPointer = { x: 0, y: 0 };
			let targetExpand = 0.08;
			let currentExpand = 0.08;
			let targetScroll = 0;
			let currentScroll = 0;

			const handlePointerMove = (event: PointerEvent) => {
				const rect = container.getBoundingClientRect();
				const nx =
					((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
				const ny =
					-((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1;
				targetPointer.x = nx * 0.48;
				targetPointer.y = ny * 0.34;
				const dist = Math.min(Math.hypot(nx, ny), 1.2);
				targetExpand = 0.06 + (1.2 - dist) * 0.16;
			};

			const handlePointerLeave = () => {
				targetExpand = 0.06;
			};

			const handleScroll = () => {
				targetScroll = Math.min(
					window.scrollY / Math.max(window.innerHeight * 0.95, 1),
					1.4,
				);
			};

			const handleResize = () => {
				if (!container || !renderer) return;
				const width = container.clientWidth;
				const height = Math.max(container.clientHeight, 1);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height);
				const scale = width < 640 ? 0.82 : 1;
				rootGroup.scale.setScalar(scale);
				rootGroup.position.set(width < 640 ? 0 : width < 1024 ? 0.9 : 2.15, 0, 0);
				orbitGroup.position.set(width < 640 ? 0 : width < 1024 ? 0.9 : 2.15, 0, -0.08);
			};

			handleResize();
			handleScroll();

			if (!reducedMotion) {
				window.addEventListener("pointermove", handlePointerMove, {
					passive: true,
				});
				window.addEventListener("pointerleave", handlePointerLeave, {
					passive: true,
				});
				window.addEventListener("scroll", handleScroll, { passive: true });
			}
			window.addEventListener("resize", handleResize);

			const startTime = performance.now();

			const renderLoop = () => {
				const elapsed = (performance.now() - startTime) * 0.001;

				if (!reducedMotion) {
					currentPointer.x += (targetPointer.x - currentPointer.x) * 0.06;
					currentPointer.y += (targetPointer.y - currentPointer.y) * 0.06;
					currentExpand += (targetExpand - currentExpand) * 0.06;
					currentScroll += (targetScroll - currentScroll) * 0.07;

					camera.position.z = 7.2 - currentScroll * 2.1;
					rootGroup.rotation.y =
						-0.58 + elapsed * 0.12 + currentPointer.x + currentScroll * 1.45;
					rootGroup.rotation.x =
						0.32 -
						currentPointer.y +
						Math.sin(elapsed * 0.35) * 0.04 +
						currentScroll * 0.42;
					orbitGroup.rotation.y = elapsed * 0.045 + currentPointer.x * 0.08;
					orbitGroup.rotation.x = Math.sin(elapsed * 0.11) * 0.04;

					for (const piece of pieces) {
						const wave = Math.sin(elapsed * 1.1 + piece.phaseOffset) * 0.045;
						const offset = currentExpand + wave + currentScroll * 1.65;
						piece.mesh.position
							.copy(piece.basePosition)
							.addScaledVector(piece.radialDir, offset);
						piece.mesh.rotation.x +=
							piece.spinSpeed.x * (0.2 + currentScroll * 0.9);
						piece.mesh.rotation.y +=
							piece.spinSpeed.y * (0.2 + currentScroll * 0.9);
					}
				}

				if (isVisible && isPageVisible) renderer?.render(scene, camera);

				if (!reducedMotion && isVisible && isPageVisible) {
					animationFrameId = window.requestAnimationFrame(renderLoop);
				} else {
					isAnimating = false;
				}
			};

			const startLoop = () => {
				if (reducedMotion || isAnimating || !isVisible || !isPageVisible) return;
				isAnimating = true;
				animationFrameId = window.requestAnimationFrame(renderLoop);
			};
			const stopLoop = () => {
				isAnimating = false;
				window.cancelAnimationFrame(animationFrameId);
			};
			const observer = new IntersectionObserver(([entry]) => {
				isVisible = entry.isIntersecting;
				if (isVisible) startLoop();
				else stopLoop();
			});
			observer.observe(container);
			const handleVisibilityChange = () => {
				isPageVisible = document.visibilityState === "visible";
				if (isPageVisible) startLoop();
				else stopLoop();
			};
			document.addEventListener("visibilitychange", handleVisibilityChange);
			renderer.render(scene, camera);
			startLoop();

			return () => {
				stopLoop();
				window.removeEventListener("pointermove", handlePointerMove);
				window.removeEventListener("pointerleave", handlePointerLeave);
				window.removeEventListener("scroll", handleScroll);
				window.removeEventListener("resize", handleResize);
				observer.disconnect();
				document.removeEventListener("visibilitychange", handleVisibilityChange);
				for (const g of geometries) g.dispose();
				orbitGeometry.dispose();
				orbitGeometryWide.dispose();
				orbitWarm.dispose();
				orbitCool.dispose();
				for (const m of materials) m.dispose();
				envMap?.dispose();
				renderer?.dispose();
				renderer?.domElement.remove();
			};
		} catch {
			return undefined;
		}
	}, [reducedMotion]);

	return (
		<div
			ref={containerRef}
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
		/>
	);
}
