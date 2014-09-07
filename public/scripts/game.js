var init = function ( evLoad ) {
	// find mouse position offset canvas
	document.addEventListener('mousemove', function(evMove){
		var	offsetXMouse = evMove.pageX - GAME.canvas.dom.offsetLeft,
				offsetYMouse = evMove.pageY - GAME.canvas.dom.offsetTop;
		GAME.mouse.setPossition(offsetXMouse, offsetYMouse);
	}, false);

	run();
	repaint();
};

var GAME = {
	canvas: {
		dom: document.querySelector('.canvasGame canvas'),
		ctx: document.querySelector('.canvasGame canvas').getContext('2d'),
		w: document.querySelector('.canvasGame canvas').width,
		h: document.querySelector('.canvasGame canvas').height,
	},
	mouse: new CircleAsset(0, 0, 20)
};

var moveAsset = function(){

};

var paintCanvas = function(ctx){
	// draw canvas background
	ctx.fillStyle = '#000'
	ctx.fillRect(0, 0, GAME.canvas.w, GAME.canvas.h);

	// draw circle moved by mouse
	GAME.mouse.strokeArc(ctx, '#0f0', 0, Math.PI*2);
};

var run = function (){
	window.setTimeout(run, 1000/50); //frames por segundo
	moveAsset();	
};

var repaint = function (){
	requestAnimFrame(repaint);
	resizeBuffer();
	paintCanvas(GAME.canvas.ctx);
};

document.addEventListener('DOMContentLoaded', init, false);