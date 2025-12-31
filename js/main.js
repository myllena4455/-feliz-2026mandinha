
const mensagemCentral = {
    titulo: "Obrigado por Tudo ❤️", 
    texto: "Sabe, é engraçado como a gente se aproximou tanto sem nunca ter se visto pessoalmente, sem nunca ter feito uma call sequer. Só textos, só partidas de HOK, só conversas aleatórias... mas porra, você se tornou a pessoa mais importante desse ano pra mim.\n\nNão importa a distância, não importa que a gente só se fale por mensagens. Você é real pra mim. Suas palavras, sua presença, tudo isso é real e significou demais pra mim.\n\nObrigado por cada partida, por cada conversa, por cada momento que você esteve ali, mesmo que de longe. Obrigado por existir e por fazer parte da minha vida. Você é especial demais e eu tenho muita sorte de ter você por perto.\n\nQue 2025 seja incrível pra você, porque você merece tudo de melhor que esse mundo pode oferecer. ✨", 
    img: ""
};
const memorias = [
    { titulo: "🎮 Nossas Partidas de HOK", texto: "Cada partida que a gente joga junto é especial. Não importa se ganhamos ou perdemos, o que importa é estar com você. Você é minha dupla favorita e não tem ninguém que eu prefira ter no meu time.", img: "", pos: {x: 20, y: 8, z: 15}, color: 0xff6b9d },
    { titulo: "✨ Conexão Verdadeira", texto: "A gente nunca se viu pessoalmente, nunca fez call, mas isso não importa. Você é real pra mim. Sua presença, suas palavras, cada momento... tudo isso é real. E você é incrível.", img: "", pos: {x: -18, y: -10, z: -20}, color: 0x6b9dff },
    { titulo: "💖 A Pessoa Mais Importante", texto: "Você foi a pessoa mais importante desse ano pra mim. Mesmo de longe, você esteve comigo nos melhores e piores momentos. Obrigado por tudo, de verdade.", img: "", pos: {x: -8, y: 15, z: -12}, color: 0x00ff88 },
    { titulo: "🌟 Especial Demais", texto: "Não existe ninguém como você. Você tem algo especial, algo único. E eu sou muito grato por ter você na minha vida. Feliz 2025!", img: "", pos: {x: 15, y: -8, z: 18}, color: 0xffaa00 }
];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); 

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 0); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 200;
controls.autoRotate = false;
controls.enabled = false;

const geometry = new THREE.BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const finalPositions = new Float32Array(count * 3);
const sizes = new Float32Array(count);

for(let i = 0; i < count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 40 + 2; 
    const spinAngle = radius * 2;
    const branchAngle = (i % 3) * ((Math.PI * 2) / 3);

    const randomX = (Math.random() - 0.5) * 5;
    const randomY = (Math.random() - 0.5) * 5;
    const randomZ = (Math.random() - 0.5) * 5;

    finalPositions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    finalPositions[i3+1] = (Math.random() - 0.5) * (radius * 0.4) + randomY; 
    finalPositions[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    positions[i3] = 0; positions[i3+1] = 0; positions[i3+2] = 0;
    sizes[i] = Math.random() * 0.4 + 0.1;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

function getStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32,32,0,32,32,32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,64,64);
    return new THREE.CanvasTexture(canvas);
}

const material = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    color: 0xffffff,
    map: getStarTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

const interactiveObjects = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const sun = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffdd00 }));
sun.add(new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })));
sun.userData = { data: mensagemCentral, type: 'center' };
scene.add(sun);
interactiveObjects.push(sun);

memorias.forEach(mem => {
    const planetGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: mem.color });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    const glowGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: mem.color, 
        transparent: true, 
        opacity: 0.3,
        blending: THREE.AdditiveBlending 
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    planet.add(glow);
    
    planet.position.set(mem.pos.x, mem.pos.y, mem.pos.z);
    planet.userData = { data: mem, type: 'memory' };
    scene.add(planet);
    interactiveObjects.push(planet);
});

const comets = [];
class Comet {
    constructor() {
        const coreGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.core = new THREE.Mesh(coreGeometry, coreMaterial);
        
        const tailGeometry = new THREE.ConeGeometry(0.15, 8, 16);
        const tailMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.4 
        });
        this.tail = new THREE.Mesh(tailGeometry, tailMaterial);
        this.tail.rotation.x = Math.PI / 2;
        this.tail.position.z = -4;
        
        const glowGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        this.glow = new THREE.Mesh(glowGeometry, glowMaterial);
        
        this.group = new THREE.Group();
        this.group.add(this.core);
        this.group.add(this.tail);
        this.group.add(this.glow);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 70;
        this.group.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 40,
            Math.sin(angle) * radius
        );
        
        const targetAngle = angle + Math.PI + (Math.random() - 0.5) * 0.3;
        this.velocity = {
            x: Math.cos(targetAngle) * 0.2,
            y: (Math.random() - 0.5) * 0.05,
            z: Math.sin(targetAngle) * 0.2
        };
        
        scene.add(this.group);
    }
    
    update() {
        this.group.position.x += this.velocity.x;
        this.group.position.y += this.velocity.y;
        this.group.position.z += this.velocity.z;
        
        const direction = new THREE.Vector3(
            this.velocity.x,
            this.velocity.y,
            this.velocity.z
        ).normalize();
        this.group.lookAt(
            this.group.position.x + direction.x,
            this.group.position.y + direction.y,
            this.group.position.z + direction.z
        );
        
        const distance = this.group.position.length();
        if(distance > 90 || distance < 5) {
            scene.remove(this.group);
            return false;
        }
        return true;
    }
}

let cometInterval;
function startComets() {
    comets.push(new Comet());
    cometInterval = setInterval(() => {
        comets.push(new Comet());
    }, 8000);
}

const photoFrames = [];

const photoData = [
    { pos: {x: -12, y: 8, z: -10}, img: 'img/foto1.jpg', titulo: '✨ Beleza Sobrenatural', texto: 'Cara, eu não consigo nem explicar direito, mas você tem uma beleza que parece ser de outro mundo mesmo. Não é exagero, é sério. Cada traço seu, cada detalhe... tudo em você é perfeito demais. Você é daquelas pessoas que quando aparece, rouba toda a atenção sem nem precisar tentar. Sua beleza é natural, genuina, e absurdamente encantadora. Nunca vi nada igual.' },
    { pos: {x: 18, y: -12, z: 8}, img: 'img/foto2.jpg', titulo: '💖 A Mais Linda que Existe', texto: 'Eu já vi muita gente bonita na vida, mas você? Você é de outro nível. Pra mim, você é literalmente a mulher mais linda que existe. Não é só a beleza física, que já é surreal, mas é como você é por dentro também. Seu jeito, sua personalidade, tudo se mistura e cria algo magnífico. Você tem um brilho único que me deixa completamente fascinado. Sou muito sortudo só de poder te conhecer.' },
    { pos: {x: -5, y: 18, z: 15}, img: 'img/foto3.jpg', titulo: '🌟 Perfeita Demais', texto: 'Eu podia ficar horas falando sobre o quão linda você é e ainda assim não seria suficiente. Seus olhos são hipnotizantes, seu sorriso ilumina tudo ao redor, seu jeito de ser é cativante... Você é uma obra de arte viva. Cada vez que eu te vejo, é como se fosse a primeira vez. Você não faz ideia do quanto é especial e do quanto sua beleza é única. Não existe ninguém como você, e eu tenho certeza disso.' }
];

photoData.forEach((data, index) => {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(data.img);
    const geometry = new THREE.PlaneGeometry(6, 6);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const photo = new THREE.Mesh(geometry, material);
    photo.position.set(data.pos.x, data.pos.y, data.pos.z);
    const glowGeometry = new THREE.PlaneGeometry(6.5, 6.5);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.4,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.1;
    photo.add(glow);
    photo.lookAt(0, 0, 0);
    photo.userData = { data: { titulo: data.titulo, texto: data.texto, img: data.img }, type: 'photo', originalScale: 1 };
    scene.add(photo);
    photoFrames.push(photo);
    interactiveObjects.push(photo);
});

let isExploded = false;

document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').style.opacity = 0;
    setTimeout(() => document.getElementById('start-screen').remove(), 1000);
    document.getElementById('musica').play().catch(()=>{});

    startComets();

    const anim = { value: 0 };
    gsap.to(anim, {
        value: 1, duration: 3.5, ease: "power3.out",
        onUpdate: () => {
            const currentPos = geometry.attributes.position.array;
            for(let i=0; i<count; i++) {
                const i3 = i*3;
                currentPos[i3] = finalPositions[i3] * anim.value;
                currentPos[i3+1] = finalPositions[i3+1] * anim.value;
                currentPos[i3+2] = finalPositions[i3+2] * anim.value;
            }
            geometry.attributes.position.needsUpdate = true;
        },
        onComplete: () => { 
            isExploded = true;
            controls.enabled = true;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
        }
    });

    gsap.to(camera.position, { duration: 4, x: 40, y: 20, z: 50, ease: "power2.inOut" });
});

let touchStartX = 0;
let touchStartY = 0;
let touchMoved = false;

function handleInteraction(clientX, clientY) {
    if(!isExploded) return;
    mouse.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    
    raycaster.params.Points.threshold = 0.5;
    
    const intersects = raycaster.intersectObjects(interactiveObjects, true);
    if(intersects.length > 0) {
        let targetObject = intersects[0].object;
        
        if(!targetObject.userData.data && targetObject.parent) {
            targetObject = targetObject.parent;
        }
        
        if(targetObject.userData && targetObject.userData.data) {
            abrirModal(targetObject.userData);
        }
    }
}

renderer.domElement.addEventListener('click', event => {
    handleInteraction(event.clientX, event.clientY);
});

renderer.domElement.addEventListener('touchstart', event => {
    if(event.touches.length > 0) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchMoved = false;
    }
}, { passive: false });

renderer.domElement.addEventListener('touchmove', event => {
    if(event.touches.length > 0) {
        const touch = event.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX);
        const deltaY = Math.abs(touch.clientY - touchStartY);
        if(deltaX > 10 || deltaY > 10) {
            touchMoved = true;
        }
    }
}, { passive: false });

renderer.domElement.addEventListener('touchend', event => {
    if(event.changedTouches.length > 0 && !touchMoved) {
        const touch = event.changedTouches[0];
        event.preventDefault();
        handleInteraction(touch.clientX, touch.clientY);
    }
}, { passive: false });

const clock = new THREE.Clock();
function animate() {
    const time = clock.getElapsedTime();
    
    controls.update(); 

    sun.scale.setScalar(1 + Math.sin(time * 2) * 0.05);
    interactiveObjects.forEach(obj => {
        if(obj.userData.type === 'memory') {
            obj.children[0].scale.setScalar(1 + Math.sin(time * 2 + obj.position.x) * 0.15);
        }
        if(obj.userData.type === 'photo') {
            obj.rotation.y = Math.sin(time * 0.5 + obj.position.x) * 0.1;
            obj.position.y += Math.sin(time * 2 + obj.position.x) * 0.01;
        }
    });

    for(let i = comets.length - 1; i >= 0; i--) {
        if(!comets[i].update()) {
            comets.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

const modal = document.getElementById('modal');
const mCard = document.getElementById('modal-card');
const mImg = document.getElementById('m-img');

let photoInZoom = null;

function abrirModal(data) {
    if(data.type === 'photo') {
        const clickedPhoto = interactiveObjects.find(obj => obj.userData === data);
        if(clickedPhoto) {
            photoInZoom = clickedPhoto;
            gsap.to(clickedPhoto.scale, { 
                duration: 0.5, 
                x: 2, 
                y: 2, 
                z: 2,
                ease: "back.out(1.7)"
            });
            setTimeout(() => {
                showModal(data);
            }, 300);
            return;
        }
    }
    showModal(data);
}

function showModal(data) {
    document.getElementById('m-titulo').innerText = data.data.titulo;
    document.getElementById('m-texto').innerText = data.data.texto;
    if(data.data.img) { mImg.src = data.data.img; mImg.style.display = 'block'; } 
    else { mImg.style.display = 'none'; }
    if(data.type === 'center') mCard.classList.add('center-style');
    else mCard.classList.remove('center-style');
    modal.classList.add('active');
    controls.autoRotate = false;
}

function fecharModal() {
    if(photoInZoom) {
        gsap.to(photoInZoom.scale, { 
            duration: 0.4, 
            x: 1, 
            y: 1, 
            z: 1,
            ease: "power2.out"
        });
        photoInZoom = null;
    }
    modal.classList.remove('active');
    controls.autoRotate = true;
}
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
