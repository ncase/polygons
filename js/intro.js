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
	}

	// HEADER
	intro_background.contentWindow.SCROLL = scrollY;
	outro_background.contentWindow.SCROLL = document.body.clientHeight-(scrollY+innerHeight);

};

intro_background.focus();
intro_background.contentWindow.focus();

window.onload = function(){
	window.onscroll();
};

// Easter Egg
for(var i=0;i<playables.length;i++){
	var p = playables[i];
	p.contentWindow.SOLVE_MESSAGE = p.id;
}
window.showEasterEgg = function(id){
	
	var thing = document.querySelector(".easter_container#"+id);
	if(thing.getAttribute("show")) return;

	var pos = parseInt(thing.style.left);
	thing.style.left = (pos+window.innerWidth)+"px";
	thing.setAttribute("show",true);
	setTimeout(function(){
		thing.style.left = (pos)+"px";
	},500);

};