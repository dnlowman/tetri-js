"use strict";

/*   Game Object */
var GameObject = function(width, height){
	this.shapes = [];
	this.currentShape = null;
	this.gameWidth = width;
	this.gameHeight = height;
	this.gameGrid = [width];
	this.landedShapeSprites = [height];
	this.landedShapeSpritesColors = [height];
	for(var h = 0; h < height; ++h){
		this.gameGrid[h] = [width];
		this.landedShapeSprites[h] = [width];
		this.landedShapeSpritesColors[h] = [width];
	}
};

GameObject.prototype.initGameGrid = function(){
	for(var h = 0; h < this.gameHeight; ++h){
		for(var w = 0; w < this.gameWidth; ++w){
			this.gameGrid[w][h] = false;
			stage.addChild(createRectangle(w, h, 0x000000, 0x000000));
		}
	}
};

GameObject.prototype.addShape = function(shape){
	for(var y = 0; y < shape.originalShape.length; ++y){
		for(var x = 0; x < shape.originalShape[0].length; ++x){
			if(shape.originalShape[y][x] === true)
			{
				var yPos = shape.drawStartY + y;
				var xPos = shape.drawStartX + x;
				shape.points.push(new Point(xPos, yPos));
			}
		}
	}

	if(shape.arePointsLegal(shape.points) === true) { this.currentShape = shape; }
	else { console.log('Theres something there!'); }
};

GameObject.prototype.renderShapes = function(){
	var self = this;
	this.clearGrid();

	// Render Current Shape
	if(this.currentShape !== null)
	{
		this.currentShape.points.forEach(function(point){
			var rect = createRectangle(point.x, point.y, self.currentShape.color);
			self.currentShape.sprites.push(rect);
			stage.addChild(rect);
		});
	}
};

GameObject.prototype.clearGrid = function() {
	if(this.currentShape !== null){
		this.currentShape.sprites.forEach(function(element){
			stage.removeChild(element);
		});
	}
};

GameObject.prototype.gameTick = function(){
	if(this.currentShape !== null)
		this.currentShape.incrementShapePosition(0, 1);
};

GameObject.prototype.checkForRowCompletion = function(){
	var count = 0;
	for(var h = this.gameHeight - 1; h >= 0; --h){
		for(var w = 0; w < this.gameWidth; ++w)
		{
			if(this.gameGrid[w][h] == true) count++;
		}
		if(count === this.gameWidth)
		{ 
			this.clearRow(h);
		}
		count = 0;
	}
};

GameObject.prototype.clearRow = function(row){
	for(var w = 0; w < this.gameWidth; ++w)
	{
		this.gameGrid[w][row] = false;
		stage.removeChild(this.landedShapeSprites[w][row]);
		this.landedShapeSprites[w][row] = null;
		this.landedShapeSpritesColors[w][row] = -1;
	}
	this.moveRowsDown(row);
};

GameObject.prototype.moveRowsDown = function(rowDeleted)
{
	for(var h = rowDeleted - 1; h >= 0; --h)
	{
		for(var w = 0; w < this.gameWidth; ++w)
		{
			if(this.landedShapeSprites[w][h] != 10 && this.landedShapeSprites[w][h])
			{ 
				console.log('Landed Sprite Color: ' + this.landedShapeSprites[w][h].color);
				var x = this.landedShapeSprites[w][h].position.x;
				var y = this.landedShapeSprites[w][h].position.y;
				var color = this.landedShapeSpritesColors[w][h];
				this.gameGrid[w][h + 1] = true;
				var rect = createRectangle(w, h + 1, color);
				this.landedShapeSprites[w][h + 1] = rect;
				stage.addChild(rect);
				this.gameGrid[w][h] = false;
				stage.removeChild(this.landedShapeSprites[w][h]);
				this.landedShapeSprites[w][h] = null;
				this.landedShapeSpritesColors[w][h] = -1;
			}
		}
	}
};

GameObject.prototype.onShapeLanded = function(){
	var self = this;
	this.currentShape.points.forEach(function(point){
		self.gameGrid[point.x][point.y] = true;
		var rect = createRectangle(point.x, point.y, self.currentShape.color);
		self.landedShapeSprites[point.x][point.y] = rect;
		self.landedShapeSpritesColors[point.x][point.y] = self.currentShape.color;
		stage.addChild(rect);
	});

	this.currentShape.sprites.forEach(function(sprite){
		stage.removeChild(sprite);
	});
	this.currentShape = null;

	var rand = Math.floor((Math.random() * 7) + 1);

	switch(rand)
	{
		case 1:
		{
			this.addShape(new TShape(this));
			break;
		}

		case 2:
		{
			this.addShape(new OShape(this));
			break;
		}

		case 3:
		{
			this.addShape(new IShape(this));
			break;
		}

		case 4:
		{
			this.addShape(new SShape(this));
			break;
		}

		case 5:
		{
			this.addShape(new ZShape(this));
			break;
		}

		case 6:
		{
			this.addShape(new LShape(this));
			break;
		}

		case 7:
		{
			this.addShape(new JShape(this));
			break;
		}
	}
};
/* End of Game Object */