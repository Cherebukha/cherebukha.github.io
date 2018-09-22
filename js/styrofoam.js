var keys = {
	71: 'g',
	84: 't',
	89: 'y',
	74: 'j',
	75: 'k',
	70: 'f',
	67: 'c',
	78: 'n'
};

var styrofoam = ['g', 't', 'y', 'j', 'g', 'k', 'f', 'c', 'n']
var position = 0;
document.addEventListener('keydown', function(e) {
	var key = keys[e.keyCode];
	var requiredKey = styrofoam[position];
	if (key == requiredKey) {
		position++;
		if (position == styrofoam.length) {
			document.getElementById('styrofoam').play();
			position = 0;
		}
	} else {
		position = 0;
	}
});