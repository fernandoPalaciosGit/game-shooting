(function(	domCanvas,
				bgColor,
				target,
				sight,
				click,
				press,
				spriteAlien ){

	GAME.scenes.runAwayAlien.load = function () {
		// reset variables game
		GAME.score = 0;
		GAME.counter.time = 10;
		GAME.scenes.level = 0;
		GAME.gameover = false;
		GAME.pause = true;

		// center target
		var	styleWidth = domCanvas.style.width,
				styleHeight = domCanvas.style.height;

		sight.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);

	};

	// we uses deltatime for sync our counter with the FPS (frames per seconds)
	GAME.scenes.runAwayAlien.act = function ( countFPS ) {

		if( !GAME.pause ){


			// CHANGE STAGE (20 score)
			if( GAME.scenes.level === 4){
				GAME.player.winner = true;
			}

			GAME.counter.time -= countFPS;

			// check the lastPressed click mouse, or key space pressed
			if (	GAME.keys.lastPress === press.SPACE ||
					GAME.clicks.lastPress === click.LEFT ) {
			}

			// stop game actions
			if (GAME.counter.time <= 0 ){
				GAME.pause = true;
				GAME.gameover = true;
				GAME.counter.time = 0;
			}

		// the game is paused and conditions for return playing
		} else if (	GAME.keys.lastPress === press.ENTER ){
			
			// RELOAD STAGE when gameover and press start
			if( !!GAME.gameover ){
				this.load();

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

	GAME.scenes.runAwayAlien.paint = function (ctx) {
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
		var colorLevelTxt = ( txt <= 2.0 ) ? '#f00' : colorFontTxt;
		drawBgdTxt(ctx, txt, 'center', '18pt', domCanvas.width/2, 20, 'transparent', colorLevelTxt);

		if( !!GAME.pause ){
			document.querySelector('#instructions').classList.remove('pauseView');
			document.querySelector('#boxBlur').classList.add('pauseView');

			var	pausePosX = domCanvas.width/2,
					pausePosY = (domCanvas.height/2) - 100;

			if( !!GAME.gameover ){
				ctx.fillText('Game over: click enter to reset', pausePosX, pausePosY);
			} else {
				ctx.fillText('Evade the aliens before they explode', pausePosX, pausePosY);
				ctx.fillText('Enter to Start', pausePosX, pausePosY + 40);
			}

		} else {
			document.querySelector('#boxBlur').classList.remove('pauseView');
			document.querySelector('#instructions').classList.add('pauseView');

			// draw circle moved by mouse
			sight.strokeSight(ctx, '#009B00', 0, Math.PI*2);
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
	GAME.sprites.alien
 ));