/*
    This is the slightly more readable version of my game script.
*/

var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var projectiles = [];
var objects = [];
var lastTime = 0;
const GAME_WIDTH = 256;
const GAME_HEIGHT = 256;
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 32;
const PROJECTILE_WIDTH = 8;
const PROJECTILE_HEIGHT = 8;
const PROJECTILE_SPEED = 6;
const OBSTACLE1_WIDTH = 32;
const OBSTACLE1_HEIGHT = 16;
const OBSTACLE2_WIDTH = 32;
const OBSTACLE2_HEIGHT = 32;
const OBJECT_SPEED = 2;
var jumpForce = 3;
var jumpTime = 0;
var displacement = 0.25 * jumpTime * jumpTime;
var jumping = false;
var jumpAgain = false;
var shootTimer = 0;
var shootMax = 125;
var spawnTimer = 0;
var spawnMax = 500;
var score = 0;
var gameOver = false;
var paused = false;
var pauseReady = true;
var displayScore = false;
// Creates single instance of object
var player = {
    x: 16,
    y: GAME_HEIGHT - PLAYER_HEIGHT,
    w: PLAYER_WIDTH,
    h: PLAYER_HEIGHT
}
// Using function allows repeated instantiation of objects
function projectile (x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function obstacle1 (x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function obstacle2 (x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

// updates all game objects on screen
function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'cornsilk';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = 'darkgreen';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(player.x + player.w, player.y + 8, 8, 8);
    for (const proj of projectiles) {
        ctx.fillRect(proj.x, proj.y, proj.w, proj.h);
    }
    for (const obj of objects) {
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    }
}

function input() {
    // Move player, jump
    document.addEventListener("keydown", (event)=> {
        if (!gameOver && pauseReady && !paused && event.key == 'Enter') {
            paused = true;
            pauseReady = false;
        } else if (!gameOver && pauseReady && paused && event.key == 'Enter') {
            paused = false;
            pauseReady = false;
        }
        if (shootTimer >= shootMax && event.key == 'z') {
            shootTimer = 0;
            var newProj = new projectile(player.x + player.w, player.y + PROJECTILE_HEIGHT, PROJECTILE_WIDTH, PROJECTILE_HEIGHT);
            projectiles.push(newProj);
        }
        if (event.key == 'x') {
            if (jumping) {
                jumpAgain = true;
            } 
            jumping = true;
        }
    })

    document.addEventListener("keyup", (event)=> {
        if (gameOver && event.key == 'Enter') {
            reset();
        } else if ((paused || !paused) && event.key == 'Enter') {
            pauseReady = true;
        }
    })
}

// Resets game values
function reset() {
    gameOver = false;
    displayScore = false;
    score = 0;
    player.x = 16;
    player.y = GAME_HEIGHT - PLAYER_HEIGHT;
    jumping = false;
    jumpTime = 0;
    projectiles.splice(0, projectiles.length);
    objects.splice(0, objects.length);
}
// Handles player's jumping
function Jump(time) {
    time /= 100;
    jumpTime += time;
    displacement = 0.5 * jumpTime;
    // Stops player from going above ceiling
    if (player.y <= 0) {
        player.y = 0;
        jumpTime = 6;
    }
    player.y += (-jumpForce + displacement);
    // Player is on the ground
    if (player.y >= GAME_HEIGHT - PLAYER_HEIGHT) {
        jumpTime = 0;
        jumping = false;
        player.y = GAME_HEIGHT - PLAYER_HEIGHT;
    }
}

// Handles player movement
function playerMovement(deltaTime) {
    if (jumping) {
        if (jumpAgain) {
            jumpTime = 0;
            jumpAgain = false;
        }
        Jump(deltaTime);
    }
}

// Controls movement of projectiles shot by player
function projectileMovement() {
    if (projectiles.length > 0) {
        var i = 0;
        while (i < projectiles.length) {
            projectiles[i].x += PROJECTILE_SPEED;
            if (projectiles[i].x > GAME_WIDTH + projectiles[i].w) {
                projectiles.shift();
            } else {
                i++;
            }
        }
    }
}

// Controls movement of all objects moving left
function objectMovement() {
    if (objects.length > 0) {
        var i = 0;
        while (i < objects.length) {
            objects[i].x -= OBJECT_SPEED;
            if (objects[i].x < - objects[i].w) {
                objects.shift();
            } else {
                i++;
            }
        }
    }
}


// Checks for collisions between two objects
function collisionCheck(ob1, ob2) {
    // If the equations below are > 0, we know the second object (after minus) is between the first object's position and width
    var x1 = ob1.x + ob1.w - ob2.x;
    var x2 = ob2.x + ob2.w - ob1.x;
    var y1 = ob1.y + ob1.h - ob2.y;
    var y2 = ob2.y + ob2.h - ob1.y;
    if (((x1 > 0 && x1 <= ob1.w) || (x2 > 0 && x2 <= ob2.w))
        && ((y1 > 0 && y1 <= ob1.h)|| (y2 > 0 && y2 <= ob2.h))) 
    {
        return true;
    }
}

// Spawns enemies randomly
function SpawnEnemy() {
    
    var type = Math.floor(Math.random() * 2);
    if (type == 0) {
        var yPos = OBSTACLE1_HEIGHT + Math.floor(Math.random() * 8) * 31;
        var obj = new obstacle1(GAME_WIDTH, yPos, OBSTACLE1_WIDTH, OBSTACLE1_HEIGHT);
        objects.push(obj);
    } else {
        var yPos = Math.floor(Math.random() * 8) * 32;
        var obj = new obstacle2(GAME_WIDTH, yPos, OBSTACLE2_WIDTH, OBSTACLE2_HEIGHT);
        objects.push(obj);
    }
    spawnTimer = 0;
    spawnMax = Math.floor(Math.random() * 1000) + 500;
}

function gameLoop(timestamp) {
    var deltaTime = timestamp - lastTime; //Use this when time is needed for other functions
    lastTime = timestamp;
    input();
    if (!gameOver && !paused) {
        shootTimer += deltaTime;
        spawnTimer += deltaTime;
        if (spawnTimer > spawnMax) {
            SpawnEnemy();
        }
        playerMovement(deltaTime);
        projectileMovement();
        objectMovement();
        draw();
        var j = 0;
        while (j < objects.length) {
            var check = collisionCheck(player, objects[j]);
            if (check) {
                gameOver = true;
                check = false;
            }
            
            var i = 0;
            // Checks all projectile x enemy collisions
            while (i < projectiles.length) {
                if (j < objects.length) {
                    check = collisionCheck(projectiles[i], objects[j]);
                }
                if (check) {
                    console.log(typeof objects[j]);
                    if (objects[j].constructor.name == 'obstacle2') {
                        projectiles.splice(i, 1);
                    } else {
                        projectiles.splice(i, 1);
                        objects.splice(j, 1);
                        score++;
                    }
                    i = 0;
                    check = false;
                } else {
                    i++;
                }
            }
            j++;
        }
    } else if (gameOver && !displayScore) {
        displayScore = true;
        alert('Final Score: ' + score);
    }
    // Allows gameLoop to be called repeatedly
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);