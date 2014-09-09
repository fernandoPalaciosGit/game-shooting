var init = function ( evLoad ) {
	//resize canvas to full screen
	setCanvasFullScreen(GAME.canvas.dom);

	window.onresize = function () {
		setCanvasFullScreen(GAME.canvas.dom);
	};

	// find mouse position offset canvas
	document.addEventListener('mousemove', function(evMove){
		// mouse pointer position inside canvas is our circle asset position
		var	offsetXMouse = evMove.pageX - GAME.canvas.dom.offsetLeft,
				offsetYMouse = evMove.pageY - GAME.canvas.dom.offsetTop;

		GAME.player.sight.movePosition(offsetXMouse, offsetYMouse);
	}, false);

	// keep track mouse click event
	GAME.canvas.dom.addEventListener('mousedown', function (evClick){
		GAME.clicks.lastPress = evClick.which;
	}, false);

	// load the sight nd target scene
	loadScene(GAME.scenes.shootTheTarget);
	
	run();
	repaint();
};

var GAME = {
	canvas: {
		dom: document.querySelector('.canvasGame canvas'),
		ctx: document.querySelector('.canvasGame canvas').getContext('2d'),
		bgColor: '#000'
	},
	player: {
		sight: new CircleAsset(0, 0, 10),
		target: new CircleAsset(50, 50, 20)
	},
	scenes: {
		shootTheTarget: new Scene()
	},
	clicks: {
		lastPress: null,
		allowed: {
			LEFT : 1,
			CENTER: 2,
			RIGHT: 3
		}
	},
	score: 0
};

// set the current Scene
var loadScene = function (sn){
	Scene.currentScene = sn.id;
	Scene.addScenes[ Scene.currentScene ].load(); // sn.load()
};

var run = function (){
	window.setTimeout(run, 1000/50); //frames por segundo
	Scene.addScenes[ Scene.currentScene ].act();
};

var repaint = function (){
	requestAnimFrame(repaint);
	resizeBuffer(GAME.canvas.dom, GAME.canvas.ctx);
	Scene.addScenes[ Scene.currentScene ].paint(GAME.canvas.ctx);
};

document.addEventListener('DOMContentLoaded', init, false);