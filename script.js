let scene, camera, renderer, controls;
let currentObject;

// Oggetto per associare ogni membro ai rispettivi progetti
const memberProjects = {
    'BENEDETTA BIGLIARDO': {
        projects: ['FORMAZIONE ORGANICA', 'COMPUTER GENERATED MEMORIES'],
        role: 'MEDIA DESIGNER',
        shortRole: 'DES',
        year: '2023'
    },
    'TOMMASO CAPANNI': {
        projects: ['SOUNDWAVE EXPERIMENTS', 'VIRTUAL DREAMS', 'LIGHT & SPACE'],
        role: 'SOUND DESIGNER',
        shortRole: 'DES',
        year: '2022'
    },
    'MATTIA MAGIONAMI': {
        projects: ['URBAN PATTERNS', 'NATURE SYMPHONY'],
        role: 'VISUAL ARTIST',
        shortRole: 'SND',
        year: '2021'
    },
    'DAVIDE MARILUNGO': {
        projects: ['DIGITAL HERITAGE', 'MOTION CAPTURE STUDY'],
        role: 'INTERACTIVE DESIGNER',
        shortRole: 'SND',
        year: '2020'
    },
    'MARCO MAURIZI': {
        projects: ['ARCHITECTURAL VISIONS', '3D LANDSCAPES'],
        role: '3D ARTIST',
        shortRole: 'SND',
        year: '2019'
    },
    'SIMONE PACE': {
        projects: ['AUDIO VISUAL HARMONY', 'COLORS IN MOTION'],
        role: 'AUDIO ENGINEER',
        shortRole: 'SND',
        year: '2018'
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

    const cameraLight = new THREE.PointLight(0xffffff, 1.0);
    camera.add(cameraLight);
    scene.add(camera);

    addObject('cube');
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (currentObject) {
        // currentObject.rotation.x += 0.001;
        currentObject.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
}

// GLTF
function addObject(type) {
    console.log("Creating object of type:", type);

    if (currentObject) {
        scene.remove(currentObject); // Remove the previous object from the scene
    }

    const loader = new THREE.GLTFLoader();

    if (type === 'customModel1') {
        // Load the first custom model
        loader.load(
            '3d/Crash.glb', // Replace this with the actual path to your first model
            function (gltf) {
                currentObject = gltf.scene;
                currentObject.scale.set(0.1, 0.1, 0.1); // Adjust the scale as needed
                currentObject.position.set(-0, -3, 0); // Adjust position as needed
                
                scene.add(currentObject);
                console.log("Custom model 1 loaded successfully.");
            },
            undefined,
            function (error) {
                console.error("Error loading custom model 1:", error);
            }
        );
    } else if (type === 'customModel2') {
        // Load the second custom model
        loader.load(
            'path/to/your/second_model.glb', // Replace this with the actual path to your second model
            function (gltf) {
                currentObject = gltf.scene;
                scene.add(currentObject);
                console.log("Custom model 2 loaded successfully.");
            },
            undefined,
            function (error) {
                console.error("Error loading custom model 2:", error);
            }
        );
    } else {
        // Fallback to default shapes for predefined types
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
