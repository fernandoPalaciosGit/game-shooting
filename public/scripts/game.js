var init = function ( evLoad ) {
	// center target
	GAME.player.target.setPosition(GAME.canvas.w/2, GAME.canvas.h/2);

	// find mouse position offset canvas
	document.addEventListener('mousemove', function(evMove){
		// mouse pointer position inside canvas is our circle asset position
		var	offsetXMouse = evMove.pageX - GAME.canvas.dom.offsetLeft,
				offsetYMouse = evMove.pageY - GAME.canvas.dom.offsetTop;
		GAME.player.sight.movePosition(offsetXMouse, offsetYMouse);
	}, false);

	// init render canvas
	run();
	repaint();
};

var GAME = {
	canvas: {
		dom: document.querySelector('.canvasGame canvas'),
		ctx: document.querySelector('.canvasGame canvas').getContext('2d'),
		w: document.querySelector('.canvasGame canvas').width,
		h: document.querySelector('.canvasGame canvas').height,
		bgColor: '#000'
	},
	player: {
		sight: new CircleAsset(0, 0, 20),
		target: new CircleAsset(50, 50, 20)
	}
};

var moveAsset = function(){

};

var paintCanvas = function(ctx){
	// draw canvas background
	ctx.fillStyle = GAME.canvas.bgColor;
	ctx.fillRect(0, 0, GAME.canvas.w, GAME.canvas.h);
	
	// show distance to target
	ctx.fillStyle = '#fff';
	var distance = GAME.player.sight.distanceToTarget( GAME.player.target );
	if( distance < 0 ){
		distance = 'collision';
		GAME.canvas.bgColor = '#333';
	} else {
		distance = distance.toFixed(1); 
		GAME.canvas.bgColor = '#000';
	}
	ctx.fillText(	'Distance to target: '+ distance, 10, 10 );
	

	// draw circle moved by mouse0
	GAME.player.sight.strokeArc(ctx, '#0f0', 0, Math.PI*2);
	GAME.player.target.strokeArc(ctx, '#f00', 0, Math.PI*2);
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