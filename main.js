import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Import OrbitControls
// import { tri } from 'three/webgpu';

// Create the scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5); // Position the camera at (5, 5, 5)

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane - test with a triangle(half quad)
// 1. vertices
// 2. indices
// 3. Faces
// 4. Buffer custom geometry
const vertices = new Float32Array([
  // Front face
  -0.5, -1,  0.5,  // Vertex 0
   0.5, -0.5,  0.5,  // Vertex 1
   0.5,  0.5,  0.5,  // Vertex 2
]);

const indices = new Uint16Array([
  // Front face
  0, 1, 2
]);

// Set the attributes
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(new THREE.BufferAttribute(indices, 1));

// Create material 
const material = new THREE.MeshBasicMaterial({ color: 'red' });

// Create mesh
const cube = new THREE.Mesh(geometry, material);

// Add the triangle to the scene
scene.add(cube);

// Using a scaling matrix
// 1. Get position attribute
// 2. vertices to scale
// const positionAttribute = geometry.getAttribute('position');
// const verticesScale     = positionAttribute.array;

// get developed geometry
const geo = cube.geometry;

// Get access to the vertex positions
const cubeAttributePosition = geo.attributes.position;
console.log(cubeAttributePosition);

// Scaling factor
const scaleFactor = 1.6;

// for(let i = 0; i < vertices.length; i += 3)
// {
//   verticesScale[i]     *= 1.82;
//   verticesScale[i + 1] *= 1.45;
//   verticesScale[i + 2] *= 1.33;
// }

for(let i = 0; i < cubeAttributePosition.count; i++)
{
  // Get the original vertex position
  let x = cubeAttributePosition.getX(i);
  let y = cubeAttributePosition.getY(i);
  let z = cubeAttributePosition.getZ(i);

  // Use only z, y, z
  // Matrix multiplcation with the scaling matrix
  let scaledX = scaleFactor * x;
  let scaledY = scaleFactor * y;
  let scaledZ = scaleFactor * z;

  // Set the new scaled vertex position
  cubeAttributePosition.setXYZ(i, scaledX, scaledY, scaledZ);
}

// update position values - vertices
cubeAttributePosition.needsUpdate = true;



// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Prevents camera from moving vertically when dragging

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Start the animation loop
animate();
