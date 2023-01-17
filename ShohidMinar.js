// config
var height = 700, width = 1200;
canvas = document.getElementById('canvas');
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

function BresenhamCircle(cx, cy, r, color = 'black', size = 1) {
	var x = 0, y = r;
	var p = 3 - 2 * r;
	while(x <= y) {
		for(var i of [-1, 1]) {
			for(var j of [-1, 1]) {
				set(cx + (x * i), cy + (y * j), color, size);
				set(cx + (y * i), cy + (x * j), color, size);
			}
		}
		if(p < 0) p += 4 * x + 6;
		else {
			p += 4 * (x - y) + 10;
			y--;
		}
		x++;
	}
}

function BoundaryFill(x, y, color = 'red') {
	var current_color = get(x, y);
	var Stack = [];
	Stack.push([x, y]);
	set(x, y, color);
	while(Stack.length != 0) {
		x = Stack[Stack.length - 1][0];
		y = Stack[Stack.length - 1][1];
		// console.log(x, y);
		Stack.pop();
		set(x, y, color)
		for(var i of [-1, 0, 1]) {
			for(var j of [-1, 0, 1]) {
				if(i == 0 && j == 0) continue;
				var nx = x + i, ny = y + j;
				// console.log('nx, ny ', nx, ny);
				if(nx >= 0 && nx < width && ny >= 0 && ny < height) {
					// console.log(nx, ny, isEqual(get(nx, ny), current_color))
					if(isEqual(get(nx, ny), current_color) == 0) continue;
					set(nx, ny, color);
					Stack.push([nx, ny]);
				}
			}
		}
	}
}

// BresenhamLine(2, 2, 80, 70);

function ShohidMinar() {
	var sx = 500, sy = 600, d = 80;
	BresenhamLine(sx, sy, sx, sy - d * 4);
	BresenhamLine(sx + d, sy, sx + d, sy - d * 4);
	BresenhamLine(sx, sy - d * 4, sx + d, sy - d * 4);

	BresenhamLine(sx + d * 5, sy, sx + d * 5, sy - d * 4);
	BresenhamLine(sx + d * 6, sy, sx + d * 6, sy - d * 4);
	BresenhamLine(sx + d * 5, sy - d * 4, sx + d * 6, sy - d * 4);


	BresenhamLine(sx + d * 2, sy, sx + d * 2, sy - 4 * d);
	BresenhamLine(sx + d * 3, sy, sx + d * 3, (sy + sy - d * 4) * 3 / 7 + d * 3 / 4);
	BresenhamLine(sx + d * 3, sy - d * 4, sx + d * 3, (sy + sy - d * 4) * 3 / 7 - d * 3 / 4);
	BresenhamLine(sx + d * 4, sy, sx + d * 4, sy - 4 * d);
	BresenhamCircle(sx + d * 3, (sy + sy - d * 4) * 3 / 7, d * 3 / 4, 'black', 2);
	BoundaryFill(sx + d * 3, (sy + sy - d * 4) * 3 / 7, 'red')

	BresenhamLine(sx + d * 3, sy - 5 * d, sx + d * 5, sy - 5 * d);
	BresenhamLine(sx + d * 2, sy - 4 * d, sx + d * 3, sy - 5 * d);
	BresenhamLine(sx + d * 3, sy - 4 * d, sx + d * 4, sy - 5 * d);
	BresenhamLine(sx + d * 4, sy - 4 * d, sx + d * 5, sy - 5 * d);




	BresenhamLine(sx - d * 2, sy, sx + d * 8, sy);
	BresenhamLine(sx - d * 1.5, sy + d * .5, sx + d * 7.5, sy + d * .5);
	BresenhamLine(sx - d, sy + d, sx + d * 7, sy + d, 'black', 1, 5);
	BresenhamLine(sx - d * 2, sy, sx - d * 1.5, sy + d * .5);
	BresenhamLine(sx + d * 8, sy, sx + d * 7.5, sy + d * .5);
	BresenhamLine(sx - d * 1.5, sy + d * .5, sx - d, sy + d, 'black', 1, 2);
	BresenhamLine(sx + d * 7.5, sy + d * .5, sx + d * 7, sy + d, 'black', 1, 2);
}

ShohidMinar();

canvas.addEventListener('click', () => {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;
	console.log(x, y);
})

canvas.addEventListener('keypress', (e) => {
	console.log(e.code);
})