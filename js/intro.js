var playables = document.querySelectorAll("iframe[playable]");

var intro_background = document.getElementById("intro_background");
var outro_background = document.getElementById("outro_background");

window.onscroll = function(){

	// Playables - PAUSE & UNPAUSE
	var scrollY = window.pageYOffset;
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