const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMsg = document.getElementById('overlayMsg');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const speedEl = document.getElementById('speed');

// 游戏配置
const GRID_SIZE = 20;
const TILE_COUNT = canvas.width / GRID_SIZE;
const BASE_SPEED = 150; // 毫秒
const SPEED_INCREMENT = 5; // 每吃一个食物加速毫秒数
const MIN_SPEED = 60;

// 游戏状态
let snake = [];
let food = {};
let specialFood = null;
let specialFoodTimer = 0;
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let bestScore = parseInt(localStorage.getItem('snakeBest')) || 0;
let gameSpeed = BASE_SPEED;
let gameLoop = null;
let isRunning = false;
let isPaused = false;
let particles = [];
let animationFrame = null;

bestEl.textContent = bestScore;

// 初始化游戏
function initGame() {
    snake = [
        { x: 5, y: Math.floor(TILE_COUNT / 2) },
        { x: 4, y: Math.floor(TILE_COUNT / 2) },
        { x: 3, y: Math.floor(TILE_COUNT / 2) }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    gameSpeed = BASE_SPEED;
    specialFood = null;
    specialFoodTimer = 0;
    particles = [];
    scoreEl.textContent = score;
    speedEl.textContent = 1;
    placeFood();
}

// 放置食物
function placeFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
    } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    food = newFood;
}

// 放置特殊食物（加分更多）
function placeSpecialFood() {
    if (specialFood) return;
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random() * TILE_COUNT),
            y: Math.floor(Math.random() * TILE_COUNT)
        };
    } while (
        snake.some(seg => seg.x === pos.x && seg.y === pos.y) ||
        (food.x === pos.x && food.y === pos.y)
    );
    specialFood = pos;
    specialFoodTimer = 80; // 存在80个tick
}

// 创建粒子效果
function createParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x * GRID_SIZE + GRID_SIZE / 2,
            y: y * GRID_SIZE + GRID_SIZE / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1,
            decay: 0.02 + Math.random() * 0.03,
            size: 2 + Math.random() * 3,
            color: color
        });
    }
}

// 更新粒子
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// 绘制粒子
function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// 游戏主循环
function update() {
    if (isPaused) return;

    direction = { ...nextDirection };

    // 移动蛇头
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // 碰撞检测 - 墙壁
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
        gameOver();
        return;
    }

    // 碰撞检测 - 自身
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // 吃普通食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        createParticles(food.x, food.y, '#ff6b6b', 12);
        placeFood();

        // 加速
        gameSpeed = Math.max(MIN_SPEED, gameSpeed - SPEED_INCREMENT);
        speedEl.textContent = Math.floor((BASE_SPEED - gameSpeed) / SPEED_INCREMENT) + 1;
        clearInterval(gameLoop);
        gameLoop = setInterval(update, gameSpeed);

        // 随机出现特殊食物
        if (Math.random() < 0.3) {
            placeSpecialFood();
        }
    }
    // 吃特殊食物
    else if (specialFood && head.x === specialFood.x && head.y === specialFood.y) {
        score += 50;
        scoreEl.textContent = score;
        createParticles(specialFood.x, specialFood.y, '#ffcc00', 20);
        specialFood = null;
        specialFoodTimer = 0;
    }
    else {
        snake.pop();
    }

    // 特殊食物倒计时
    if (specialFood) {
        specialFoodTimer--;
        if (specialFoodTimer <= 0) {
            specialFood = null;
        }
    }

    updateParticles();
    draw();
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= TILE_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }

    // 绘制蛇
    snake.forEach((seg, index) => {
        const progress = index / snake.length;
        const r = Math.floor(0 + progress * 0);
        const g = Math.floor(255 - progress * 100);
        const b = Math.floor(136 - progress * 80);
        const color = `rgb(${r}, ${g}, ${b})`;

        const padding = 1;
        const x = seg.x * GRID_SIZE + padding;
        const y = seg.y * GRID_SIZE + padding;
        const size = GRID_SIZE - padding * 2;

        // 蛇身圆角矩形
        ctx.fillStyle = color;
        ctx.shadowColor = index === 0 ? '#00ff88' : 'transparent';
        ctx.shadowBlur = index === 0 ? 15 : 0;

        const radius = index === 0 ? 6 : 4;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();

        ctx.shadowBlur = 0;

        // 蛇头眼睛
        if (index === 0) {
            ctx.fillStyle = '#fff';
            let eyeOffsetX1, eyeOffsetY1, eyeOffsetX2, eyeOffsetY2;

            if (direction.x === 1) {
                eyeOffsetX1 = 13; eyeOffsetY1 = 5;
                eyeOffsetX2 = 13; eyeOffsetY2 = 13;
            } else if (direction.x === -1) {
                eyeOffsetX1 = 5; eyeOffsetY1 = 5;
                eyeOffsetX2 = 5; eyeOffsetY2 = 13;
            } else if (direction.y === -1) {
                eyeOffsetX1 = 5; eyeOffsetY1 = 5;
                eyeOffsetX2 = 13; eyeOffsetY2 = 5;
            } else {
                eyeOffsetX1 = 5; eyeOffsetY1 = 13;
                eyeOffsetX2 = 13; eyeOffsetY2 = 13;
            }

            ctx.beginPath();
            ctx.arc(seg.x * GRID_SIZE + eyeOffsetX1, seg.y * GRID_SIZE + eyeOffsetY1, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(seg.x * GRID_SIZE + eyeOffsetX2, seg.y * GRID_SIZE + eyeOffsetY2, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // 瞳孔
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.arc(seg.x * GRID_SIZE + eyeOffsetX1 + direction.x, seg.y * GRID_SIZE + eyeOffsetY1 + direction.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(seg.x * GRID_SIZE + eyeOffsetX2 + direction.x, seg.y * GRID_SIZE + eyeOffsetY2 + direction.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 绘制普通食物
    const foodPulse = Math.sin(Date.now() / 200) * 2;
    ctx.fillStyle = '#ff6b6b';
    ctx.shadowColor = '#ff6b6b';
    ctx.shadowBlur = 15 + foodPulse;
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 3 + foodPulse / 2,
        0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // 食物高光
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2 - 2,
        food.y * GRID_SIZE + GRID_SIZE / 2 - 2,
        3, 0, Math.PI * 2
    );
    ctx.fill();

    // 绘制特殊食物
    if (specialFood) {
        const sp = Math.sin(Date.now() / 150) * 3;
        const alpha = specialFoodTimer < 20 ? (specialFoodTimer / 20) : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 20 + sp;

        // 星形
        const cx = specialFood.x * GRID_SIZE + GRID_SIZE / 2;
        const cy = specialFood.y * GRID_SIZE + GRID_SIZE / 2;
        const outerR = GRID_SIZE / 2 - 2 + sp / 2;
        const innerR = outerR * 0.5;
        const spikes = 5;

        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI / spikes) - Math.PI / 2 + Date.now() / 1000;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 绘制粒子
    drawParticles();

    // 暂停提示
    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⏸ 已暂停', canvas.width / 2, canvas.height / 2);
    }
}

// 游戏结束
function gameOver() {
    isRunning = false;
    clearInterval(gameLoop);

    // 死亡粒子
    snake.forEach(seg => {
        createParticles(seg.x, seg.y, '#ff4444', 3);
    });

    // 最后绘制一次带粒子的画面
    updateParticles();
    draw();

    // 更新最高分
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('snakeBest', bestScore);
        bestEl.textContent = bestScore;
    }

    // 显示结束界面
    overlayTitle.textContent = '💀 游戏结束';
    overlayMsg.textContent = `得分: ${score}  |  最高分: ${bestScore}`;
    startBtn.textContent = '再来一局';
    overlay.classList.add('active');
}

// 开始游戏
function startGame() {
    overlay.classList.remove('active');
    initGame();
    isRunning = true;
    isPaused = false;
    draw();
    gameLoop = setInterval(update, gameSpeed);
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (!isRunning) {
        if (e.code === 'Space' || e.code === 'Enter') {
            startGame();
        }
        return;
    }

    // 暂停
    if (e.code === 'Space') {
        isPaused = !isPaused;
        if (isPaused) draw();
        return;
    }

    if (isPaused) return;

    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
            if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;
        case 'ArrowDown': case 's': case 'S':
            if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;
        case 'ArrowLeft': case 'a': case 'A':
            if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;
        case 'ArrowRight': case 'd': case 'D':
            if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
});

// 移动端方向键
document.querySelectorAll('.dir-btn').forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!isRunning) return;
        if (isPaused) return;

        const dir = btn.dataset.dir;
        switch (dir) {
            case 'up':
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                break;
            case 'down':
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                break;
            case 'left':
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                break;
            case 'right':
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                break;
        }
    });
});

// 触摸滑动支持
let touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', (e) => {
    if (!isRunning || isPaused) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction.x !== -1) nextDirection = { x: 1, y: 0 };
        else if (dx < 0 && direction.x !== 1) nextDirection = { x: -1, y: 0 };
    } else {
        if (dy > 0 && direction.y !== -1) nextDirection = { x: 0, y: 1 };
        else if (dy < 0 && direction.y !== 1) nextDirection = { x: 0, y: -1 };
    }
});

// 开始按钮
startBtn.addEventListener('click', startGame);

// 初始绘制
initGame();
draw();
