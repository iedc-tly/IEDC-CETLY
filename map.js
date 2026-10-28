/**
 * IEDC-CETLY 3D Campus Interactive Map
 * Three.js + OrbitControls + GLTF WebGL Engine
 * Full 360-degree rotation, building inspection, and interactive navigation.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ==========================================================================
   Campus Buildings & Locations Data
   ========================================================================== */
const CAMPUS_DATA = {
  'AD': {
    name: 'Administrative Block',
    code: 'CETLY-AD',
    shortLabel: 'ADMIN',
    tag: 'ADMINISTRATION & CENTRAL OFFICES',
    description: "The primary nerve center of College of Engineering Thalassery. Houses the Principal's Directorate, Central Administration, Academic Section, Examination Wing, and the Main Boardroom.",
    facilities: [
      "Principal's Directorate & Executive Office",
      'Central Academic & Student Services Desk',
      'Finance & Examination Control Division',
      'Executive Conference Hall & Senate Room',
      'Visitors & Placement Reception Lobby'
    ],
    accentColor: 0xeab308
  },
  'CS': {
    name: 'Computer Science & Engineering',
    code: 'CETLY-CS',
    shortLabel: 'CS BLOCK',
    tag: 'DEPT. OF COMPUTER SCIENCE & ENGG',
    description: 'Premier department dedicated to computing systems, software engineering, cloud architecture, and cutting-edge artificial intelligence research.',
    facilities: [
      'Advanced AI & Machine Learning Research Center',
      'High Performance Cloud & Systems Computing Lab',
      'Cybersecurity & Network Systems Lab',
      'Software Engineering & Database Studio',
      'Smart Interactive Department Seminar Hall'
    ],
    accentColor: 0x38bdf8
  },
  'EC': {
    name: 'Electronics & Communication',
    code: 'CETLY-EC',
    shortLabel: 'EC BLOCK',
    tag: 'DEPT. OF ELECTRONICS & COMM.',
    description: 'Leading facility for VLSI design, wireless communications, embedded microcontrollers, and sensor robotics engineering.',
    facilities: [
      'VLSI & Microelectronics Fabrication Lab',
      'Embedded Systems & Robotics Laboratory',
      'Digital Signal Processing & Microwave Suite',
      'IoT Systems & Wireless Sensor Prototyping Bay',
      'Faculty Research & Project Consultation Rooms'
    ],
    accentColor: 0x0ea5e9
  },
  'EEE': {
    name: 'Electrical & Electronics Engineering',
    code: 'CETLY-EEE',
    shortLabel: 'EEE BLOCK',
    tag: 'DEPT. OF ELECTRICAL & ELECTRONICS',
    description: 'Center for high-voltage engineering, electric power systems, renewable grid integration, industrial drives, and the college IEDC Innovation Hub.',
    facilities: [
      '⚡ IEDC Innovation Hub & Workspace (Ground Wing)',
      'Heavy Electrical Machines & Drives Lab',
      'Power Electronics & Electric Vehicles Testbed',
      'Renewable Energy & Solar Grid Systems Station',
      'Industrial Control & Automation Suite'
    ],
    accentColor: 0xf59e0b
  },
  'IEDC': {
    name: 'IEDC Room & Innovation Hub',
    code: 'CETLY-EEE / IEDC',
    shortLabel: '⚡ IEDC ROOM',
    tag: 'KERALA STARTUP MISSION AFFILIATED',
    description: 'The Innovation and Entrepreneurship Development Centre (IEDC) at College of Engineering Thalassery is located inside the Electrical Engineering Block. It is the flagship creative workspace, student startup incubator, and maker lab for all CETLY innovators.',
    facilities: [
      '⚡ Rapid Prototyping & IoT Electronics Workbench',
      '💡 Student Startup Workstations & Wi-Fi Incubator',
      '🤝 KSUM Project Guidance & Founder Mentorship Desk',
      '🏆 Hackathon & Ideation Team Brainstorming Bay',
      '📦 Microcontrollers, Sensors & Hardware Kit Library'
    ],
    accentColor: 0x72b01d,
    isSpecial: true
  },
  'CE': {
    name: 'Civil Engineering',
    code: 'CETLY-CE',
    shortLabel: 'CE BLOCK',
    tag: 'DEPT. OF CIVIL ENGINEERING',
    description: 'Specializes in structural mechanics, environmental engineering, geotechnical analysis, and modern architectural survey.',
    facilities: [
      'Strength of Materials & Concrete Testing Bay',
      'Geotechnical & Foundation Engineering Lab',
      'Environmental Engineering & Water Testing Unit',
      'Advanced Surveying & Total Station Station',
      'Civil CAD, GIS & Structural Modeling Studio'
    ],
    accentColor: 0xf97316
  },
  'MC': {
    name: 'Mechanical Engineering',
    code: 'CETLY-MC',
    shortLabel: 'MECH BLOCK',
    tag: 'DEPT. OF MECHANICAL ENGINEERING',
    description: 'Hub of manufacturing excellence, thermodynamics, fluid dynamics, robotics, and advanced CNC rapid prototyping.',
    facilities: [
      'Central CNC Machine Workshop & Tool Room',
      'Thermal Engineering & IC Engines Research Cell',
      'Fluid Mechanics & Hydraulic Machinery Lab',
      'Metallurgy & Material Science Analysis Lab',
      'Additive Manufacturing & Rapid Prototyping Studio'
    ],
    accentColor: 0xef4444
  },
  'cafeteria': {
    name: 'Campus Cafeteria & Lounge',
    code: 'CETLY-CAFE',
    shortLabel: 'CAFETERIA',
    tag: 'STUDENT AMENITIES & FOOD COURT',
    description: 'Vibrant social and dining hub of the college campus serving fresh meals, snacks, and refreshments in a spacious relaxed atmosphere.',
    facilities: [
      'Main Dining Hall & Food Counters',
      'Student Conversation & Breakout Courtyard',
      'Faculty & Staff Refreshment Section',
      'Hygienic Modern Kitchen Facility',
      'Open Outdoor Seating Shaded Patio'
    ],
    accentColor: 0xf43f5e
  },
  'court': {
    name: 'The Frame',
    code: 'CETLY-FRAME',
    shortLabel: 'FRAME',
    tag: 'CAMPUS LIFE & STUDENT ACTIVITIES',
    description: 'The iconic Frame open courtyard and seating arena at CET Thalassery. Central gathering ground for student community events, Hackatly hackathon breakout sessions, cultural meetups, and campus life.',
    facilities: [
      'The Frame Open Amphitheatre & Pavilion',
      'Student Gathering & Discussion Steps',
      'Hackathon Outdoor Breakout Zone',
      'Lush Campus Courtyard Walkway',
      'Cultural & Club Performance Space'
    ],
    accentColor: 0x10b981
  }
};

/* ==========================================================================
   Global State & Variables
   ========================================================================== */
let scene, camera, renderer, controls;
let campusGroup = null;
let currentTheme = 'tech'; // 'tech' | 'daylight' | 'blueprint'
let labelsVisible = true;
let activeBuildingKey = null;

const buildingMeshes = {};       // key -> Mesh
const buildingLabels = {};       // key -> DOM Element
const labelWorldPos = {};        // key -> Vector3
let pinGroup = null;             // 3D Visual Beacons in Scene
let iedcBeaconRing = null;       // Pulsing ring for IEDC room

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredMesh = null;
const originalMaterials = new Map();

// Camera animation state
let cameraTransition = null;

// Initial overview camera coordinates
let defaultCamPos = new THREE.Vector3(25, 22, 28);
let defaultTarget = new THREE.Vector3(0, 0, 0);

/* ==========================================================================
   Initialization
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThree();
  loadCampusModel();
  setupUI();
  setupEvents();
});

/* ==========================================================================
   1. Navbar & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navToggle = document.getElementById('nav-toggle');
  const navActions = document.getElementById('nav-actions');

  if (navToggle && navActions) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navActions.classList.toggle('active');
    });

    navActions.querySelectorAll('a, button').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.classList.remove('active');
          navActions.classList.remove('active');
        }
      });
    });
  }
}

/* ==========================================================================
   2. Three.js Scene Setup
   ========================================================================== */
function initThree() {
  const container = document.getElementById('viewer-container');
  const canvas = document.getElementById('webgl-canvas');

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e1117);
  scene.fog = new THREE.FogExp2(0x0e1117, 0.015);

  // Camera
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
  camera.position.set(25, 22, 28);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // OrbitControls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = true;

  // Full 360-degree rotation horizontally
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;

  // Vertical limits: from birds-eye down to ground level
  controls.minPolarAngle = 0.08;
  controls.maxPolarAngle = Math.PI / 2.06;

  controls.minDistance = 4;
  controls.maxDistance = 120;

  // Auto-rotate 360 turntable
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;

  setupLighting();

  window.addEventListener('resize', onWindowResize);
  animate(0);
}

/* ==========================================================================
   3. Lighting
   ========================================================================== */
let dirLight, hemiLight, ambientLight;

function setupLighting() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  hemiLight = new THREE.HemisphereLight(0x72b01d, 0x1f2937, 0.45);
  scene.add(hemiLight);

  dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  dirLight.position.set(30, 45, 25);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 150;
  const d = 35;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
  fillLight.position.set(-30, 25, -25);
  scene.add(fillLight);
}

/* ==========================================================================
   4. Model Loading & Positioning
   ========================================================================== */
function loadCampusModel() {
  const loader = new GLTFLoader();
  const progressBar = document.getElementById('progress-bar');
  const loaderPercentage = document.getElementById('loader-percentage');
  const loaderSub = document.getElementById('loader-sub');
  const loadingOverlay = document.getElementById('loading-overlay');

  loader.load(
    'coetmap.glb',
    (gltf) => {
      campusGroup = gltf.scene;

      // 1. Calculate bounding box of raw geometry
      const box = new THREE.Box3().setFromObject(campusGroup);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Center the campus around (0, 0, 0)
      campusGroup.position.x = -center.x;
      campusGroup.position.y = -center.y;
      campusGroup.position.z = -center.z;

      const rootContainer = new THREE.Group();
      rootContainer.add(campusGroup);
      scene.add(rootContainer);

      // CRITICAL: Force matrix world recalculation so all child world positions are accurate!
      scene.updateMatrixWorld(true);

      // 2. Ground contact shadow plane
      const groundGeo = new THREE.PlaneGeometry(size.x * 2.2, size.z * 2.2);
      const groundMat = new THREE.MeshStandardMaterial({
        color: 0x080a0d,
        roughness: 0.95,
        metalness: 0.05
      });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -size.y / 2 - 0.05;
      ground.receiveShadow = true;
      scene.add(ground);

      // 3. Classify and style meshes
      processMeshes(campusGroup);

      // Re-force matrix world update after material / hierarchy processing
      scene.updateMatrixWorld(true);

      // 4. Set optimal camera position
      const maxDim = Math.max(size.x, size.z);
      defaultCamPos = new THREE.Vector3(maxDim * 0.9, maxDim * 0.65, maxDim * 0.95);
      defaultTarget = new THREE.Vector3(0, 0, 0);

      camera.position.copy(defaultCamPos);
      controls.target.copy(defaultTarget);
      controls.update();

      // 5. Build precise 3D floating labels and visual beacons
      createFloatingLabels();

      // 6. Complete loading screen
      if (progressBar) progressBar.style.width = '100%';
      if (loaderPercentage) loaderPercentage.textContent = '100%';
      if (loaderSub) loaderSub.textContent = '3D Campus Map Ready!';

      setTimeout(() => {
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
      }, 400);
    },
    (xhr) => {
      if (xhr.lengthComputable && xhr.total > 0) {
        const percent = Math.round((xhr.loaded / xhr.total) * 100);
        if (progressBar) progressBar.style.width = percent + '%';
        if (loaderPercentage) loaderPercentage.textContent = percent + '%';
      }
    },
    (err) => {
      console.error('Failed to load campus GLB:', err);
      if (loaderSub) {
        loaderSub.textContent = 'Error loading 3D map. Check console for details.';
        loaderSub.style.color = '#ef4444';
      }
    }
  );
}

/* ==========================================================================
   5. Mesh Classification & Material Styling
   ========================================================================== */
function processMeshes(root) {
  root.traverse((child) => {
    if (!child.isMesh) return;

    child.castShadow = true;
    child.receiveShadow = true;

    const name = child.name;

    if (CAMPUS_DATA[name]) {
      buildingMeshes[name] = child;
      child.userData.buildingKey = name;
      applyBuildingMaterial(child, name, currentTheme);
    } else if (name === 'frame seats' || name === 'framec' || name === 'Plane') {
      child.userData.buildingKey = 'court';
      if (!buildingMeshes['court']) {
        buildingMeshes['court'] = child;
      }
      applyArenaMaterial(child, currentTheme);
    } else if (name.startsWith('tree') || name.startsWith('Icosphere')) {
      child.userData.isTree = true;
      applyTreeMaterial(child, currentTheme);
    } else if (name === 'Land') {
      child.userData.isLand = true;
      applyLandMaterial(child, currentTheme);
    } else {
      applyDefaultMaterial(child, currentTheme);
    }
  });
}

function applyBuildingMaterial(mesh, key, theme) {
  const data = CAMPUS_DATA[key];
  let color = 0x242b35;
  let roughness = 0.45;
  let metalness = 0.2;
  let emissive = 0x000000;

  if (theme === 'tech') {
    color = 0x1f2633;
    roughness = 0.35;
    metalness = 0.35;
  } else if (theme === 'daylight') {
    color = 0xe2e8f0;
    roughness = 0.6;
    metalness = 0.05;
  } else if (theme === 'blueprint') {
    color = 0x0f2744;
    roughness = 0.2;
    metalness = 0.6;
    emissive = 0x002244;
  }

  const mat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: roughness,
    metalness: metalness,
    emissive: emissive,
    wireframe: theme === 'blueprint'
  });

  mesh.material = mat;
  originalMaterials.set(mesh, mat);
}

function applyArenaMaterial(mesh, theme) {
  const mat = new THREE.MeshStandardMaterial({
    color: theme === 'daylight' ? 0xd1d5db : 0x282f3a,
    roughness: 0.7,
    metalness: 0.1,
    wireframe: theme === 'blueprint'
  });
  mesh.material = mat;
  originalMaterials.set(mesh, mat);
}

function applyTreeMaterial(mesh, theme) {
  const mat = new THREE.MeshStandardMaterial({
    color: theme === 'blueprint' ? 0x059669 : (theme === 'daylight' ? 0x22c55e : 0x3F7D20),
    roughness: 0.75,
    metalness: 0.05,
    wireframe: theme === 'blueprint'
  });
  mesh.material = mat;
  originalMaterials.set(mesh, mat);
}

function applyLandMaterial(mesh, theme) {
  const mat = new THREE.MeshStandardMaterial({
    color: theme === 'daylight' ? 0x94a3b8 : (theme === 'blueprint' ? 0x030d1a : 0x141821),
    roughness: 0.85,
    metalness: 0.1,
    wireframe: theme === 'blueprint'
  });
  mesh.material = mat;
  originalMaterials.set(mesh, mat);
}

function applyDefaultMaterial(mesh, theme) {
  const mat = new THREE.MeshStandardMaterial({
    color: theme === 'daylight' ? 0xf1f5f9 : 0x334155,
    roughness: 0.5,
    metalness: 0.2,
    wireframe: theme === 'blueprint'
  });
  mesh.material = mat;
  originalMaterials.set(mesh, mat);
}

/* ==========================================================================
   6. 3D Floating Labels & Physical 3D Beacons
   ========================================================================== */
function createFloatingLabels() {
  const labelsContainer = document.getElementById('labels-container');
  if (!labelsContainer) return;
  labelsContainer.innerHTML = '';

  // Remove existing pinGroup if any
  if (pinGroup) {
    scene.remove(pinGroup);
    pinGroup = null;
  }
  pinGroup = new THREE.Group();
  scene.add(pinGroup);

  // Ensure world matrix is completely evaluated
  scene.updateMatrixWorld(true);

  Object.keys(CAMPUS_DATA).forEach((key) => {
    const data = CAMPUS_DATA[key];
    // For IEDC room, it is in the Electrical Block (mesh EEE)
    const mesh = (key === 'IEDC') ? buildingMeshes['EEE'] : buildingMeshes[key];
    if (!mesh) return;

    // Calculate exact world bounds of this mesh
    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    const roofY = box.max.y;

    let anchorPos;
    let stemHeight = 0.35;

    if (key === 'IEDC') {
      // Offset toward the front wing of the Electrical Block
      const halfZ = (box.max.z - box.min.z) * 0.25;
      stemHeight = 0.45;
      anchorPos = new THREE.Vector3(center.x, roofY + stemHeight, center.z + halfZ);
    } else if (key === 'EEE') {
      // Offset EEE general label slightly to the opposite side of Electrical Block
      const halfZ = (box.max.z - box.min.z) * 0.25;
      anchorPos = new THREE.Vector3(center.x, roofY + stemHeight, center.z - halfZ);
    } else {
      // Placed directly centered above the building rooftop
      anchorPos = new THREE.Vector3(center.x, roofY + stemHeight, center.z);
    }

    labelWorldPos[key] = anchorPos;

    // 1. Add sleek 3D vertical beacon pin in Three.js scene
    const isIEDC = (key === 'IEDC');
    const pinColor = isIEDC ? 0x72b01d : data.accentColor;

    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, stemHeight, 8);
    const stemMat = new THREE.MeshBasicMaterial({
      color: pinColor,
      transparent: true,
      opacity: 0.75
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(anchorPos.x, roofY + stemHeight / 2, anchorPos.z);
    pinGroup.add(stem);

    // Glowing head sphere at the pin tip
    const headRadius = isIEDC ? 0.11 : 0.07;
    const headGeo = new THREE.SphereGeometry(headRadius, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({
      color: isIEDC ? 0xa3e635 : pinColor
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.copy(anchorPos);
    pinGroup.add(head);

    // Special pulsing ring for IEDC Room
    if (isIEDC) {
      const ringGeo = new THREE.RingGeometry(0.16, 0.24, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x72b01d,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      iedcBeaconRing = new THREE.Mesh(ringGeo, ringMat);
      iedcBeaconRing.rotation.x = Math.PI / 2;
      iedcBeaconRing.position.copy(anchorPos);
      pinGroup.add(iedcBeaconRing);
    }

    // 2. Create interactive 2D HTML badge
    const labelEl = document.createElement('div');
    labelEl.className = isIEDC ? 'map-label iedc-label' : 'map-label';
    labelEl.dataset.target = key;

    const dotStyle = `background-color: #${data.accentColor.toString(16).padStart(6, '0')};`;
    const labelText = data.shortLabel || data.name;

    labelEl.innerHTML = `
      <span class="map-label-dot" style="${dotStyle}"></span>
      <span>${labelText}</span>
    `;

    labelEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectBuilding(key);
    });

    labelsContainer.appendChild(labelEl);
    buildingLabels[key] = labelEl;
  });
}

function updateLabels() {
  if (!labelsVisible || !campusGroup) {
    Object.values(buildingLabels).forEach(el => el.style.display = 'none');
    if (pinGroup) pinGroup.visible = false;
    return;
  }

  if (pinGroup) pinGroup.visible = true;

  const container = document.getElementById('viewer-container');
  const widthHalf = container.clientWidth / 2;
  const heightHalf = container.clientHeight / 2;

  const tempV = new THREE.Vector3();
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir);
  const toPoint = new THREE.Vector3();

  Object.keys(labelWorldPos).forEach((key) => {
    const el = buildingLabels[key];
    const pos = labelWorldPos[key];
    if (!el || !pos) return;

    // Check if point is behind camera lens
    toPoint.copy(pos).sub(camera.position);
    if (toPoint.dot(cameraDir) <= 0) {
      el.style.display = 'none';
      return;
    }

    // Project 3D coordinate to screen space
    tempV.copy(pos);
    tempV.project(camera);

    // If point is offscreen, hide it
    if (tempV.z > 1 || Math.abs(tempV.x) > 1.05 || Math.abs(tempV.y) > 1.05) {
      el.style.display = 'none';
      return;
    }

    const x = (tempV.x * widthHalf) + widthHalf;
    const y = -(tempV.y * heightHalf) + heightHalf;

    el.style.display = 'flex';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // Active state
    if (activeBuildingKey === key) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

/* ==========================================================================
   7. Interaction (Hover, Raycast, Click Selection)
   ========================================================================== */
function setupEvents() {
  const canvas = document.getElementById('webgl-canvas');

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('click', onCanvasClick);
}

function onMouseMove(event) {
  const rect = event.target.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const meshes = Object.values(buildingMeshes);
  const intersects = raycaster.intersectObjects(meshes, true);

  if (intersects.length > 0) {
    let hitMesh = intersects[0].object;
    while (hitMesh && !hitMesh.userData.buildingKey && hitMesh.parent) {
      hitMesh = hitMesh.parent;
    }

    if (hitMesh && hitMesh.userData.buildingKey) {
      document.body.style.cursor = 'pointer';
      highlightMesh(hitMesh);
      return;
    }
  }

  document.body.style.cursor = 'default';
  unhighlightMesh();
}

function onCanvasClick(event) {
  const rect = event.target.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const meshes = Object.values(buildingMeshes);
  const intersects = raycaster.intersectObjects(meshes, true);

  if (intersects.length > 0) {
    let hitMesh = intersects[0].object;
    while (hitMesh && !hitMesh.userData.buildingKey && hitMesh.parent) {
      hitMesh = hitMesh.parent;
    }

    if (hitMesh && hitMesh.userData.buildingKey) {
      selectBuilding(hitMesh.userData.buildingKey);
    }
  }
}

function highlightMesh(mesh) {
  if (hoveredMesh === mesh) return;
  unhighlightMesh();

  hoveredMesh = mesh;
  const key = mesh.userData.buildingKey;
  const accent = CAMPUS_DATA[key]?.accentColor || 0x72b01d;

  if (mesh.material && mesh.material.emissive) {
    mesh.material.emissive.setHex(accent);
    mesh.material.emissiveIntensity = 0.6;
  }
}

function unhighlightMesh() {
  if (hoveredMesh) {
    const key = hoveredMesh.userData.buildingKey;
    if (activeBuildingKey !== key) {
      if (hoveredMesh.material && hoveredMesh.material.emissive) {
        hoveredMesh.material.emissive.setHex(currentTheme === 'blueprint' ? 0x002244 : 0x000000);
        hoveredMesh.material.emissiveIntensity = 1.0;
      }
    }
    hoveredMesh = null;
  }
}

/* ==========================================================================
   8. Building Selection & Camera Flight Animation
   ========================================================================== */
function selectBuilding(key) {
  if (key === 'all') {
    resetToOverview();
    return;
  }

  const data = CAMPUS_DATA[key];
  const mesh = (key === 'IEDC') ? buildingMeshes['EEE'] : buildingMeshes[key];
  if (!data || !mesh) return;

  activeBuildingKey = key;

  // Update quick nav pills UI
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === key);
  });

  // Calculate target position and camera offset
  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.z, 4);

  // Position camera at an isometric framing angle
  let focusTarget = center;
  if (key === 'IEDC' && labelWorldPos['IEDC']) {
    focusTarget = labelWorldPos['IEDC'];
  }

  const targetCamPos = new THREE.Vector3(
    focusTarget.x + maxDim * 1.6,
    focusTarget.y + maxDim * 1.3,
    focusTarget.z + maxDim * 1.6
  );

  // Animate camera smoothly to this building
  animateCameraTo(targetCamPos, focusTarget, 1200);

  // Highlight building mesh
  Object.keys(buildingMeshes).forEach((k) => {
    const m = buildingMeshes[k];
    if (m && m.material && m.material.emissive) {
      if (k === (key === 'IEDC' ? 'EEE' : key)) {
        m.material.emissive.setHex(data.accentColor);
        m.material.emissiveIntensity = 0.8;
      } else {
        m.material.emissive.setHex(currentTheme === 'blueprint' ? 0x002244 : 0x000000);
      }
    }
  });

  // Open Building Details Drawer
  showBuildingDrawer(key, data);
}

function showBuildingDrawer(key, data) {
  const drawer = document.getElementById('building-drawer');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerCode = document.getElementById('drawer-code');
  const drawerTag = document.getElementById('drawer-tag');
  const drawerDescription = document.getElementById('drawer-description');
  const drawerFacilities = document.getElementById('drawer-facilities');

  if (!drawer) return;

  drawerTitle.textContent = data.name;
  drawerCode.textContent = `CODE: ${data.code}`;
  drawerTag.textContent = data.tag;
  drawerDescription.textContent = data.description;

  drawerFacilities.innerHTML = '';
  data.facilities.forEach((f) => {
    const li = document.createElement('li');
    li.textContent = f;
    drawerFacilities.appendChild(li);
  });

  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');

  const modeText = document.getElementById('view-mode-text');
  if (modeText) modeText.textContent = `FOCUS: ${data.name.toUpperCase()}`;
}

function hideBuildingDrawer() {
  const drawer = document.getElementById('building-drawer');
  if (drawer) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  activeBuildingKey = null;

  Object.values(buildingMeshes).forEach((m) => {
    if (m && m.material && m.material.emissive) {
      m.material.emissive.setHex(currentTheme === 'blueprint' ? 0x002244 : 0x000000);
    }
  });

  const modeText = document.getElementById('view-mode-text');
  if (modeText) modeText.textContent = '360° INTERACTIVE VIEW';

  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.target === 'all');
  });
}

function resetToOverview() {
  hideBuildingDrawer();
  animateCameraTo(defaultCamPos, defaultTarget, 1000);
}

/* ==========================================================================
   9. Smooth Camera Flight Lerp Transition
   ========================================================================== */
function animateCameraTo(targetPos, targetLookAt, duration = 1000) {
  const startPos = camera.position.clone();
  const startLookAt = controls.target.clone();
  const startTime = performance.now();

  cameraTransition = {
    startPos,
    targetPos,
    startLookAt,
    targetLookAt,
    startTime,
    duration
  };
}

/* ==========================================================================
   10. HUD & Controls Binding
   ========================================================================== */
function setupUI() {
  // Quick Nav Pills
  document.querySelectorAll('.pill-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      selectBuilding(target);
    });
  });

  // Drawer Close Button
  const drawerClose = document.getElementById('drawer-close');
  if (drawerClose) {
    drawerClose.addEventListener('click', hideBuildingDrawer);
  }

  // Drawer Focus 360 Spin
  const drawerFocusBtn = document.getElementById('drawer-focus-btn');
  if (drawerFocusBtn) {
    drawerFocusBtn.addEventListener('click', () => {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2.0;
      const btnAuto = document.getElementById('btn-auto-rotate');
      if (btnAuto) btnAuto.classList.add('toggle-active');
    });
  }

  // Drawer Overview Button
  const drawerOverviewBtn = document.getElementById('drawer-overview-btn');
  if (drawerOverviewBtn) {
    drawerOverviewBtn.addEventListener('click', resetToOverview);
  }

  // 360 Spin Toggle Button
  const btnAutoRotate = document.getElementById('btn-auto-rotate');
  if (btnAutoRotate) {
    btnAutoRotate.addEventListener('click', () => {
      controls.autoRotate = !controls.autoRotate;
      btnAutoRotate.classList.toggle('toggle-active', controls.autoRotate);
    });
  }

  // Camera Presets: ISO
  const btnViewIso = document.getElementById('btn-view-iso');
  if (btnViewIso) {
    btnViewIso.addEventListener('click', () => {
      animateCameraTo(defaultCamPos, defaultTarget, 900);
    });
  }

  // Camera Presets: Top-Down Aerial View
  const btnViewTop = document.getElementById('btn-view-top');
  if (btnViewTop) {
    btnViewTop.addEventListener('click', () => {
      const topPos = new THREE.Vector3(0, 50, 0.1);
      animateCameraTo(topPos, defaultTarget, 900);
    });
  }

  // Camera Presets: Front Entrance View
  const btnViewFront = document.getElementById('btn-view-front');
  if (btnViewFront) {
    btnViewFront.addEventListener('click', () => {
      const frontPos = new THREE.Vector3(0, 10, 40);
      animateCameraTo(frontPos, defaultTarget, 900);
    });
  }

  // Reset Button
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', resetToOverview);
  }

  // Toggle Labels
  const btnToggleLabels = document.getElementById('btn-toggle-labels');
  if (btnToggleLabels) {
    btnToggleLabels.addEventListener('click', () => {
      labelsVisible = !labelsVisible;
      btnToggleLabels.classList.toggle('toggle-active', labelsVisible);
      const container = document.getElementById('labels-container');
      if (container) container.style.display = labelsVisible ? 'block' : 'none';
      if (pinGroup) pinGroup.visible = labelsVisible;
    });
  }

  // Theme Switcher Button
  const btnTheme = document.getElementById('btn-theme');
  const themeBtnLabel = document.getElementById('theme-btn-label');
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      if (currentTheme === 'tech') {
        currentTheme = 'daylight';
        if (themeBtnLabel) themeBtnLabel.textContent = 'DAY';
      } else if (currentTheme === 'daylight') {
        currentTheme = 'blueprint';
        if (themeBtnLabel) themeBtnLabel.textContent = 'BLUE';
      } else {
        currentTheme = 'tech';
        if (themeBtnLabel) themeBtnLabel.textContent = 'TECH';
      }
      applyTheme(currentTheme);
    });
  }

  // Fullscreen Button
  const btnFullscreen = document.getElementById('btn-fullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
  }
}

function applyTheme(theme) {
  if (theme === 'tech') {
    scene.background = new THREE.Color(0x0e1117);
    scene.fog.color.setHex(0x0e1117);
    ambientLight.color.setHex(0xffffff);
    ambientLight.intensity = 0.65;
    dirLight.color.setHex(0xffffff);
    dirLight.intensity = 1.4;
    hemiLight.color.setHex(0x72b01d);
    hemiLight.groundColor.setHex(0x1f2937);
  } else if (theme === 'daylight') {
    scene.background = new THREE.Color(0x93c5fd);
    scene.fog.color.setHex(0xc7d2fe);
    ambientLight.color.setHex(0xffffff);
    ambientLight.intensity = 0.8;
    dirLight.color.setHex(0xfffbeb);
    dirLight.intensity = 1.6;
    hemiLight.color.setHex(0xbae6fd);
    hemiLight.groundColor.setHex(0x86efac);
  } else if (theme === 'blueprint') {
    scene.background = new THREE.Color(0x030d1a);
    scene.fog.color.setHex(0x030d1a);
    ambientLight.color.setHex(0x38bdf8);
    ambientLight.intensity = 0.5;
    dirLight.color.setHex(0x38bdf8);
    dirLight.intensity = 1.0;
    hemiLight.color.setHex(0x0284c7);
    hemiLight.groundColor.setHex(0x082f49);
  }

  if (campusGroup) {
    processMeshes(campusGroup);
  }
}

function toggleFullscreen() {
  const container = document.getElementById('viewer-container');
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

/* ==========================================================================
   11. Window Resize
   ========================================================================== */
function onWindowResize() {
  const container = document.getElementById('viewer-container');
  if (!container || !camera || !renderer) return;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/* ==========================================================================
   12. Render Animation Loop
   ========================================================================== */
function animate(time) {
  requestAnimationFrame(animate);

  // Smooth camera flight transition lerp
  if (cameraTransition) {
    const elapsed = performance.now() - cameraTransition.startTime;
    const progress = Math.min(elapsed / cameraTransition.duration, 1.0);
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(cameraTransition.startPos, cameraTransition.targetPos, ease);
    controls.target.lerpVectors(cameraTransition.startLookAt, cameraTransition.targetLookAt, ease);

    if (progress >= 1.0) {
      cameraTransition = null;
    }
  }

  // Pulsing animation for IEDC beacon ring in 3D
  if (iedcBeaconRing) {
    const s = 1 + 0.18 * Math.sin(time * 0.005);
    iedcBeaconRing.scale.set(s, s, s);
  }

  controls.update();
  updateLabels();
  renderer.render(scene, camera);
}
