// Create board
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var W = 50;
var H = 50;
var GRID_WIDTH = 8;
var GRID_HEIGHT = 8;

var SELF_LOWER_LIMIT = 0.33;
var SELF_UPPER_LIMIT = 1.0;
var EMPTY_RATIO = 0.2;

var images = {};
images.happyTriangle = new Image();
images.happyTriangle.src = "img/happy_triangle.png";
images.sadTriangle = new Image();
images.sadTriangle.src = "img/sad_triangle.png";
images.happySquare = new Image();
images.happySquare.src = "img/happy_square.png";
images.sadSquare = new Image();
images.sadSquare.src = "img/sad_square.png";

// PLACING PEEPS //
// 20% empty. And of the rest, 50% black, 50% white.

function Peep(){
	var self = this;

	self.getNeighbor = function(dx,dy){
		var row = grid[self.y+dy]
		if(!row) return null;
		var peep = row[self.x+dx];
		if(!peep) return null;
		return peep;
	};
	self.getNeighbors = function(){
		var neighbors = [];
		for(var y=-1;y<=1;y++){
			for(var x=-1;x<=1;x++){
				if(x==0 && y==0) continue;
				var neighbor = self.getNeighbor(x,y);
				if(neighbor) neighbors.push(neighbor);
			}
		}
		return neighbors;
	}

	self.getSameRatio = function(){

		var neighbors = self.getNeighbors();
		if(neighbors.length==0) return 0.5; // hack...

		var sameType = 0;
		for(var i=0;i<neighbors.length;i++){
			if(neighbors[i].type==self.type){
				sameType++;
			}
		}

		var sameRatio = sameType/neighbors.length;
		return sameRatio;

	};
	self.isHappy = function(sameRatio){
		return (sameRatio>=SELF_LOWER_LIMIT && sameRatio<=SELF_UPPER_LIMIT);
	}
	self.draw = function(ctx){
		if(self.isHappy(self.getSameRatio())){
			ctx.drawImage(self.happyImage, self.x*W, self.y*H, W, H);
		}else{
			ctx.drawImage(self.sadImage, self.x*W + Math.random()*6-3, self.y*H + Math.random()*6-3, W, H);
			//ctx.drawImage(self.sadImage, self.x*W, self.y*H, W, H);
		}
	}
}
function TrianglePeep(){

	var self = this;
	Peep.call(self);
	self.type = "TRIANGLE";

	self.happyImage = images.happyTriangle;
	self.sadImage = images.sadTriangle;
}
function SquarePeep(){

	var self = this;
	Peep.call(self);
	self.type = "SQUARE";
	
	self.happyImage = images.happySquare;
	self.sadImage = images.sadSquare;

}

// POPULATE GRID

var grid = [];
for(var y=0;y<GRID_HEIGHT;y++){
	var row = [];
	grid.push(row);
	for(var x=0;x<GRID_WIDTH;x++){
		//var peep = ((x+y)%2==0) ? new TrianglePeep() : new SquarePeep();
		var peep = (Math.random()>0.5) ? new TrianglePeep() : new SquarePeep();
		peep.x = x;
		peep.y = y;
		row.push(peep);
	}
}

// REMOVE THINGS

var removeThisMany = Math.floor((GRID_WIDTH*GRID_HEIGHT)*EMPTY_RATIO);
while(removeThisMany>0){
	var randomX = Math.floor(Math.random()*GRID_WIDTH);
	var randomY = Math.floor(Math.random()*GRID_HEIGHT);
	var peep = grid[randomY][randomX];
	if(!peep) continue;
	grid[randomY][randomX] = null;
	removeThisMany--;
}

var ratioAverage = 0;
function shuffle(){

	var ratioTotal = 0;
	var ratioNum = 0;
	var unhappies = [];
	var empties = [];
	for(var y=0;y<GRID_HEIGHT;y++){
		for(var x=0;x<GRID_WIDTH;x++){
			var peep = grid[y][x];
			if(!peep){
				empties.push([x,y]);
				continue;
			}
			var ratio = peep.getSameRatio();
			ratioTotal += ratio;
			ratioNum++;
			if(!peep.isHappy(ratio)){
				unhappies.push(peep);
			}
		}
	}

	if(unhappies.length==0){
		ratioAverage = ratioTotal/ratioNum;
		return true;
	}

	var peep = unhappies[Math.floor(Math.random()*unhappies.length)];
	var empty = empties[Math.floor(Math.random()*empties.length)];

	grid[peep.y][peep.x] = null;
	peep.x = empty[0];
	peep.y = empty[1];
	grid[peep.y][peep.x] = peep;

	return false;


};

window.onclick = function(){
	var interval = setInterval(function(){
		var done = shuffle();
		if(done){
			clearInterval(interval);
			SELF_LOWER_LIMIT = 0.2;
			SELF_UPPER_LIMIT = 0.8;
			alert("DONE - Sameratio: "+Math.round(ratioAverage*100)+"%");
		}
	},10);
};

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;

function step(){

	ctx.clearRect(0,0,800,500);

	for(var y=0;y<GRID_HEIGHT;y++){
		for(var x=0;x<GRID_WIDTH;x++){
			var peep = grid[y][x];
			if(!peep) continue;
			peep.draw(ctx);
		}
	}
	requestAnimationFrame(step);
}
step();