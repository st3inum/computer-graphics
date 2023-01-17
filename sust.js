// config
var height = 500, width = 1200;
canvas = document.getElementById('canvas2');
canvas.height = height;
canvas.width = width;
context = canvas.getContext('2d', {alpha: false, willReadFrequently: true}); // we removed alpha layert
context.fillStyle = 'white';
context.fillRect(0, 0, width, height);

// basic function
function isEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function arrayToColor(color) { return 'rgba(' + color.toString() + ')'; }
function set(x, y, color, size = 1) {
	x = Math.round(x);
	y = Math.round(y);
	if(typeof(color) !== 'string') color = arrayToColor(color);
	context.fillStyle = color;
	context.fillRect(x, y, size, size);
}
function get(x, y) { return Array.from(context.getImageData(Math.round(x), Math.round(y), 1, 1).data); }

function BresenhamLineLow(x0, y0, x1, y1, color = 'black', size = 1, gap = 1000000000) {
	var dx = x1 - x0;
	var dy = y1 - y0;
	var yi = 1;
	if(dy < 0) {
		yi = -1;
		dy = -dy;
	}
	var D = (2 * dy) - dx;
	var y = y0;
	var counter = 0, toggleState = 1;
	for(var x = x0; x <= x1; x++) {
		counter++;
		if(counter >= gap) {
			toggleState = 1 - toggleState;
			counter = 0;
		}
		if(toggleState == 1)set(x, y, color, size);
		if(D > 0) {
			y = y + yi;
			D = D + (2 * (dy - dx));
		} else {
			D = D + 2 * dy;
		}
	}
}

function BresenhamLineHigh(x0, y0, x1, y1, color = 'black', size = 1, gap = 1000000000) {
	var dx = x1 - x0;
	var dy = y1 - y0;
	var xi = 1;
	if(dx < 0) {
		xi = -1;
		dx = -dx;
	}
	var D = (2 * dx) - dy;
	var x = x0;
	var counter = 0, toggleState = 1;
	for(var y = y0; y <= y1; y++) {
		counter++;
		if(counter >= gap) {
			toggleState = 1 - toggleState;
			counter = 0;
		}
		if(toggleState == 1)set(x, y, color, size);
		if(D > 0) {
			x = x + xi;
			D = D + (2 * (dx - dy));
		} else {
			D = D + 2 * dx;
		}
	}
}

function BresenhamLine(x0, y0, x1, y1, color = 'black', size = 1, gap = 1000000000) {
	if(Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
		if(x0 > x1) {
			BresenhamLineLow(x1, y1, x0, y0, color, size, gap);
		} else {
			BresenhamLineLow(x0, y0, x1, y1, color, size, gap);
		}
	} else {
		if(y0 > y1) {
			BresenhamLineHigh(x1, y1, x0, y0, color, size, gap);
		} else {
			BresenhamLineHigh(x0, y0, x1, y1, color, size, gap);
		}
	}
}

function sust() {
	var sx = 500, sy = 300, d = 80;
	BresenhamLine(sx, sy, sx + d, sy - d);
	BresenhamLine(sx, sy, sx + d, sy, 'black', 1, 5);
	BresenhamLine(sx, sy + d, sx + d, sy);

	BresenhamLine(sx + d * 2, sy - d, sx + d * 2, sy + d);
	BresenhamLine(sx + d * 3, sy - d, sx + d * 3, sy + d);
	BresenhamLine(sx + d * 2, sy + d, sx + d * 3, sy + d);

	BresenhamLine(sx + d * 4, sy - d, sx + d * 5, sy - d);
	BresenhamLine(sx + d * 4, sy, sx + d * 5, sy);
	BresenhamLine(sx + d * 4, sy + d, sx + d * 5, sy + d);
	BresenhamLine(sx + d * 4, sy - d, sx + d * 4, sy);
	BresenhamLine(sx + d * 5, sy, sx + d * 5, sy + d);

	BresenhamLine(sx + d * 6, sy - d, sx + d * 7, sy - d, 'black', 1, 3);
	BresenhamLine(sx + d * 6.5, sy - d, sx + d * 6.5, sy + d, 'black', 1, 5);

}

sust();

canvas.addEventListener('click', () => {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	console.log(x, y);
})

canvas.addEventListener('keypress', (e) => {
	console.log(e.code);
})