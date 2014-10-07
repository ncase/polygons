var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var TILE_SIZE = 60;
var PEEP_SIZE = 55;
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
			if(neighbours>0 && (same/neighbours)<0.33){
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
			ctx.translate(Math.random()*10-5,Math.random()*10-5);
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

var draggables;
function reset(){
	draggables = [];
	for(var x=0;x<10;x++){
		for(var y=0;y<10;y++){
			if(Math.random()<0.9){
				var draggable = new Draggable((x+0.5)*TILE_SIZE, (y+0.5)*TILE_SIZE);
				draggable.color = (Math.random()<0.5) ? "triangle" : "square";
				draggables.push(draggable);
			}
		}
	}
}
reset();

function render(){
	if(assetsLeft>0) return;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i=0;i<draggables.length;i++){
		draggables[i].update();
	}
	for(var i=0;i<draggables.length;i++){
		draggables[i].draw();
	}
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