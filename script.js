let scene, camera, renderer, controls;
let currentObject;

// Oggetto per associare ogni membro ai rispettivi progetti
const memberProjects = {
    'BENEDETTA BIGLIARDO': {
        projects: ['FORMAZIONE:ORGANICA', 'COMPUTER GENERATED MEMORIES'],
        role: 'MEDIA DESIGNER',
        shortRole: 'DES',
        year: '2023'
    },
    'TOMMASO CAPANNI': {
        projects: ['FORMAZIONE:ORGANICA', 'COMPUTER GENERATED MEMORIES'],
        role: 'MEDIA DESIGNER',
        shortRole: 'DES',
        year: '2023'
    },
    /* 'MATTIA MAGIONAMI': {
        projects: ['FORMAZIONE:ORGANICA', 'C.G.M'],
        role: 'SOUND ARTIST',
        shortRole: 'SND',
        year: '2022'
    },
    'DAVIDE MARILUNGO': {
        projects: ['FORMAZIONE:ORGANICA', 'C.G.M'],
        role: 'SOUND DESIGNER',
        shortRole: 'SND',
        year: '2022'
    }, */
    'MARCO MAURIZI': {
        projects: ['CGM', 'Lisergica'],
        role: 'PROD TECH',
        shortRole: 'TEC',
        year: '2023'
    },
    'SIMONE PACE': {
        projects: ['FORMA'],
        role: 'SOUND ENGINEER',
        shortRole: 'SND',
        year: '2023'
    }
};


function changeProjects(memberName) {
    const projectNamesElement = document.querySelector('.project-names');
    const projectMetaElement = document.querySelector('.project-meta');
    const roleElement = document.querySelector('.designer-role'); // Seleziona l'elemento del ruolo abbreviato

    // Svuota i contenuti attuali
    projectNamesElement.innerHTML = '';
    projectMetaElement.innerHTML = '';

    if (memberProjects[memberName]) {
        // Aggiunge i nuovi progetti
        memberProjects[memberName].projects.forEach(project => {
            const projectElement = document.createElement('p');
            projectElement.textContent = project;
            projectNamesElement.appendChild(projectElement);
        });

        // Aggiunge ruolo e anno di ingresso nella sezione project-meta
        const roleText = memberProjects[memberName].role;
        const yearText = memberProjects[memberName].year;

        const roleMetaElement = document.createElement('p');
        roleMetaElement.textContent = roleText;
        projectMetaElement.appendChild(roleMetaElement);

        const yearMetaElement = document.createElement('p');
        yearMetaElement.textContent = yearText;
        projectMetaElement.appendChild(yearMetaElement);

        // Aggiorna .designer-role con il ruolo abbreviato
        roleElement.textContent = memberProjects[memberName].shortRole;
    }
}




function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;

    const cameraLight = new THREE.PointLight(0xffffff, 1.0);
    camera.add(cameraLight);
    scene.add(camera);

    addObject('cube');
    animate();
}

// function animate() {
//     requestAnimationFrame(animate);
//     if (currentObject) {
//         // currentObject.rotation.x += 0.001;
//         currentObject.rotation.y += 0.01;
//     }
//     controls.update();
//     renderer.render(scene, camera);
// }

// // GLTF
// function addObject(type) {
//     console.log("Creating object of type:", type);

//     if (currentObject) {
//         scene.remove(currentObject); // Remove the previous object from the scene
//     }

//     const loader = new THREE.GLTFLoader();

//     if (type === 'customModel1') {
//         // Load the first custom model
//         loader.load(
//             '3d/Bonnie_run.glb', // Replace this with the actual path to your first model
//             function (gltf) {
//                 currentObject = gltf.scene;
//                 currentObject.scale.set(2, 2, 2); // Adjust the scale as needed
//                 currentObject.position.set(0, -2.5, 0); // Adjust position as needed
                
//                 scene.add(currentObject);
//                 console.log("Custom model 1 loaded successfully.");
//             },
//             undefined,
//             function (error) {
//                 console.error("Error loading custom model 1:", error);
//             }
//         );
//     } else if (type === 'customModel2') {
//         // Load the second custom model
//         loader.load(
//             '3d/Crash.glb', // Replace this with the actual path to your second model
//             function (gltf) {
//                 currentObject = gltf.scene;
//                 currentObject.scale.set(0.1, 0.1, 0.1); // Adjust the scale as needed
//                 currentObject.position.set(-0, -3, 0); // Adjust position as needed
//                 scene.add(currentObject);
//                 console.log("Custom model 2 loaded successfully.");
//             },
//             undefined,
//             function (error) {
//                 console.error("Error loading custom model 2:", error);
//             }
//         );
//     } else {
//         // Fallback to default shapes for predefined types
//         let geometry;
//         switch (type) {
//             case 'sphere':
//                 geometry = new THREE.SphereGeometry(1, 32, 32);
//                 break;
//             case 'cone':
//                 geometry = new THREE.ConeGeometry(1, 2, 32);
//                 break;
//             case 'torus':
//                 geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
//                 break;
//             case 'cylinder':
//                 geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
//                 break;
//             default:
//                 geometry = new THREE.BoxGeometry(1, 1, 1);
//                 console.log("Defaulting to cube geometry.");
//         }

//         const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
//         currentObject = new THREE.Mesh(geometry, material);
//         scene.add(currentObject);
//     }
// }

//con anim
let mixer; // Variabile per il mixer delle animazioni
let actions = {}; // Oggetto per memorizzare tutte le azioni di animazione

function addObject(type) {
    console.log("Creating object of type:", type);

    if (currentObject) {
        scene.remove(currentObject); // Rimuovi l'oggetto precedente dalla scena
        if (mixer) {
            mixer.stopAllAction(); // Ferma tutte le azioni di animazione precedenti
        }
    }

    const loader = new THREE.GLTFLoader();

    if (type === 'customModel1') {
        loader.load(
            '3d/Bonnie_run.glb', // Percorso al modello
            function (gltf) {
                currentObject = gltf.scene;
                currentObject.scale.set(2.2, 2.2, 2.2);
                currentObject.position.set(-1, -2.5, 0);
                scene.add(currentObject);

                // Inizializza il mixer per le animazioni
                mixer = new THREE.AnimationMixer(currentObject);
                
                // Aggiungi tutte le animazioni all'oggetto 'actions'
                gltf.animations.forEach((clip) => {
                    actions[clip.name] = mixer.clipAction(clip);
                });

                // Avvia l'animazione di default (modifica secondo il nome dell'animazione di default)
                if (actions['bonnie_run_anim']) { // Sostituisci 'Run' con il nome della tua animazione principale
                    actions['bonnie_run_anim'].play();
                }

                console.log("Custom model 1 loaded successfully with multiple animations.");
            },
            undefined,
            function (error) {
                console.error("Error loading custom model 1:", error);
            }
        );
    } else if (type === 'customModel2') {
        // Carica il secondo modello personalizzato
        loader.load(
            '3d/Crash.glb',
            function (gltf) {
                currentObject = gltf.scene;
                currentObject.scale.set(0.1, 0.1, 0.1);
                currentObject.position.set(0, -3, 0);
                scene.add(currentObject);

                console.log("Custom model 2 loaded successfully.");
            },
            undefined,
            function (error) {
                console.error("Error loading custom model 2:", error);
            }
        );
    } else {
        // Codice per le forme di default
        let geometry;
        switch (type) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 'cone':
                geometry = new THREE.ConeGeometry(1, 2, 32);
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
                console.log("Defaulting to cube geometry.");
        }

        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        currentObject = new THREE.Mesh(geometry, material);
        scene.add(currentObject);
    }
}

// Funzione per cambiare animazione
function playAnimation(animationName) {
    if (actions[animationName]) {
        // Ferma tutte le azioni
        mixer.stopAllAction();

        // Avvia l'animazione richiesta
        actions[animationName].reset().play();
    } else {
        console.warn(`Animation "${animationName}" not found.`);
    }
}

// Modifica la funzione animate per aggiornare il mixer se presente
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(0.01);
    }

    if (currentObject) {
        currentObject.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
}



function changeObject(type) {
    addObject(type);
}

function changeTitle(newTitle) {
    const titleElement = document.getElementById('dynamic-title');
    titleElement.textContent = newTitle;
}

function selectName(selectedElement) {
    const nameElements = document.querySelectorAll('.member-list p, .service-list p');
    
    nameElements.forEach(el => {
        el.classList.remove('selected', 'dimmed');
    });
    
    selectedElement.classList.add('selected');
    nameElements.forEach(el => {
        if (el !== selectedElement) {
            el.classList.add('dimmed');
        }
    });

    // Chiama `changeProjects` per aggiornare progetti, ruolo e anno
    changeProjects(selectedElement.textContent);
}


// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();





//BG------dot-crocini
    const dotSize = 1.0;
    const dotSpacing = 20;
    const crociniPercentage = 0.025;
    const hoverPercentage = 0.065;
    let mousePadding = 60;
    const maxLifetime = 80;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let crocini = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.scale(1, 1);
      generateCrocini();
      drawDots();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function generateCrocini() {
      crocini = [];
      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          const isCrocino = Math.random() < crociniPercentage;
          crocini.push(createCrocino(x, y, isCrocino));
        }
      }
    }

    function createCrocino(x, y, isCrocino = false) {
      return {
        x,
        y,
        scale: isCrocino ? 1 : 0,
        rotation: (Math.random() < 0.5 ? -1 : 1) * (0.1 + Math.random() * 0.8),
        targetRotation: 0, // Nuova variabile per rotazione graduale
        currentRotation: 0,
        growthSpeed: 0.1 + Math.random() * 0.2,
        rotationSpeedChangeFrequency: 10 + Math.random() * 100,
        framesSinceLastChange: 0,
        fadingOut: false,
        color: isCrocino ? 'rgba(100, 100, 100, 0.35)' : 'rgba(200, 200, 200, 0.5)',
        highlighted: false,
        isCrocino,
        lifetime: isCrocino ? Math.random() * 100 + 50 : Infinity,
        traceScale: 1
      };
    }

    // Funzione di interpolazione lineare
    function lerp(start, end, t) {
      return start + (end - start) * t;
    }

    function drawDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(150, 150, 150, 0.5)';

      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      crocini.forEach((crocino, index) => {
        if (!crocino) return;

        if (crocino.highlighted) {
          crocino.scale = Math.min(1.2, crocino.scale + crocino.growthSpeed * 1.2);
          crocino.lifetime = Math.max(0, crocino.lifetime - 1);
        } else if (!crocino.isCrocino) {
          crocino.scale = Math.max(0, crocino.scale - crocino.growthSpeed);
          if (crocino.scale === 0) {
            crocino.highlighted = false;
          }
        }

        if (crocino.isCrocino || crocino.highlighted) {
          crocino.lifetime--;
          if (crocino.lifetime <= 0 && !crocino.fadingOut) {
            crocino.fadingOut = true;
            crocino.growthSpeed = -Math.abs(crocino.growthSpeed) * 0.5;
          }

          if (crocino.fadingOut && crocino.scale <= 0) {
            crocini[index] = createCrocino(crocino.x, crocino.y, false);
          }
        }

        ctx.save();
        ctx.translate(crocino.x, crocino.y);
        // Interpolazione della rotazione per renderla più smooth
        crocino.rotation = lerp(crocino.rotation, crocino.targetRotation, 0.05);
        crocino.currentRotation += crocino.rotation;
        ctx.rotate(crocino.currentRotation);
        ctx.strokeStyle = crocino.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-dotSpacing / 4 * crocino.scale, 0);
        ctx.lineTo(dotSpacing / 4 * crocino.scale, 0);
        ctx.moveTo(0, -dotSpacing / 4 * crocino.scale);
        ctx.lineTo(0, dotSpacing / 4 * crocino.scale);
        ctx.stroke();

        if (crocino.fadingOut) {
          crocino.traceScale = Math.max(0, crocino.traceScale - 0.02);
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
          ctx.beginPath();
          ctx.moveTo(-dotSpacing / 4 * crocino.traceScale, 0);
          ctx.lineTo(dotSpacing / 4 * crocino.traceScale, 0);
          ctx.moveTo(0, -dotSpacing / 4 * crocino.traceScale);
          ctx.lineTo(0, dotSpacing / 4 * crocino.traceScale);
          ctx.stroke();
        }

        ctx.restore();

        crocino.framesSinceLastChange++;
        if (crocino.framesSinceLastChange >= crocino.rotationSpeedChangeFrequency) {
          // Cambia gradualmente la rotazione
          crocino.targetRotation = (Math.random() < 0.5 ? -1 : 1) * (0.1 + Math.random() * 0.1);
          crocino.framesSinceLastChange = 0;
        }
      });

      setTimeout(() => requestAnimationFrame(drawDots), 33);
    }

    document.addEventListener('mousemove', (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      crocini.forEach((crocino) => {
        const distance = Math.sqrt(Math.pow(mouseX - crocino.x, 2) + Math.pow(mouseY - crocino.y, 2));
        if (distance < mousePadding && Math.random() < hoverPercentage) {
          crocino.highlighted = true;
          const colors = ['rgba(255, 0, 255, 0.7)', 'rgba(0, 255, 0, 0.7)', 'rgba(0, 255, 255, 0.7)'];
          crocino.color = colors[Math.floor(Math.random() * colors.length)];
          crocino.lifetime = maxLifetime - Math.floor(distance / mousePadding * maxLifetime / 2);
        } else {
          if (!crocino.fadingOut && crocino.scale === 0) {
            crocino.highlighted = false;
            crocino.color = crocino.isCrocino ? 'rgba(200, 200, 200, 0.7)' : 'rgba(200, 200, 200, 0.5)';
          }
        }
      });
    });

    generateCrocini();
    drawDots();
