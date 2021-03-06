var canvas, context, centerX, centerY, intensity = 0, intensityMod = 0.0005, diff, size, oldSize, degree = 0, modDegree = 1, triMod = 0, rotDirection = 1, cooldown = [0, 0];
var file, audio, files = 0, audioCtx, src, analyser, bufferLength, bar, dataArray;
var priHue = 215, secHue = 315, floatHue = priHue + 10, modHue = 1, color = new Array, lightness = [15, 5], tempLightness;
var a, b;

function initPage() {
	file = document.getElementById('thefile');
	audio = document.getElementById('audio');
	canvas = document.getElementById('myCanvas');
	debugInput = document.getElementById('debugInput');
	intensityInput = document.getElementById('intensityInput');
	colorCooldown = document.getElementById('colorCooldown');
	directionCooldown = document.getElementById('directionCooldown');
	player = document.getElementById('player');
	playerMessage = document.getElementById('playerMessage');
	settings = document.getElementById('settings');
	abRepeat = document.getElementById('abRepeat');
	checkmark = document.getElementsByClassName('checkmark');
	aInput = document.getElementById('aInput');
	bInput = document.getElementById('bInput');
	progressBar = document.getElementById('progressBar');
	handle = document.getElementById('handle');
	fillBar = document.getElementById('fill');
	bass = document.getElementById('bass');
	time = document.getElementById('time');
	hideIcon = document.getElementById('hideIcon');

	context = canvas.getContext("2d");
	// canvas.addEventListener('contextmenu', event => event.preventDefault()); // Prevent context menu from appearing at clicking the RMB on canvas
	centerX = canvas.width / 2;
	centerY = canvas.height / 2;
	audioCtx = new AudioContext();
	src = audioCtx.createMediaElementSource(audio);
	analyser = audioCtx.createAnalyser();
	src.connect(analyser);
	analyser.connect(audioCtx.destination);
	analyser.fftSize = 2048;
	analyser.smoothingTimeConstant = 0.3; // God blessed property
	bufferLength = analyser.frequencyBinCount;
	bar = bufferLength / 1.8;
	dataArray = new Uint8Array(bufferLength);
	drawHex();
	audio.addEventListener('ended', function() {
		audio.currentTime = 0;
		playerMessage.innerHTML = 'Stopped';
	});
	audio.addEventListener('timeupdate', function() {
		var position = audio.currentTime / audio.duration;
		fillBar.style.width = position * 100 + '%';
		if (convertTime(audio.duration) !== 'NaN:NaN') {
			document.getElementById('currentTime').innerHTML = convertTime(audio.currentTime);
			document.getElementById('totalTime').innerHTML = convertTime(audio.duration);
		}
	});
}

/* Rotate triangle with mouse wheel (pointless yet possible) */
$(document).bind('mousewheel', function(e) {
	if (triMod == 360 || triMod == -360) triMod = 0;
	if(e.originalEvent.wheelDelta < 0) {triMod -= 5} else {triMod += 5};
	return false;
})

function dropHandler(ev) {
	ev.preventDefault();
	abRepeat.checked = false;
	if (ev.dataTransfer.items) {
		for (var l = 0; l < ev.dataTransfer.items.length; l++) {
			if (ev.dataTransfer.items[l].kind === 'file') {
				file = ev.dataTransfer.items[l].getAsFile();
			}
		}
	}
	audio.src = URL.createObjectURL(file);
	audio.currentTime = 0;
	playAudio();
	removeDragData(ev);
}

function dragOverHandler(ev) {
	ev.preventDefault();
}

function removeDragData(ev) {
	if (ev.dataTransfer.items) {
		ev.dataTransfer.items.clear();
	} else {
		ev.dataTransfer.clearData();
	}
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	centerX = canvas.width / 2;
	centerY = canvas.height / 2;
}

function degreesToRadians(degrees) {
	return (degrees * Math.PI)/180;
}

function drawTri() {
	context.beginPath();
	context.lineTo(centerX + (size * 2) * Math.cos(3* Math.PI / 6 + degreesToRadians(degree + triMod)), centerY + (size * 2) * Math.sin(3 * Math.PI / 6 + degreesToRadians(degree + triMod)));
	context.lineTo(centerX + (size * 1.8) * Math.cos(2.8 * Math.PI / 6 + degreesToRadians(degree + triMod)), centerY + (size * 1.8) * Math.sin(2.8 * Math.PI / 6 + degreesToRadians(degree + triMod)));
	context.lineTo(centerX + (size * 1.8) * Math.cos(3.2 * Math.PI / 6 + degreesToRadians(degree + triMod)), centerY + (size * 1.8) * Math.sin(3.2 * Math.PI / 6 + degreesToRadians(degree + triMod)));
	context.fillStyle = color[2];
	context.fill();
}

function modifyColor() {
	/*intensityInput.style.border = '2px solid '+color[2];
	intensityInput.style.backgroundColor = color[3];*/
	intensityInput.style.color = color[2];
	colorCooldown.style.color = color[2];
	directionCooldown.style.color = color[2];
	player.style.borderColor = color[2];
	player.style.backgroundColor = color[4];
	player.style.color = color[2];
	settings.style.border = '2px solid '+color[2];
	settings.style.backgroundColor = color[4];
	settings.style.color = color[2];
	checkmark[0].style.border = '1px solid '+color[2];
	checkmark[0].style.backgroundColor = color[4];
	checkmark[1].style.border = '1px solid '+color[2];
	checkmark[1].style.backgroundColor = color[4];
	aInput.style.border = '1px solid '+color[2];
	aInput.style.backgroundColor = color[4];
	aInput.style.color = color[2];
	bInput.style.border = '1px solid '+color[2];
	bInput.style.backgroundColor = color[4];
	bInput.style.color = color[2];
	progressBar.style.backgroundColor = color[3];
	/*handle.style.backgroundColor = color[2];*/
	fillBar.style.backgroundColor = color[2];
	time.style.color = color[2];
	hideIcon.style.fill = color[2];
}

function toggleCheckboxStyle(checkbox, n) {
	if (checkbox.checked == true) checkmark[n].innerHTML = '+';
	else checkmark[n].innerHTML = '';
}

function repeatAudio() {
	if (abRepeat.checked == true && a >= b) 
		{
			abRepeat.checked = false;
			console.log('Error: A is more or equal to B');
		}
	if (abRepeat.checked == true && audio.currentTime >= b) {
		audio.currentTime = a;
		console.log('currentTime = '+a);
	}
}

/*function setPoint() {
	a = aInput.value;
	b = bInput.value;
}*/
function setA() {
	a = audio.currentTime;
	aInput.value = a;
}
function setB() {
	b = audio.currentTime;
	bInput.value = b;
}

function toggleBass() {
	if(bass.checked == true){
		bar = 20;
		intensityMod = 0.025;
		analyser.minDecibels = -50;
		analyser.maxDecibels = -20;
		analyser.smoothingTimeConstant = 0.6;
	} else {
		bar = bufferLength / 1.8;
		intensityMod = 0.0005;
		analyser.minDecibels = -100;
		analyser.maxDecibels = -30;
		analyser.smoothingTimeConstant = 0.3;
	}
}

function convertTime(inputSeconds) {
	var seconds = Math.floor(inputSeconds % 60);
	if (seconds < 10) seconds = '0' + seconds;
	var minutes = Math.floor(inputSeconds / 60);
	return minutes + ':' + seconds;
}

function seekForward() {
	audio.currentTime += 5;
}

function seekBackward() {
	audio.currentTime -= 10; // !!!
}

function hideUI() {
	$('#settings').toggle();
	$('#player').toggle();
	$('#progressBar').toggle();
	$('#time').toggle();
	$('#debugInput').toggle();
}

function drawHex() {
	window.onresize = resizeCanvas();
	if (degree == 360 || degree == -360) degree = 0; // Preventing the variable from reaching huge numbers
	requestAnimationFrame(drawHex);
	requestAnimationFrame(drawTri);
	if (file !== 0) analyser.getByteFrequencyData(dataArray); // Otherwise function returns an error
	// Pulse power (hexagon size) calculation -----------
	for (var i = 0; i < bar; i++) {
		intensity += Math.min(99999, Math.max((dataArray[i] * 2.5 - 200), 0));
	}
	repeatAudio();
	oldSize = size;
	size = 100 + (intensity * intensityMod);
	diff = size - oldSize;
	intensityInput.value = intensity.toFixed(0); // For debug purposes
	if (rotDirection < 0) modDegree = rotDirection + (-1 *(intensity * (intensityMod / 50)));  // !!!
	else modDegree = rotDirection + (intensity * (intensityMod / 50));                         // !!!
	degree += modDegree;
	intensity = 0;
	// --------------------------------------------------
	// Hue looping; background color switch -------------
	if (floatHue <= priHue && modHue < 0 || floatHue >= secHue && modHue > 0) modHue = -modHue;
	floatHue = floatHue + modHue;
	color[0] = 'hsl('+floatHue+', 80%, '+lightness[0]+'%)';
	color[1] = 'hsl('+floatHue+', 80%, '+lightness[1]+'%)';
	color[2] = 'hsl('+floatHue+', 80%, 80%)';
	color[3] = 'hsl('+floatHue+', 80%, 15%)';
	color[4] = 'hsl('+floatHue+', 80%, 5%)';
	if (diff > 24 & cooldown[0] == 0) {
		tempLightness = lightness[1];
		lightness[1] = lightness[0];
		lightness[0] = tempLightness;
		cooldown[0] = 35;
	}
	if (diff > 32 & cooldown[1] == 0) {
		rotDirection = -rotDirection;  // Change rotating direction
		cooldown[1] = 200;
	}
	if (cooldown[0] > 0) cooldown[0]--;
	if (cooldown[1] > 0) cooldown[1]--;
	colorCooldown.value = cooldown[0];
	directionCooldown.value = cooldown[1];
	// --------------------------------------------------
	modifyColor();
	drawTri();
	// Draw background
	for (j = 0; j < 7; j++) {
		context.beginPath();
		context.moveTo(centerX, centerY);
		context.lineTo(centerX + canvas.width * Math.cos(j * 2 * Math.PI / 6 + degreesToRadians(degree)), centerY + canvas.width * Math.sin(j * 2 * Math.PI / 6 + degreesToRadians(degree)));
		context.lineTo(centerX + canvas.width * Math.cos((j + 1) * 2 * Math.PI / 6 + degreesToRadians(degree)), centerY + canvas.width * Math.sin((j + 1) * 2 * Math.PI / 6 + degreesToRadians(degree)));
		if (j % 2 == 0) {
			// context.fillStyle = "rgba(30, 30, 30, 1)";
			context.fillStyle = color[0];
		} else {
			//context.fillStyle = "rgba(100, 100, 100, 1)";
			context.fillStyle = color[1];
		}
		context.fill();
	}
	// --------------------------------------------------
	// Draw hexagon -------------------------------------
	context.moveTo(centerX, centerY);
	context.beginPath();
	context.lineWidth = 6;
	context.strokeStyle = color[2];
	for (k = 0; k < 7; k++) {
		context.lineTo(centerX + size * Math.cos(k * 2 * Math.PI / 6 + degreesToRadians(degree)), centerY + size * Math.sin(k * 2 * Math.PI / 6 + degreesToRadians(degree)));
	}
	context.fillStyle = color[4];
	context.fill();
	context.stroke();
	// --------------------------------------------------
}

function playAudio() {
	if (file === null) return;
	playerMessage.classList.remove('flashing');
	if (audio.paused) {
		playerMessage.innerHTML = 'Playing';
		audio.play();
	} else {
		playerMessage.innerHTML = 'Paused';
		audio.pause();
	}
}
