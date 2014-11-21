var playables = document.querySelectorAll("iframe[playable]");

var intro_background = document.getElementById("intro_background");
var outro_background = document.getElementById("outro_background");

window.onscroll = function(){

	// Playables - PAUSE & UNPAUSE
	var scrollY = window.scrollY;
	var innerHeight = window.innerHeight;
	for(var i=0;i<playables.length;i++){
		var p = playables[i];
		p.contentWindow.IS_IN_SIGHT = (p.offsetTop<scrollY+innerHeight && p.offsetTop+parseInt(p.height)>scrollY);
		//p.contentWindow.IS_IN_SIGHT = false;
	}

	// HEADER
	intro_background.contentWindow.SCROLL = scrollY;
	outro_background.contentWindow.SCROLL = document.body.clientHeight-(scrollY+innerHeight);
	//intro_background.contentWindow.SCROLL = 700;
	//outro_background.contentWindow.SCROLL = 700;

};

intro_background.focus();
intro_background.contentWindow.focus();

window.onload = function(){
	window.onscroll();
};

// Easter Egg
/**
var cartoon_container = document.getElementById("cartoon_container");
var cartoon = document.getElementById("cartoon");
var cartoons = document.querySelectorAll("span[cartoon]");
for(var i=0; i<cartoons.length; i++){
	(function(c){
		c.onmouseover = function(){
			cartoon.src = "cartoons/"+c.getAttribute("cartoon");
			cartoon_container.style.display = "block";
		};
		c.onmousemove = function(){
			cartoon_container.style.top = (Mouse.y+40)+"px";
			cartoon_container.style.left = (Mouse.x-100)+"px";
		};
		c.onmouseout = function(){
			cartoon_container.style.display = "none";
		};
	})(cartoons[i]);
};
**/