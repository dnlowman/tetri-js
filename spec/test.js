/* Implementation */
var Point = function(x, y){
	this.x = x;
	this.y = y;
};
/* End of Point Object */

/*   Game Object */
var GameObject = function(width, height){
	this.shapes = [];
	this.gameWidth = width;
	this.gameHeight = height;
	this.gameGrid = [height];
	for(var h = 0; h < height; ++h){
		this.gameGrid[h] = [width];
	}
};

GameObject.prototype.initGameGrid = function(){
	for(var h = 0; h < this.gameHeight; ++h){
		for(var w = 0; w < this.gameWidth; ++w){
			this.gameGrid[w][h] = false;
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
				this.gameGrid[yPos][xPos] = true;
				shape.points.push(new Point(xPos, yPos));
			}
		}
	}
	this.shapes.push(shape);
};

GameObject.prototype.printGrid = function(){
	console.log('Width: ' + this.gameWidth);
	console.log('\n');
	for(var h = 0; h < this.gameHeight; ++h){
		var string = '';
		for(var w = 0; w < this.gameWidth; ++w){
			string += (this.gameGrid[h][w] == true) ? 'O' : '#';
		}
		console.log(string + '\n');
	}
};

GameObject.prototype.renderShapes = function(){
	var self = this;
	this.clearGrid();
	this.shapes.forEach(function(shape){
		shape.points.forEach(function(point){
			self.gameGrid[point.x][point.y] = true;
		});
	});
};

GameObject.prototype.clearGrid = function() {
	var self = this;
	this.shapes.forEach(function(shape){
		if(shape.landed == false)
		{
			shape.points.forEach(function(point){
				self.gameGrid[point.x][point.y] = false;
			});
		}
	});
};
/* End of Game Object */

/* Shape Base Object */
var Shape = function(game){
	this.game = game;
	this.landed = false;
	this.points = [];
	this.originalShape = [];
	this.positionX = 0;
	this.positionY = 0;
	this.drawStartX = 0;
	this.drawStartY = 0;
};

Shape.prototype.arePointsLegal = function(points){
	var self = this;
	try{
		points.forEach(function(point){
			if(point.x < 0 || point.x >= self.game.gameWidth || point.y < 0 || point.y >= self.game.gameHeight) throw "Point out of bounds";
			self.game.shapes.forEach(function(shape){
				if(self !== shape){
					shape.forEach(function(shapePoint){
						if(point.x == shapePoint.x && point.y == shapePoint.y) throw "Point collides with another shape";
					});
				}
			});
		});
	}
	catch(e){
		console.log(e);
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

Shape.prototype.incrementShapeY = function(delta) {
	if(this.landed == true) return;
	var potentialPositionY = this.positionY;
	var potentialPoints = this.points;

	var self = this;

	potentialPositionY += delta;
	
	try{
		potentialPoints.forEach(function(element){
		element.y += delta;
		if(element.y < 0 || element.y >= self.game.gameHeight) throw "Out of bounds";
			self.game.shapes.forEach(function(shape){
				if(self !== shape){
					shape.forEach(function(shapePoint){
						if(element.x == shapePoint.x && element.y == shapePoint.y) throw "Point collides with another shape";
					});
				}
			});
		});
	}catch(e){
		this.landed = true;
	}
	this.positionY = potentialPositionY;
	this.points = potentialPoints;
};

Shape.prototype.incrementShapeX = function(delta) {
	if(this.landed == true) return;
	var potentialPositionX = this.positionX;
	var potentialPoints = this.points;

	var self = this;

	potentialPositionX += delta;
	
	try{
		potentialPoints.forEach(function(element){
			element.x += delta;
			if(element.y < 0 || element.y >= self.game.gameHeight) throw "Out of bounds";
			self.game.shapes.forEach(function(shape){
				if(self !== shape){
					shape.forEach(function(shapePoint){
						if(element.x == shapePoint.x && element.y == shapePoint.y) throw "Point collides with another shape";
					});
				}
			});
		});
	}
	catch(e){
		this.landed = true;
	}
	this.positionY = potentialPositionY;
	this.points = potentialPoints;
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
};
JShape.prototype = Object.create(Shape.prototype);
JShape.prototype.constructor = JShape;
/* End of JShape Object */

/* Jasmine Descriptions */
describe("A new tetris game grid of size 10 x 22", function(){
	var game;

	beforeEach(function(){
		game = new GameObject(10, 22);
		spyOn(game, 'initGameGrid').and.callThrough();
		spyOn(game, 'addShape').and.callThrough();
		spyOn(game, 'renderShapes').and.callThrough();
	});

	it("should not have initialized the grid", function(){
	    // Act
	    game.initGameGrid();

	    // Assert
	    expect(game.initGameGrid.calls.any()).toEqual(true);
	    expect(game.gameGrid[0]).not.toEqual(null);
	});

	it("should then have initialized the grid with all grid values being false", function(){
		// Act
		game.initGameGrid();

		// Assert
		expect(game.gameGrid).toBeDefined();
		expect(game.initGameGrid.calls.count()).toEqual(1);
		expect(game.gameGrid[0][0]).toEqual(false);
		expect(game.gameGrid).not.toContain(true);
	});

	it("should have a method called renderShapes which renders all of the shapes on the grid", function(){
		// Arrange
		var shape = new TShape(game);
		game.addShape(shape);

		// Act
		game.renderShapes();

		// Assert
		expect(game.addShape).toHaveBeenCalled();
		expect(game.renderShapes).toHaveBeenCalled();
		expect(game.gameGrid[3][0]).toEqual(true);
		expect(game.gameGrid[4][0]).toEqual(true);
		expect(game.gameGrid[5][0]).toEqual(true);
		expect(game.gameGrid[4][1]).toEqual(true);
	});
});

describe("A T shape on the tetris grid facing down", function(){
	var game;
	var shape;

	beforeEach(function(){
		game = new GameObject(10, 22);
		shape = new TShape(game);
		spyOn(game, 'initGameGrid').and.callThrough();
		spyOn(game, 'addShape').and.callThrough();
		spyOn(shape, 'rotateShape').and.callThrough();
		spyOn(shape, 'incrementShapeY').and.callThrough();
	});

	xit("it should be at position 4, 0 and when it is added the points should be in the correct position", function(){
		// Act
		game.addShape(shape);

		// Assert
		expect(game.addShape).toHaveBeenCalled();
		expect(shape.points[0].x).toBe(3);
		expect(shape.points[0].y).toBe(0);
		expect(shape.points[1].x).toBe(4);
		expect(shape.points[1].y).toBe(0);
		expect(shape.points[2].x).toBe(5);
		expect(shape.points[2].y).toBe(0);
		expect(shape.points[3].x).toBe(4);
		expect(shape.points[3].y).toBe(1);
	});

	xit("it should be at position 4, 0 and when it is rotated 90 degrees clockwise the rotation should fail as the new positions will be out of bounds", function(){
		// Arrange
		game.addShape(shape);
		
		// Act
		var result = shape.rotateShape();

		// Assert
		expect(result).toBe(false);
		expect(game.addShape).toHaveBeenCalled();
		expect(shape.rotateShape).toHaveBeenCalled();
		expect(shape.points[0].x).toBe(3);
		expect(shape.points[0].y).toBe(0);
		expect(shape.points[1].x).toBe(4);
		expect(shape.points[1].y).toBe(0);
		expect(shape.points[2].x).toBe(5);
		expect(shape.points[2].y).toBe(0);
		expect(shape.points[3].x).toBe(4);
		expect(shape.points[3].y).toBe(1);
	});

	it("it should be at position 4, 5 and when rotateShape is called the new points should be in the correct position", function(){
		// Arrange
		game.addShape(shape);
		
		// Act
		shape.incrementShapeY(5); // Increment the Y so we're in a valid position
		var result = shape.rotateShape();

		// Assert
		expect(result).toEqual(true);
		expect(game.addShape).toHaveBeenCalled();
		expect(shape.incrementShapeY).toHaveBeenCalled();
		expect(shape.rotateShape).toHaveBeenCalled();

		expect(shape.points[0].x).toBe(4);
		expect(shape.points[0].y).toBe(4);
		expect(shape.points[1].x).toBe(4);
		expect(shape.points[1].y).toBe(5);
		expect(shape.points[2].x).toBe(4);
		expect(shape.points[2].y).toBe(6);
		expect(shape.points[3].x).toBe(3);
		expect(shape.points[3].y).toBe(5);
	});
});