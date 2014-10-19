var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var stats_canvas = document.getElementById("stats_canvas");
var stats_ctx = stats_canvas.getContext("2d");

var BIAS = 0.33;
var TILE_SIZE = 30;
var PEEP_SIZE = 30;
var GRID_SIZE = 20;
var DIAGONAL_SQUARED = (TILE_SIZE+5)*(TILE_SIZE+5) + (TILE_SIZE+5)*(TILE_SIZE+5);

var assetsLeft = 4;
var onImageLoaded = function(){
	assetsLeft--;
};

var images = {};
images.happyTriangle = new Image();
images.happyTriangle.onload = onImageLoaded;
images.happyTriangle.src = "../img/happy_triangle.png";
images.sadTriangle = new Image();
images.sadTriangle.onload = onImageLoaded;
images.sadTriangle.src = "../img/sad_triangle.png";
images.happySquare = new Image();
images.happySquare.onload = onImageLoaded;
images.happySquare.src = "../img/happy_square.png";
images.sadSquare = new Image();
images.sadSquare.onload = onImageLoaded;
images.sadSquare.src = "../img/sad_square.png";

function Draggable(x,y){
	
	var self = this;
	self.x = x;
	self.y = y;
	self.gotoX = x;
	self.gotoY = y;

	var offsetX, offsetY;
	var pickupX, pickupY;
	self.pickup = function(){

		pickupX = (Math.floor(self.x/TILE_SIZE)+0.5)*TILE_SIZE;
		pickupY = (Math.floor(self.y/TILE_SIZE)+0.5)*TILE_SIZE;
		offsetX = Mouse.x-self.x;
		offsetY = Mouse.y-self.y;
		self.dragged = true;

		// Draw on top
		var index = draggables.indexOf(self);
		draggables.splice(index,1);
		draggables.push(self);

	};

	self.drop = function(){

		var potentialX = (Math.floor(Mouse.x/TILE_SIZE)+0.5)*TILE_SIZE;
		var potentialY = (Math.floor(Mouse.y/TILE_SIZE)+0.5)*TILE_SIZE;

		var spotTaken = false;
		for(var i=0;i<draggables.length;i++){
			var d = draggables[i];
			if(d==self) continue;
			var dx = d.x-potentialX;
			var dy = d.y-potentialY;
			if(dx*dx+dy*dy<10){
				spotTaken=true;
				break;
			}
		}

		if(spotTaken){
			self.gotoX = pickupX;
			self.gotoY = pickupY;
		}else{
			self.gotoX = potentialX;
			self.gotoY = potentialY;
		}

		self.dragged = false;

	}

	var lastPressed = false;
	self.update = function(){

		// Shakiness?
		self.shaking = false;
		if(!self.dragged){
			var neighbours = 0;
			var same = 0;
			for(var i=0;i<draggables.length;i++){
				var d = draggables[i];
				if(d==self) continue;
				var dx = d.x-self.x;
				var dy = d.y-self.y;
				if(dx*dx+dy*dy<DIAGONAL_SQUARED){
					neighbours++;
					if(d.color==self.color){
						same++;
					}
				}
			}
			if(neighbours>0){
				self.sameness = (same/neighbours);
			}else{
				self.sameness = 1;
			}
			if(neighbours>0 && self.sameness<BIAS){
				self.shaking = true;
			}
		}

		// Dragging
		if(!self.dragged){
			if(self.shaking && Mouse.pressed && !lastPressed){
				var dx = Mouse.x-self.x;
				var dy = Mouse.y-self.y;
				if(Math.abs(dx)<PEEP_SIZE/2 && Math.abs(dy)<PEEP_SIZE/2){
					self.pickup();
				}
			}
		}else{
			self.gotoX = Mouse.x - offsetX;
			self.gotoY = Mouse.y - offsetY;
			if(!Mouse.pressed){
				self.drop();
			}
		}
		lastPressed = Mouse.pressed;

		// Going to where you should
		self.x = self.x*0.5 + self.gotoX*0.5;
		self.y = self.y*0.5 + self.gotoY*0.5;

	};

	self.draw = function(){
		ctx.save();
		ctx.translate(self.x,self.y);
		if(self.shaking){
			ctx.translate(Math.random()*5-2.5,Math.random()*5-2.5);
		}
		var img;
		if(self.color=="triangle"){
			img = (self.shaking) ? images.sadTriangle : images.happyTriangle;
		}else{
			img = (self.shaking) ? images.sadSquare : images.happySquare;
		}
		ctx.drawImage(img,-PEEP_SIZE/2,-PEEP_SIZE/2,PEEP_SIZE,PEEP_SIZE);
		ctx.restore();
	};

}

window.START_SIM = false;

var draggables;
var STATS;
function reset(){

	STATS = {
		steps:0
	};
	START_SIM = false;

	stats_ctx.clearRect(0,0,stats_canvas.width,stats_canvas.height);

	draggables = [];
	for(var x=0;x<GRID_SIZE;x++){
		for(var y=0;y<GRID_SIZE;y++){
			if(Math.random()<0.9){
				var draggable = new Draggable((x+0.5)*TILE_SIZE, (y+0.5)*TILE_SIZE);
				draggable.color = (Math.random()<0.5) ? "triangle" : "square";
				draggables.push(draggable);
			}
		}
	}

	// Write stats for first time
	for(var i=0;i<draggables.length;i++){
		draggables[i].update();
	}
	writeStats();

}

var doneBuffer = 60;
function render(){

	if(assetsLeft>0) return;
	
	// Is Stepping?
	if(START_SIM){
		step();
	}

	// Draw
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i=0;i<draggables.length;i++){
		draggables[i].update();
	}
	for(var i=0;i<draggables.length;i++){
		draggables[i].draw();
	}

	// Done stepping?
	if(isDone()){
		doneBuffer--;
		if(doneBuffer==0){
			START_SIM = false;
			console.log("DONE");
		}
	}else if(START_SIM){
		
		STATS.steps++;
		doneBuffer = 60;

		// Write stats
		writeStats();

	}

}
var stats_text = document.getElementById("stats_text");

function writeStats(){

	// Average Sameness Ratio
	var total = 0;
	for(var i=0;i<draggables.length;i++){
		var d = draggables[i];
		total += d.sameness || 0;
	}
	var avg = total/draggables.length;
	if(isNaN(avg)) debugger;

	// Graph it
	stats_ctx.fillStyle = "#cc2727";
	var x = STATS.steps;
	var y = 270 - avg*270;
	stats_ctx.fillRect(x,y,1,5);

	// Text
	stats_text.innerHTML = "steps: "+STATS.steps+"<br>sameness: "+Math.floor(avg*100)+"%";

}

function isDone(){
	for(var i=0;i<draggables.length;i++){
		var d = draggables[i];
		if(d.shaking) return false;
	}
	return true;
}

function step(){

	// Get all shakers
	var shaking = [];
	for(var i=0;i<draggables.length;i++){
		var d = draggables[i];
		if(d.shaking) shaking.push(d);
	}

	// Pick a random shaker
	if(shaking.length==0) return;
	var shaker = shaking[Math.floor(Math.random()*shaking.length)];

	// Go through every spot, get all empty ones
	var empties = [];
	for(var x=0;x<GRID_SIZE;x++){
		for(var y=0;y<GRID_SIZE;y++){

			var spot = {
				x: (x+0.5)*TILE_SIZE,
				y: (y+0.5)*TILE_SIZE
			}

			var spotTaken = false;
			for(var i=0;i<draggables.length;i++){
				var d = draggables[i];
				var dx = d.gotoX-spot.x;
				var dy = d.gotoY-spot.y;
				if(dx*dx+dy*dy<10){
					spotTaken=true;
					break;
				}
			}

			if(!spotTaken){
				empties.push(spot);
			}

		}
	}

	// Go to a random empty spot
	var spot = empties[Math.floor(Math.random()*empties.length)];
	shaker.gotoX = spot.x;
	shaker.gotoY = spot.y;

}

////////////////////
// ANIMATION LOOP //
////////////////////
window.requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback){ window.setTimeout(callback, 1000/60); };
(function animloop(){
	requestAnimFrame(animloop);
	render();
})();

reset();