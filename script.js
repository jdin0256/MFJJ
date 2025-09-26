// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // It's best to replace this with a placeholder
    authDomain: "collaborative-whiteboard-692d1.firebaseapp.com",
    projectId: "collaborative-whiteboard-692d1",
    storageBucket: "collaborative-whiteboard-692d1.firebasestorage.app",
    messagingSenderId: "511422222917",
    appId: "1:511422222917:web:ed9bb365a4c9500d61892c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- Whiteboard Setup ---
const canvas = document.getElementById('whiteboard');
const context = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// --- Drawing Functions ---
function draw(x0, y0, x1, y1) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = 'black';
    context.lineWidth = 5;
    context.stroke();
    context.closePath();
}

// --- Event Listeners for Local Drawing ---
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const currentX = e.offsetX;
    const currentY = e.offsetY;

    const drawData = {
        x0: lastX,
        y0: lastY,
        x1: currentX,
        y1: currentY,
    };
    
    // Send data to Firebase
    database.ref('drawings').push(drawData);
    
    [lastX, lastY] = [currentX, currentY];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// --- Firebase Listener for Collaboration ---
database.ref('drawings').on('child_added', (snapshot) => {
    const data = snapshot.val();
    draw(data.x0, data.y0, data.x1, data.y1);
});