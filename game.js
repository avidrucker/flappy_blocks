// --- Initialization ---
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Set fixed Pico-8 resolution (128x128 pixels)
canvas.width = 128;
canvas.height = 128;
ctx.imageSmoothingEnabled = false;  // Keep blocky pixel art

// --- Game Variables ---
const BLOCK_X = 32;  // Block's horizontal position
const BLOCK_SIZE = 16;  // Block's size (16x16 pixels)
const INIT_GAP_Y = 64;  // Initial pipe gap
let blockY = INIT_GAP_Y;  // Block's vertical position
let blockVelocity = 0;  // Gravity effect (falling speed)
const GRAVITY = 0.1;  // How fast block falls
const JUMP = -2;  // How high block jumps
const PIPE_WIDTH = 16;
const GAP_HEIGHT = 40;
const FLIGHT_SPEED = 2;
let pipes = [{ x: 128, gapY: INIT_GAP_Y }];  // Initial pipe at the right edge
let score = 0;
let gameOver = false;

// Pico-8 Color Palette (Hex)
const COLORS = ["#000000", "#FFFFFF", "#FF77A8", "#29ADFF"];

// --- Sound Effects ---
const jumpSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAA...');  // Base64-encoded jump sound
const hitSound = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAA...');  // Base64-encoded hit sound

// --- Input Handling (Flap on Spacebar) ---
window.addEventListener("keydown", (event) => {
    if (!gameOver && event.key === " ") {
        blockVelocity = JUMP;  // Jump if not game over
        jumpSound.play();  // Play jump sound
    } else if (gameOver && event.key === " ") {
        resetGame();  // Restart if game over
    }
});

// --- Main Game Loop ---
function update() {
    ctx.fillStyle = COLORS[0];  // Background (Black)
    ctx.fillRect(0, 0, 128, 128);  // Clear screen

    // --- Update Block (Gravity and Jump) ---
    blockVelocity += GRAVITY;  // Apply gravity
    blockY += blockVelocity;  // Move block down

    // Draw block (16x16 pixels, White)
    ctx.fillStyle = COLORS[1];
    ctx.fillRect(BLOCK_X, blockY, BLOCK_SIZE, BLOCK_SIZE);

    // --- Pipe Logic ---
    pipes.forEach(pipe => {
        pipe.x -= FLIGHT_SPEED;  // Move pipes left

        // Draw top and bottom pipes (Blue)
        ctx.fillStyle = COLORS[3];
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY - GAP_HEIGHT);  // Top pipe
        ctx.fillRect(pipe.x, pipe.gapY + GAP_HEIGHT, PIPE_WIDTH, 128);  // Bottom pipe

        // For debugging purposes
        // Draw outline rectangle for collision area (Red)
        // ctx.strokeStyle = "#FF0000";  // Red color for outline
        // ctx.strokeRect(pipe.x, pipe.gapY - GAP_HEIGHT, PIPE_WIDTH, GAP_HEIGHT * 2);

        // Collision Detection
        if (
            (blockY < pipe.gapY - GAP_HEIGHT || blockY + BLOCK_SIZE > pipe.gapY + GAP_HEIGHT) && 
            (pipe.x < 48 && pipe.x + PIPE_WIDTH > BLOCK_X)
        ) {
            gameOver = true;  // End game if block hits pipe
            hitSound.play();  // Play hit sound
        }

        // Score Counting // Increment score if block passes pipe
        if (pipe.x === BLOCK_X) score++;
    });

    // Generate New Pipe if Off-Screen
    if (pipes[0].x < -PIPE_WIDTH) {
        pipes.shift();
        // Randomize vertical pipe gap a number between 32 and 96
        pipes.push({ x: 128, gapY: BLOCK_X + Math.random() * INIT_GAP_Y });
    }

    // --- Check Game Over ---
    if (blockY > 128 || blockY < 0) {
        gameOver = true;  // If block hits ground or top
        hitSound.play();
    }

    // --- Draw Score (Pink) ---
    ctx.fillStyle = COLORS[2];
    ctx.fillText(score, 60, 10);

    if (gameOver) {
        ctx.fillText("GAME OVER", 34, 64);
    } else {
        requestAnimationFrame(update);  // Keep looping
    }
}

// --- Reset Game ---
function resetGame() {
    blockY = INIT_GAP_Y;
    blockVelocity = -FLIGHT_SPEED;
    pipes = [{ x: 128, gapY: INIT_GAP_Y }];
    score = 0;
    gameOver = false;
    update();  // Restart loop
}

// --- Start Game ---
update();

