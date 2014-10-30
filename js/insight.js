var playables = document.querySelectorAll("iframe[playable]");

var intro_background = document.getElementById("intro_background");

window.onscroll = function(){

	// Playables - PAUSE & UNPAUSE
	var scrollY = window.scrollY;
	var innerHeight = window.innerHeight;
	for(var i=0;i<playables.length;i++){
		var p = playables[i];
		p.contentWindow.IS_IN_SIGHT = (p.offsetTop<scrollY+innerHeight && p.offsetTop+parseInt(p.height)>scrollY);
	}

	// HEADER
	intro_background.contentWindow.SCROLL = scrollY;

};

intro_background.focus();
intro_background.contentWindow.focus();

window.onload = function(){
	window.onscroll();
};