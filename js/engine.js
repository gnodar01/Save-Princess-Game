/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods player and enemy objects (defined in app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 808;
    canvas.height = 669;
    doc.body.appendChild(canvas);

    //Tracks x and y coordinates on canvas.
    canvas.addEventListener("mousedown", getPosition, false);

    function getPosition(event)
    {
      var x = event.clientX;
      var y = event.clientY;

      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;

      console.log("x:" + x + " y:" + y);
    } 

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get time delta information which is required if game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds, need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set lastTime variable, which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions(allEnemies,player,gem,star);
    }

    /* This is called by the update function  and loops through all of the
     * objects within allEnemies array, as defined in app.js, and calls
     * their update() methods. It will then call the update function for
     * player object. These update methods focus purely on updating
     * the data/properties related to  the object. Drawing is done in
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allRocks.forEach(function(rock) {
            rock.update();
        });
        allHearts.forEach(function(heart) {
            heart.update();
        });
        player.update();
        gem.forEach(function(gem) {
            gem.update(dt);
        });
        star.update();
        key.update();
        princess.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine).
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        ctx.fillRect(0,0,808,83);
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 4 of stone
                'images/stone-block.png',   // Row 2 of 4 of stone
                'images/stone-block.png',   // Row 3 of 4 of stone
                'images/stone-block.png',   // Row 4 of 4 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],

            rowOneImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/water-block.png',
                'images/stone-block.png',
                'images/water-block.png'
            ],
            numRows = 7,
            numCols = 8,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
         for (row = 0; row < 1; row++) {
            for(col = 0; col < numCols; col++) {
               ctx.drawImage(Resources.get(rowOneImages[col]), col * 101, row * 8); 
            }
         }


        for (row = 1; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * Using Resources helpers to refer to images
                 * to get the benefits of caching these images, since
                 * they're used over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions defined
     * on enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        allRocks.forEach(function(rock) {
            rock.render();
        });
        allHearts.forEach(function(heart) {
            heart.render();
        });
        player.render();
        gem.forEach(function(gem) {
            gem.render();
        });
        star.render();
        key.render();
        princess.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* GLoad all of the images needed to draw game level.
     * Then set init as the callback method, so that when
     * all of these images are properly loaded, game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/Rock.png',
        'images/Heart.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem_Green.png',
        'images/Gem_Blue.png',
        'images/Gem_Orange.png',
        'images/Star.png',
        'images/Key.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable
     * it can more easily be used from within app.js files.
     */
    global.ctx = ctx;
})(this);
