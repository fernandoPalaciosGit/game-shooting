(function(	domCanvas,
				bgColor,
				sight,
				press,
				spriteAlien,
				fireworks
			){

	GAME.scenes.runAwayAlien.load = function () {
		// reset variables game
		GAME.score = 0;
		GAME.counter.time = 20;
		GAME.scenes.level = 0;
		GAME.gameover = false;
		GAME.pause = true; // timeout to explote bombs
		GAME.bombTime = 0;
		GAME.bombs.length = 0;
		fireworks.reloadSystem();

		// center position
		var	styleWidth = domCanvas.style.width,
				styleHeight = domCanvas.style.height;

		sight.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);
	};

	// we uses deltatime for sync our counter with the FPS (frames per seconds)
	GAME.scenes.runAwayAlien.act = function ( countFPS ) {

		if( !GAME.pause ){

			GAME.counter.time -= countFPS;

			if (GAME.counter.time <= 0 ){
				GAME.player.winner = true;
			}

			// set and create new aleien bomb : each 0.5 -> 3 seconsds
			GAME.bombTime -= countFPS
			if( GAME.bombTime < 0 ){
				var newBomb = new CircleAsset(0, 0, 20, 0);
				newBomb.bTimer = 0.5 + random(2.5);
				newBomb.speed = 100 + ( random(GAME.score) * 10 );
				newBomb.setRandomPosition( domCanvas.style );
				newBomb.sprite = spriteAlien.asset[ GAME.bombs.length%2%2 ]; // green or yellow asset
				newBomb.randomY = random(4); // type of alien
				newBomb.randomX = spriteAlien.inSight; // sprite not in target
				
				GAME.bombs.push( newBomb );
				GAME.bombTime = random(2);
			}

			for (var i = 0, len = GAME.bombs.length; i < len; i++) {
				if( GAME.bombs[i].bTimer < 0 ){ // remove alien from bombs assets
					GAME.score++;
					fireworks.createParticles( 200, 2, GAME.bombs[i].posX, GAME.bombs[i].posY );
					GAME.bombs.splice(i--, 1);
					len--;
					continue; // no more interaction with this alien
				}

				GAME.bombs[i].bTimer -= countFPS; // countdown to explote

				var distanceToTarget = sight.distanceToTarget( GAME.bombs[i] );
				// visual in/out alien target
				GAME.bombs[i].randomX = ( distanceToTarget < 0 ) ?
												spriteAlien.inTarget :
												spriteAlien.inSight;
				
				// angular movement, to match the centers
				if( distanceToTarget > -(sight.radius + GAME.bombs[i].radius) ){
					var angle = sight.getAngle( GAME.bombs[i] );
					GAME.bombs[i].angularMove( angle, GAME.bombs[i].speed * countFPS );
				}

				// explote bomb with time left
				if( GAME.bombs[i].bTimer < 0 ){
					GAME.bombs[i].radius *= 2; // simulate blast
					if( GAME.bombs[i].distanceToTarget( sight ) < 0 ){ // GAMEOVER
						GAME.pause = true;
						GAME.gameover = true;
						GAME.counter.time = 0;
					}
				}
			};

			fireworks.moveParticles( countFPS ); // always moving fireworks


		// the game is paused and conditions for return playing
		} else if (	GAME.keys.lastPress === press.ENTER ){
			
			// RELOAD STAGE when gameover and press start
			if( !!GAME.gameover ){
				this.load();

			// return to game after paused
			} else {
				GAME.pause = false;
				GAME.keys.lastPress = null ;		
			}

		}

		// paused game with enter keyboard
		if( GAME.keys.lastPress === press.ENTER ){
			GAME.pause = true;
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

			// draw bomb-aliens with sprites
			for (var i = 0, len = GAME.bombs.length; i < len; i++) {
				if(	GAME.bombs[i].bTimer > 0 && GAME.bombs[i].bTimer < 1 &&
						~~(GAME.bombs[i].bTimer*10)%2 == 0 ){
					GAME	.bombs[i]
							.strokeTargetDraggables( ctx, 'rgba(255, 0, 0, 0.0)', 5, 5);
				} else {
					GAME	.bombs[i]
							.strokeTargetDraggables( ctx, 'rgba(255, 0, 0, 0.0)', 50, 50);
				}
			};

			// firework sistem
			fireworks.renderSystem(ctx);

			// draw circle moved by mouse
			sight.strokeSight(ctx, '#009B00', 0, Math.PI*2);
		}

		// reset canvas background
		bgColor = '#6687DD';
	};

}( GAME.canvas.dom,
	GAME.canvas.bgColor,
	GAME.player.sight,
	GAME.keys.allowed,
	GAME.sprites.alien,
	GAME.player.firework
 ));