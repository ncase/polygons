(function(exports){

	// Singleton
	var Mouse = {
		x: 0,
		y: 0,
		pressed: false
	};
	exports.Mouse = Mouse;
	
	// Event Handling
	var onMouseMove,onTouchMove;
	
	document.body.addEventListener("mousedown",function(event){
	    Mouse.pressed = true;
	    onMouseMove(event);
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	document.body.addEventListener("mouseup",function(event){
	    Mouse.pressed = false;
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	document.body.addEventListener("mousemove",onMouseMove = function(event){
		Mouse.x = event.pageX - window.scrollX;
		Mouse.y = event.pageY - window.scrollY;
		event.preventDefault();
	    event.stopPropagation();

	},false);

	document.body.addEventListener("touchstart",function(event){
	    Mouse.pressed = true;
	    onTouchMove(event);
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	document.body.addEventListener("touchend",function(event){
	    Mouse.pressed = false;
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	document.body.addEventListener("touchmove",onTouchMove = function(event){
		Mouse.x = event.changedTouches[0].clientX - window.scrollX;
		Mouse.y = event.changedTouches[0].clientY - window.scrollY;
		event.preventDefault();
	    event.stopPropagation();
	},false);


})(window);