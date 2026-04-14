let scene, camera, renderer, avatar;

let speaking = false;

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  const loader = new THREE.GLTFLoader();

  loader.load("avatar.glb", function (gltf) {
    avatar = gltf.scene;
    avatar.position.y = -1;
    scene.add(avatar);
  });

  camera.position.z = 2;

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (avatar) {
    // idle movement
    avatar.rotation.y += 0.002;
    avatar.position.y = Math.sin(Date.now() * 0.001) * 0.05;

    if (speaking) {
      // fake talking animation
      avatar.scale.y = 1 + Math.random() * 0.03;
    } else {
      avatar.scale.y = 1;
    }
  }

  renderer.render(scene, camera);
}

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);

  speech.pitch = 1.2;
  speech.rate = 1;

  speech.onstart = () => speaking = true;
  speech.onend = () => speaking = false;

  speechSynthesis.speak(speech);
}

async function talk() {
  const input = document.getElementById("input").value;

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: input })
  });

  const reply = await res.text();

  speak(reply);
}
