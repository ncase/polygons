var bias_text = document.getElementById("bias_text");
function changeBias(value){
	START_SIM = false;
	window.writeStats();
	window.BIAS = parseFloat(value);
	bias_text.innerHTML = Math.floor(window.BIAS*100)+"%";
}

window.BIAS = parseFloat(document.getElementById("input_bias").value);
bias_text.innerHTML = Math.floor(window.BIAS*100)+"%";