(function(exports){

	// Singleton
	var Mouse = {
		x: 0,
		y: 0,
		pressed: false
	};
	exports.Mouse = Mouse;

	var canvas = document.getElementById("canvas");

	// Event Handling
	var onMouseMove,onTouchMove;
	
	canvas.addEventListener("mousedown",function(event){
	    Mouse.pressed = true;
	    onMouseMove(event);
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("mouseup",function(event){
	    Mouse.pressed = false;
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("mousemove",onMouseMove = function(event){
		Mouse.x = event.pageX;
		Mouse.y = event.pageY;
		event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("touchstart",function(event){
	    Mouse.pressed = true;
	    onTouchMove(event);
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("touchend",function(event){
	    Mouse.pressed = false;
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("touchmove",onTouchMove = function(event){
		Mouse.x = event.changedTouches[0].clientX;
		Mouse.y = event.changedTouches[0].clientY;
		event.preventDefault();
	    event.stopPropagation();
	},false);


})(window);