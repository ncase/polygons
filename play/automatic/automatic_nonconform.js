var nonconform_text = document.getElementById("nonconform_text");
function changeNonconform(value){
	START_SIM = false;
	window.writeStats();
	window.NONCONFORM = parseFloat(value);
	nonconform_text.innerHTML = Math.floor(window.NONCONFORM*100)+"%";
}