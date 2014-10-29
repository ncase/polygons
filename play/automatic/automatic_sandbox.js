function changeRatio(value){
	window.RATIO_TRIANGLES = value;
	window.RATIO_SQUARES = 1-value;
	document.getElementById("ratio_text_triangles").innerHTML = Math.floor(window.RATIO_TRIANGLES*100)+"%";
	document.getElementById("ratio_text_squares").innerHTML = Math.floor(window.RATIO_SQUARES*100)+"%";
}
function changeEmpty(value){
	window.EMPTINESS = value;
	document.getElementById("empty_text").innerHTML = Math.floor(window.EMPTINESS*100)+"%";
}

changeRatio(document.getElementById("input_ratio").value);
changeEmpty(document.getElementById("input_empty").value);
