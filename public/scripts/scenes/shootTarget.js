(function(	domCanvas,
				bgColor,
				target,
				sight,
				click,
				press,
				spriteAlien ){

	GAME.scenes.shootTheTarget.load = function () {
		// reset variables game
		GAME.score = 0;
		GAME.counter.time = 10;
		GAME.scenes.level = 0;
		GAME.gameover = false;
		GAME.pause = true;

		// center target
		var	styleWidth = domCanvas.style.width,
				styleHeight = domCanvas.style.height;

		target.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);
		sight.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);

		// init scene with random alien face
		spriteAlien.ramdomY = random(4);

		// random sprite Asset
		spriteAlien.asset[2] = spriteAlien.asset[ random(2) ];
	};

	// we uses deltatime for sync our counter with the FPS (frames per seconds)
	GAME.scenes.shootTheTarget.act = function ( countFPS ) {

		if( !GAME.pause ){

			// CHECK LEVEL UP
			if( GAME.score !== 0 ){
				var changeLevel = false;

				// every 5 points, 10 seconds of tiemout recovered
				switch( GAME.scenes.level ){
					case 0:
						if( GAME.score % 5 === 0 ) changeLevel = !changeLevel;
						break;
					case 1:
						if( GAME.score % 10 === 0 ) changeLevel = !changeLevel
						break;
					case 2:
						if( GAME.score % 15 === 0 ) changeLevel = !changeLevel
						break;
				}
			}

			// UP LEVEL and COUNTDOWN
			if( !!changeLevel ){
				GAME.counter.time += 5;
				GAME.scenes.level++;
			}

			// CHANGE STAGE (20 score)
			if( GAME.score === 20 || GAME.scenes.level === 4){
				loadScene( GAME.scenes.dropTheAlien );
			}

			GAME.counter.time -= countFPS;

			var distanceToTarget = sight.distanceToTarget( target );
		
			spriteAlien.randomX = ( distanceToTarget < 0 ) ?
				spriteAlien.inTarget: spriteAlien.inSight;

			// check the lastPressed click mouse, or key space pressed
			if (	GAME.keys.lastPress === press.SPACE ||
					GAME.clicks.lastPress === click.LEFT ) {

				bgColor = '#333'; 
				if ( distanceToTarget < 0 ) {
					GAME.score++;
					spriteAlien.asset[2] = spriteAlien.asset[ random(2) ];
					target.playSound(GAME.sound.deadAlien);
					spriteAlien.ramdomY = random(4); // [random assets position]
					target.setRandomPosition( domCanvas );

				} else {
					target.playSound(GAME.sound.shoot);
				}
				// reset status pressing and clicking
				GAME.clicks.lastPress = null;
				GAME.keys.lastPress = null ;		
			}

			// check ousite placed target (because resized window)
			if( !!target.isOutSide( domCanvas ) ){
				target.setRandomPosition( domCanvas )
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

	GAME.scenes.shootTheTarget.paint = function (ctx) {
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
				ctx.fillText('Paused: click to start', pausePosX, pausePosY);
			}

		} else {
			document.querySelector('#boxBlur').classList.remove('pauseView');
			document.querySelector('#instructions').classList.add('pauseView');

			// calculate distanca to target
			var distance = sight.distanceToTarget( target );
			distance = ( distance < 0 ) ? 'collision' : distance.toFixed(1) ;				

			// show distance to target
			txt = 'Distance to target: '+ distance;
			drawBgdTxt(ctx, txt, 'left', '14pt', 10, 20, colorBgdTxt, colorFontTxt);
			
			// draw target alien with sprites
			target.strokeTarget(	ctx, 'rgba(255, 0, 0, 0.0)', 0, Math.PI*2, spriteAlien.asset[2],
										// position and Dim of sprite alien
										spriteAlien.randomX, (spriteAlien.ramdomY * 100) + 30, 50, 50);
			
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