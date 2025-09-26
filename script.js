// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgL7L6cNNtyUAwz5hqPsWZlQ_jiZqGD8k",
    authDomain: "collaborative-whiteboard-692d1.firebaseapp.com",
    databaseURL: "https://collaborative-whiteboard-692d1-default-rtdb.asia-southeast1.firebasedatabase.app",
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
const drawBtn = document.getElementById('drawBtn');
const eraseBtn = document.getElementById('eraseBtn');
const clearBtn = document.getElementById('clearBtn'); // Get the new button

// Set canvas size
canvas.width = 800;
canvas.height = 600;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let strokeColor = 'black';

// --- Button Listeners ---
drawBtn.addEventListener('click', () => {
    strokeColor = 'black';
});

eraseBtn.addEventListener('click', () => {
    strokeColor = 'white';
});

// Add a listener for the Clear All button
clearBtn.addEventListener('click', () => {
    // Send the command to Firebase to remove all drawings
    database.ref('drawings').remove();
});


// --- Drawing Functions ---
function draw(x0, y0, x1, y1, color) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 10;
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
        color: strokeColor,
    };
    
    database.ref('drawings').push(drawData);
    
    [lastX, lastY] = [currentX, currentY];
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// --- Firebase Listener for Collaboration ---
// This listener adds new drawings as they come in
database.ref('drawings').on('child_added', (snapshot) => {
    const data = snapshot.val();
    draw(data.x0, data.y0, data.x1, data.y1, data.color);
});

// Add a new listener to handle the clear event
database.ref('drawings').on('value', (snapshot) => {
    if (!snapshot.exists()) {
        // If the 'drawings' node is empty, clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
});