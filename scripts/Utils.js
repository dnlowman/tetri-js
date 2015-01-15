var createRectangle = function(x, y, col, lineCol)
{
	'use strict';
	/* global PIXI, stage */
	var graphics = new PIXI.Graphics();
	graphics.position.x = x * 20;
	graphics.position.y = y * 20;
	graphics.beginFill((typeof(col) === 'undefined') ? 0xFFFF00 : col);
	graphics.lineStyle(1, (typeof(lineCol) === 'undefined') ? 0xFFFFFF : lineCol);
	graphics.drawRect(0, 0, 20, 20);
	stage.addChild(graphics);
	return graphics;
};