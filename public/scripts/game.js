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

	// find key press position
	document.addEventListener('keydown', function(evKeyDown){
		GAME.keys.lastPress = evKeyDown.which || evKeyDown.keyCode;
	}, false);

	// keep track mouseup and mousedown click events 
	GAME.canvas.dom.addEventListener('mousedown', function (evClick){
		GAME.clicks.lastPress = evClick.which || evKeyDown.keyCode ;
	}, false);
	
	// keep tracking mouseiup event click outsite canvas layer
	// just in case the player release the mouse outside the canvas
	document.addEventListener('mouseup', function (evClick){
		GAME.clicks.lastRelease = evClick.which;
	}, false);

	// load the sight nd target scene
	// loadScene(GAME.scenes.shootTheTarget);
	loadScene(GAME.scenes.dropTheAlien);
	
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
		sight: new CircleAsset(0, 0, 7, 2.5),
		target: new CircleAsset(0, 0, 20, 0),
		hole: new CircleAsset(0, 0, 50, 0)
	},
	sound: {
		shoot: (function(){
			var sound = new Audio();
			sound.src = './assets/sounds/shot.mp3';
			return sound; 
		}()),
		deadAlien: (function(){
			var sound = new Audio();
			sound.src = './assets/sounds/deadAlien.wav';
			return sound;
		}()) 
	},
	sprites: {
		alien: {
			asset: [ ( function(){
							var sprite = new Image();
							sprite.onerror = function( evError ){
								this.src = '';
								this.onerror = '';
							};
						   sprite.src = 'assets/images/yellow_sheet.png';
						   return sprite;
						}() ),
						( function(){
							var sprite = new Image();
							sprite.onerror = function( evError ){
								this.src = '';
								this.onerror = '';
							};
						   sprite.src = 'assets/images/green_sheet.png';
						   return sprite;
						}() ), null ], // third index to choose asset color in stage
			randomY: 0,
			randomX: 0,
			inSight: 960, // sprite position X, to be alien out of target
			inTarget: 1020, // sprite position X, to be alien in target
			draggables : [],		// assets draggables in canvas
			dragging : null		// asset we are now dragging
		}
	},
	scenes: {
		shootTheTarget: new Scene(),
		dropTheAlien: new Scene(),
		level: 0
	},
	clicks: {
		lastPress : null,		// when we hold down the mouse
		lastRelease : null,	// when we drop the mouse
		allowed: {
			LEFT : 1,
			CENTER: 2,
			RIGHT: 3
		}
	},
	keys: {
		lastPress: null,
		allowed: {
			ENTER: 13,
			SPACE: 32
		}
	},
	score: 0,
	counter: {
		time: 0,
		lastUpdate: 0
	},
	pause: true,
	gameover: false,
};

// set the current Scene
var loadScene = function (sn){
	Scene.currentScene = sn.id;
	Scene.addScenes[ Scene.currentScene ].load(); // sn.load()
};

var run = function (){
	window.setTimeout(run, 1000/50); //frames por segundo

	/* deltaTime: milliseconds that have passed since the last frame*/
	var	now = + new Date,
			deltaTime = ( now - GAME.counter.lastUpdate) / 1000;
	// we diverge only miliseconds
	if ( deltaTime > 1 ) deltaTime = 0;

	// recover time now for use in the next frameset
	GAME.counter.lastUpdate = now;

	// deltaTime is the fps counter range
	Scene.addScenes[ Scene.currentScene ].act( deltaTime );
};

var repaint = function (){
	requestAnimFrame(repaint);
	resizeBuffer(GAME.canvas.dom, GAME.canvas.ctx);
	Scene.addScenes[ Scene.currentScene ].paint(GAME.canvas.ctx);
};

document.addEventListener('DOMContentLoaded', init, false);