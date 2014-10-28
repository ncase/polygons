var playables = document.querySelectorAll("iframe[playable]");

window.onscroll = function(){
	var scrollY = window.scrollY;
	var innerHeight = window.innerHeight;
	for(var i=0;i<playables.length;i++){
		var p = playables[i];
		p.contentWindow.IS_IN_SIGHT = (p.offsetTop<scrollY+innerHeight && p.offsetTop+parseInt(p.height)>scrollY);
	}
};