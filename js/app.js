// Rows and columns associated with tiles for the main charecter to move on
var spriteRow = [60, 143, 226, 309];
var spriteColumn = [0,101,202,303,404,505,606,707];

// Gem resources; frequency associated with probability for that Gem to appear on screen
var gemColors = ['images/Gem_Green.png', 'images/Gem_Green.png', 'images/Gem_Green.png',
 'images/Gem_Green.png', 'images/Gem_Green.png', 'images/Gem_Green.png', 'images/Gem_Green.png',
  'images/Gem_Blue.png', 'images/Gem_Blue.png', 'images/Gem_Orange.png'];

// Gem counter
var gemsCollected = 0;

// Score Tracker
var score = 0;

// Tracker for player lives left
var lives = 3;

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for enemies, this uses
    // a helper to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = spriteRow[Math.floor(Math.random()*4)];
    this.speed = Math.floor(Math.random()*5) + 1;
}

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += 50 * this.speed * dt;
    if (this.x > 808) {
        // Kills enemy once off screen.
        killEnemy(this);
        // Makes new enemy once old one is off screen.
        spawnEnemy();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var Rock = function() {
    this.sprite = 'images/Rock.png';
    this.x;
    this.y = 0;
}

Rock.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var Heart = function() {
    this.sprite = 'images/Heart.png';
    this.x = 0;
    this.y = 0;
}

Heart.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Heart.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 50);
}


// player class
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = spriteColumn[Math.floor(Math.random()*8)];
    this.y = 390;
}

Player.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 0) {
        this.x -= 101;
    }
    else if (direction === 'right' && this.x < 700) {
        this.x += 101;
    }
    else if (direction === 'up' && this.y > 100) {
        this.y -= 83;
    }
    else if (direction === 'up' && this.y < 80 && this.x !== spriteColumn[1] && this.x !== spriteColumn[6]) {
        // If the player falls in the water they get respawned and lose a life.
        spawnPlayer();
        loseLife();
    }
    else if (direction === 'up' && this.x === spriteColumn[1] && key.x === 101) {
        // If the key has appeared, the player is allowed to grab it by pressing up on this tile
        getKey();
        score += 10;
        moveRockTwo();
    }
    else if (direction === 'up' && this.x === spriteColumn[6] && princess.x === 606) {
        // If the princess has appeared after grabbing the key, the player may press up and save her, and wins the game
        savePrincess();
        score += 20;
        allEnemies = [];
        console.log("You Win! Your score is: " + score);
    }
    else if (direction === 'down' && this.y < 400) {
        this.y += 83;
    }
}
    

var Gem = function() {
    // Generate random gem colors
    this.sprite = gemColors[Math.floor(Math.random()*10)];
    this.x = -100;
    // Place gem on random row
    this.y = spriteRow[Math.floor(Math.random()*4)];
    // Give gems random speed
    this.speed = Math.floor(Math.random()*5) + 1;
}

Gem.prototype.update = function(dt) {
   this.x += 50 * this.speed * dt;
    if (this.x > 808) {
        // Gem destroyed when it goes off screen
        destroyGem(this);
        // Makes new gem once old one is off screen.
        spawnGem();
    }
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var Star = function() {
    this.sprite = 'images/Star.png';
    this.x = -100;
    // Put star on random row
    this.y = spriteRow[Math.floor(Math.random()*4)];
}

Star.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var Key = function(dt) {
    this.sprite = 'images/Key.png';
    // Keep key off screen until player has gathered enough points to move the rock where it will then go
    this.x = -100;
    this.y = 0;
}

Key.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Key.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


var Princess = function(dt) {
    this.sprite = 'images/char-princess-girl.png';
    // Keep princess off screen until player has gathered key to move the rock where she will then go
    this.x = -100;
    this.y = 0;
}

Princess.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Princess.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Instantiate objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var firstEnemy = new Enemy;
var allEnemies = [firstEnemy];

var rockOne = new Rock;
rockOne.x = 101;

var rockTwo = new Rock;
rockTwo.x = 606;

var allRocks = [rockOne, rockTwo];

var heartOne = new Heart;
heartOne.x = 0;

var heartTwo = new Heart;
heartTwo.x = 50;

var heartThree = new Heart;
heartThree.x = 100;

var allHearts = [heartOne, heartTwo, heartThree];

var player = new Player;

var firstGem = new Gem;
var gem = [firstGem];

var star = new Star;

var key = new Key;

var princess = new Princess;


// Stops all enemys and gems from moving (for after player wins game)
var stopEnteties = function() {
    allEnemies.forEach(function(enemy) {
        enemy.speed = 0;
    });
    gems.forEach(function(gem) {
        gem.speed = 0;
    })
}


// enemeies are killed when they go off screen or when player wins game
var killEnemy = function(enemyToKill) {
    var location = allEnemies.indexOf(enemyToKill)
    allEnemies.splice(location,1);
}

// Creates new enemy and pushes it to allEnemies array.
var spawnEnemy = function() {
    var enemyCreate = new Enemy;
    allEnemies.push(enemyCreate);
}

var loseLife = function() {
    if (lives > 1) {
        lives--;
        allHearts.pop();
    }
    else {
        reset();
    }
}

var spawnPlayer = function() {
    player = new Player;
}

// Gems are destroyed when the go off screen, the player collects one, or when the star appears
var destroyGem = function(gemToDestroy) {
    var location = gem.indexOf(gemToDestroy)
    gem.splice(location,1);
}

var spawnGem = function() {
    var gemCreate = new Gem;
    gem.push(gemCreate);
}

var starAppear = function() {
    // Put star on random tile
    star.x = spriteColumn[Math.floor(Math.random() * 8)];
}

var starDisappear = function() {
    star.x = -100;
}

var moveRockOne = function() {
    var keyRock = allRocks[0];
    keyRock.x += 101;
    // Place key where rock was so it appears as though it was hidden underneath
    key.x = 101
}

var moveRockTwo = function() {
    var princessRock = allRocks[1];
    // Place princess where rock was so it appears that she was behind the rock
    princessRock.x += 101;
    princess.x = 606;
}

var getKey = function() {
    key.x = -100;
}

var savePrincess = function() {
    princess.x = player.x - 100;
    princess.y = player.y;
}

var reset = function() {
    spawnPlayer();
    allEnemies = [firstEnemy];
    gem = [firstGem];
    rockOne.x = 101;
    rockTwo.x = 606;
    allHearts = [heartOne, heartTwo, heartThree];
    key.x = -100;
    princess.x = -100;
    star.x = -100;
    lives = 3;
    score = 0;
    gemsCollected = 0; 
}

// Checks if player is overlaping with any game elements, and assigns results accordingly
var checkCollisions = function(enemies,player,gems,star) {
    for (i in enemies) {
        if (((enemies[i].x - player.x) < 80) && ((player.x - enemies[i].x) < 80) && ((player.y - enemies[i].y) < 80) && ((enemies[i].y - player.y) < 80)) {
            spawnPlayer();
            loseLife();
        }
    }
    for (j in gems) {
        if (((gems[j].x - player.x) < 80) && ((player.x - gems[j].x) < 80) && ((player.y - gems[j].y) < 80) && ((gems[j].y - player.y) < 80)) {
            switch(gems[0].sprite) {
                case "images/Gem_Green.png":
                    // Common green gems are 1 point
                    score++;
                    break;
                case "images/Gem_Blue.png":
                    // Less common blue gems are 2 points
                    score+=2;
                    break;
                    // Rare orange gems are 3 points
                case "images/Gem_Orange.png":
                    score +=3
                    break;
            }
            gemsCollected++;
            destroyGem();
            spawnGem();
            // For every gem collected, the number of enemies on screen goes up by 1, making the game iteratively more difficult
            spawnEnemy();
            // If 8 gems are collected, the star appears
            if (gemsCollected % 8 === 0) {
                starAppear();
                destroyGem();
            }
        }
    }
    if (((star.x - player.x) < 80) && ((player.x - star.x) <80) && ((player.y - star.y) < 80) && ((star.y - player.y) < 80)) {
        starDisappear();
        // Move rock on left side (and spawn the key)
        moveRockOne();
        score+=5;
    }
}


// This listens for key presses and sends the keys to 
// Player.handleInput() method
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Prevents window scrolling using up/down keys.
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
