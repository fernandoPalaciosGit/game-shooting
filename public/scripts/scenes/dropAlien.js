(function(	domCanvas,
				bgColor,
				target,
				sight,
				click,
				press,
				spriteAlien ){

	GAME.scenes.dropTheAlien.load = function () {
		// reset variables game
		GAME.counter.time = 10;
		GAME.scenes.level = 0;
		GAME.gameover = false;
		GAME.pause = true;

		// center the hole to drop the alien
		var	middleWidth = parseInt(domCanvas.style.width, 10)/2,
				middleeHeight = parseInt(domCanvas.style.height, 10)/2;				
		target.setPosition( middleWidth, middleeHeight );

		// set aliens display random over canvas
	};

	GAME.scenes.dropTheAlien.act = function ( countFPS ) {

		// we uses deltatime for sync our counter with the FPS (frames per seconds)
		if( !GAME.pause ){
			GAME.counter.time -= countFPS;


			// check the lastPressed click mouse, or key space pressed
			if (	GAME.keys.lastPress === press.SPACE ||
					GAME.clicks.lastPress === click.LEFT ) {


				// reset status pressing and clicking
				GAME.clicks.lastPress = null;
				GAME.keys.lastPress = null ;		
			}


			// stop game actions
			if (GAME.counter.time <= 0 ){
				GAME.pause = true;
				GAME.gameover = true;
				GAME.counter.time = 0;
			}

		// the game is paused and conditions for return playing
		} else if (	GAME.keys.lastPress === press.ENTER ){
			
			// counter remaning 10 seconds
			if( !!GAME.gameover ){
				GAME.gameover = false;
				GAME.counter.time = 10;
				GAME.score = 0;

			// return to game after paused
			} else {
				GAME.pause = false;
				GAME.clicks.lastPress = null;
				GAME.keys.lastPress = null ;		
			}

		}

		// paused game with enter keyboard
		if( GAME.keys.lastPress === press.ENTER ){
			GAME.pause = true;
         GAME.clicks.lastPress = null;
			GAME.keys.lastPress = null ;		
		}
		
	};

	GAME.scenes.dropTheAlien.paint = function (ctx) {
		// draw canvas background
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, domCanvas.width, domCanvas.height);
		ctx.globalAlpha = 1;

				// text info bgdColor
		var	colorBgdTxt = '#6BE',
				colorFontTxt = '#000',
				// show score
				txt = 'Score: '+ GAME.score;

		drawBgdTxt(ctx, txt, 'left', '14pt', domCanvas.width-100, 20, colorBgdTxt, colorFontTxt);

		// paint the counter remaining
		txt = GAME.counter.time.toFixed(1);
		drawBgdTxt(ctx, txt, 'center', '18pt', domCanvas.width/2, 20, 'transparent', colorFontTxt);

		if( !!GAME.pause ){
			document.querySelector('#instructions').classList.remove('pauseView');
			document.querySelector('#boxBlur').classList.add('pauseView');

			var	pausePosX = domCanvas.width/2,
					pausePosY = (domCanvas.height/2) - 100;

			if( !!GAME.gameover ){
				ctx.fillText('Game over: click enter to reset', pausePosX, pausePosY);
			} else {
				ctx.fillText('Paused: click to start', pausePosX, pausePosY);
			}

		} else {
			document.querySelector('#boxBlur').classList.remove('pauseView');
			document.querySelector('#instructions').classList.add('pauseView');
			
			// draw target alien with sprites

			
			// draw pointer moved by mouse

		}

		// reset canvas background
		bgColor = '#6687DD';
	};

}( GAME.canvas.dom,
	GAME.canvas.bgColor,
	GAME.player.target,
	GAME.player.sight,
	GAME.clicks.allowed,
	GAME.keys.allowed,
	GAME.sprites.alien ));