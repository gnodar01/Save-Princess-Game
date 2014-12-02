var spriteRow = [60, 143, 226, 309];
var spriteColumn = [0,101,202,303,404,505,606,707];
var gemColors = ['images/Gem_Green.png', 'images/Gem_Green.png', 'images/Gem_Green.png',
 'images/Gem_Green.png', 'images/Gem_Green.png', 'images/Gem_Green.png', 'images/Gem_Blue.png',
  'images/Gem_Blue.png', 'images/Gem_Blue.png', 'images/Gem_Orange.png'];


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = spriteRow[Math.floor(Math.random()*4)];
    this.speed = Math.floor(Math.random()*5) + 1;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
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


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

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
    else if (direction === 'up' && this.y < 80) {
        spawnPlayer();
    }
    else if (direction === 'down' && this.y < 400) {
        this.y += 83;
    }
}
    

var Gem = function() {
    this.sprite = gemColors[Math.floor(Math.random()*10)];
    this.x = -100;
    this.y = spriteRow[Math.floor(Math.random()*4)];
    this.speed = Math.floor(Math.random()*5) + 1;
}

Gem.prototype.update = function(dt) {
   this.x += 50 * this.speed * dt;
    if (this.x > 808) {
        // Gem disappears
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
    this.y = spriteRow[Math.floor(Math.random()*4)];
}

Star.prototype.update = function(dt) {
    this.x * dt;
    this.y * dt;
}

Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


var firstEnemy = new Enemy;
var allEnemies = [firstEnemy];

var player = new Player;

var firstGem = new Gem;
var gem = [firstGem];

var star = new Star;


var killEnemy = function(enemyToKill) {
    var location = allEnemies.indexOf(enemyToKill)
    allEnemies.splice(location,1);
}

// Creates new enemy and pushes it to allEnemies array.
var spawnEnemy = function() {
    var enemyCreate = new Enemy;
    allEnemies.push(enemyCreate);
}



var spawnPlayer = function() {
    player = new Player;
}



var destroyGem = function(gemToDestroy) {
    var location = gem.indexOf(gemToDestroy)
    gem.splice(location,1);
}

var spawnGem = function() {
    var gemCreate = new Gem;
    gem.push(gemCreate);
}



var starAppear = function() {
    star.x = spriteColumn[Math.floor(Math.random() * 8)];

}

var starDisappear = function() {
    star.x = -100;
}


var gemsCollected = 0;
var score = 0;
var level = 1;
var lives = 3;



var checkCollisions = function(enemies,player,gems,star) {
    for (i in enemies) {
        if (((enemies[i].x - player.x) < 80) && ((player.x - enemies[i].x) < 80) && ((player.y - enemies[i].y) < 80) && ((enemies[i].y - player.y) < 80)) {
            spawnPlayer();
            lives--;
            console.log("lives left: " + lives);
        }
    }
    for (j in gems) {
        if (((gems[j].x - player.x) < 80) && ((player.x - gems[j].x) < 80) && ((player.y - gems[j].y) < 80) && ((gems[j].y - player.y) < 80)) {
            switch(gems[0].sprite) {
                case "images/Gem_Green.png":
                    score++;
                    break;
                case "images/Gem_Blue.png":
                    score+=2;
                    break;
                case "images/Gem_Orange.png":
                    score +=3
                    break;
            }
            gemsCollected++;
            console.log("gems collected: " + gemsCollected + "; score: " + score);
            destroyGem();
            spawnGem();
            if (gemsCollected % 10 === 0) {
                starAppear();
                destroyGem();
            }
        }
    }
    if (((star.x - player.x) < 80) && ((player.x - star.x) <80) && ((player.y - star.y) < 80) && ((star.y - player.y) < 80)) {
        starDisappear();
        spawnEnemy();
        spawnGem();
        score+=5;
        console.log("gems collected: " + gemsCollected + "; score: " + score);
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
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
