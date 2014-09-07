var resizeBuffer = function (){
	GAME.canvas.dom.width = GAME.canvas.w;
	GAME.canvas.dom.height = GAME.canvas.h;
	GAME.canvas.ctx.width = GAME.canvas.w;
	GAME.canvas.ctx.height = GAME.canvas.h;
};

var	requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){ window.setTimeout(callback,17); };