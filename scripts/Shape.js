"use strict";

/* Shape Base Object */
var Shape = function(game){
	this.game = game;
	this.sprites = [];
	this.landed = false;
	this.points = [];
	this.originalShape = [];
	this.positionX = 0;
	this.positionY = 0;
	this.drawStartX = 0;
	this.drawStartY = 0;
	this.color = 1;
};

Shape.prototype.arePointsLegal = function(points){
	var self = this;
	try{
		points.forEach(function(point){
			if(point.x < 0 || point.x >= self.game.gameWidth || point.y < 0 || point.y >= self.game.gameHeight) throw "Point out of bounds";
	 		if(point.x >= 0 && point.x < self.game.gameWidth && point.y >= 0 && point.y < self.game.gameHeight)
	 		{
	 			if(self.game.gameGrid[point.x][point.y] == true) throw "Point collides with another shape";
	 		}
		});
	}
	catch(e){
		return false;
	}
	return true;
};

Shape.prototype.rotatePoints = function() {
	var newPoints = [];
	var self = this;
	this.points.forEach(function(element, index){
		var potentialPoints = [];
		var rotationMatrix = [[0, -1],
							  [1, 0]];
		var x = element.x - self.positionX;
		var y = element.y - self.positionY;
		var newX = (x * rotationMatrix[0][0]) + (y * rotationMatrix[0][1]);
		var newY = (x * rotationMatrix[1][0]) + (y * rotationMatrix[1][1]);
		newX += self.positionX;
		newY += self.positionY;
		newPoints.push(new Point(newX, newY));
	});
	return newPoints;
};

Shape.prototype.rotateShape = function() {
	var points = this.rotatePoints();
	if(this.arePointsLegal(points) == false) return false;
	this.points = points;
	return true;
};

Shape.prototype.incrementShapePosition = function(xDelta, yDelta) {
	if(this.landed == true) return;

	var potentialPositionX = this.positionX;
	var potentialPositionY = this.positionY;
	var potentialPoints = [];
	this.points.forEach(function(point){
		potentialPoints.push(new Point(point.x, point.y));
	});
	var self = this;
	var xOOB = false;
	var landedShape = null;
	var xTryMove = false;

	potentialPositionX += xDelta;
	potentialPositionY += yDelta;
	
	try{
		potentialPoints.forEach(function(element){
			element.x += xDelta;
			element.y += yDelta;
		});

		potentialPoints.forEach(function(element){
		 	if(element.y < 0 || element.y > self.game.gameHeight - 1)
	 		{
	 			throw "Y Out of bounds";
	 		}
		 	if(element.x < 0 || element.x > self.game.gameWidth - 1)
	 		{
	 			xOOB = true;
	 			throw "X Out of bounds";
	 		}

	 		if(element.x >= 0 && element.x < self.game.gameWidth && element.y >= 0 && element.y < self.game.gameHeight)
	 		{
	 			if(self.game.gameGrid[element.x][element.y] == true) throw "Point collides with another shape";
	 		}
		});

	}catch(e){
		console.log(e);
		console.log(xOOB);
		if(e == "Y Out of bounds" || e == "Point collides with another shape")
		{
			if(xDelta === 0)
			{
				this.landed = true;
				this.game.onShapeLanded();
				FRAME_INTERVAL = 1000;
			}
			else xTryMove = true;
		}
	}
	if(this.landed == false && xOOB == false && xTryMove == false)
	{
		this.positionX = potentialPositionX;
		this.positionY = potentialPositionY;
		this.points.length = 0;
		potentialPoints.forEach(function(point){
			self.points.push(new Point(point.x, point.y));
		});
	}
};
/* End of Shape Base Object */

/* TShape Object */
var TShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[true, true, true],
		   				  [false, true, false]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 3;
	this.drawStartY = 0;
	this.color = 0x9F00F0;
};
TShape.prototype = Object.create(Shape.prototype);
TShape.prototype.constructor = TShape;
/* End of TShape Object */

/* OShape Object */
var OShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[true, true],
		   				  [true, true]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 4;
	this.drawStartY = 0;
	this.color = 0x009999;
};
OShape.prototype = Object.create(Shape.prototype);
OShape.prototype.constructor = OShape;

OShape.prototype.rotateShape = function(){
	return false; // O shapes do not rotate...
};
/* End of OShape Object */

/* IShape Object */
var IShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[true, true, true, true]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 3;
	this.drawStartY = 0;
	this.color = 0x51E1FC;
};
IShape.prototype = Object.create(Shape.prototype);
IShape.prototype.constructor = IShape;
/* End of IShape Object */

/* SShape Object */
var SShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[false, true, true], 
					      [true, true, false]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 3;
	this.drawStartY = 0;
	this.color = 0xE93D1E;
};
SShape.prototype = Object.create(Shape.prototype);
SShape.prototype.constructor = SShape;
/* End of SShape Object */

/* ZShape Object */
var ZShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[true, true, false], 
					      [false, true, true]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 3;
	this.drawStartY = 0;
	this.color = 0x00FF00;
};
ZShape.prototype = Object.create(Shape.prototype);
ZShape.prototype.constructor = ZShape;
/* End of ZShape Object */

/* LShape Object */
var LShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[true, true, true], 
					      [true, false, false]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 3;
	this.drawStartY = 0;
	this.color = 0x0000FF;
};
LShape.prototype = Object.create(Shape.prototype);
LShape.prototype.constructor = LShape;
/* End of LShape Object */

/* JShape Object */
var JShape = function(game){
	Shape.call(this, game);
	this.originalShape = [[true, true, true], 
					      [false, false, true]];
	this.positionX = 4;
	this.positionY = 0;
	this.drawStartX = 3;
	this.drawStartY = 0;
	this.color = 0xF16EB9;
};
JShape.prototype = Object.create(Shape.prototype);
JShape.prototype.constructor = JShape;
/* End of JShape Object */