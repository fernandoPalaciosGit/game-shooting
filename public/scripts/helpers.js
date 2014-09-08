var resizeBuffer = function (domCanvas, ctxCanvas){
	var	styleWidth = domCanvas.style.width,
			styleHeight = domCanvas.style.height;
			
	domCanvas.width = parseInt(styleWidth, 10);
	domCanvas.height = parseInt(styleHeight, 10);

	ctxCanvas.width = parseInt(styleWidth, 10);
	ctxCanvas.height = parseInt(styleHeight, 10);
};

var	requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback){ window.setTimeout(callback,17); };

var setCanvasFullScreen = function ( domCanvas ){
	// appropriate scale depending on the size of the canvas
	var	w = window.innerWidth /domCanvas.width,
			h = window.innerHeight /domCanvas.height,
			scale = Math.min(h,w);

	// assigned width and height according to our canvas scale
	domCanvas.style.width = (domCanvas.width*scale)+'px';
	domCanvas.style.height = (domCanvas.height*scale)+'px';

   // center the canvas and position it in fixed
	domCanvas.style.position = 'fixed';
	domCanvas.style.left = '50%';
	domCanvas.style.top = '50%';
	domCanvas.style.marginLeft =- (domCanvas.width*scale)/2+'px';
	domCanvas.style.marginTop =- (domCanvas.height*scale)/2+'px';
};