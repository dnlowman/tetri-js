var stage = new PIXI.Stage(0xFFFFFF);
var FRAME_INTERVAL = 1000;

(function () {
   'use strict';
    /* global PIXI, GameObject, TShape, console, requestAnimFrame */
	var renderer = PIXI.autoDetectRenderer(800, 600);

	var titleText = new PIXI.Text('TetriJS', { font: '50px Franklin Gothic', fill: 'white', stroke: 'black', strokeThickness: 5 });
	titleText.position.x = 230;
	stage.addChild(titleText);

	var subtitleText = new PIXI.Text('Programming by: Daniel Lowman\nLanguage Used: JavaScript\nLibraries Used: PIXI.js\nBuilt using: NPM, Yeoman, Jasmine & Gulp', { font: '16px Franklin Gothic', fill: 'black', stroke: 'black', strokeThickness: 0 });
	subtitleText.position.x = 238;
	subtitleText.position.y = 50;
	stage.addChild(subtitleText);

	var game = new GameObject(10, 22);
	game.initGameGrid();

	game.addShape(new TShape(game));
	game.renderShapes();

	document.body.appendChild(renderer.view);

	function animate() {
	    requestAnimFrame(animate);
		
		game.renderShapes();

	    if(Date.now() >= lastTime + FRAME_INTERVAL)
		{
			lastTime = Date.now();
			game.gameTick();
		}

		game.checkForRowCompletion();
	    renderer.render(stage);
	}

	requestAnimFrame(animate);

	var lastTime = Date.now();

	var KEYBOARD_LEFT_ARROW_KEY = 37;
	var KEYBOARD_RIGHT_ARROW_KEY = 39;
	var KEYBOARD_UP_ARROW_KEY = 38;
	var KEYBOARD_DOWN_ARROW_KEY = 40;

	$(document).keydown(function(event){
		if(FRAME_INTERVAL == 0) return;

		switch(event.which)
		{
			case KEYBOARD_LEFT_ARROW_KEY:
			{
				game.currentShape.incrementShapePosition(-1, 0);
				event.preventDefault();
				break;
			}

			case KEYBOARD_RIGHT_ARROW_KEY:
			{
				game.currentShape.incrementShapePosition(1, 0);
				event.preventDefault();
				break;
			}

			case KEYBOARD_UP_ARROW_KEY:
			{
				game.currentShape.rotateShape();
				event.preventDefault();
				break;
			}

			case KEYBOARD_DOWN_ARROW_KEY:
			{
				FRAME_INTERVAL = 0;
				event.preventDefault();
				break;
			}
		}
	});
}());