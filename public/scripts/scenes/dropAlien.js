(function(	domCanvas,
				bgColor,
				sight,
				hole,
				click,
				press,
				aliens,
				fireworks
			){

	GAME.scenes.dropTheAlien.load = function () {
		// reset variables game
		GAME.score = 0;
		GAME.counter.time = 10;
		GAME.scenes.level = 0;
		GAME.gameover = false;
		GAME.pause = true;
		GAME.clicks.lastPress = null;
		GAME.clicks.lastRelease = null;
		aliens.dragging = null;

		// center the hole to drop the alien
		var	middleWidth = parseInt(domCanvas.style.width, 10)/2,
				middleeHeight = parseInt(domCanvas.style.height, 10)/2;

		sight.setPosition( middleWidth, middleeHeight);
		hole.setPosition( middleWidth, middleeHeight);

		// set 5 aliens display random over canvas
		aliens.draggables.length = 0; // reset alien draggables
		for (var i = 0; i < 6; i++) {
			aliens.draggables.push( new CircleAsset(0, 0, 20, 0) );

			var alienRender = aliens.draggables[i];
			alienRender.setRandomPosition( domCanvas.style );

			// avoid collision with hole
			if( hole.distanceToTarget( alienRender ) < 0 ){
				var quad = hole.calcDistCuad( alienRender );
				if ( quad !== 0 ) { // not same position of hole (center canvas)
					alienRender.posX += ( quad === 2 || quad === 4 ) ? + hole.radius : - hole.radius ;
					alienRender.posY += ( quad === 1 || quad === 2 ) ? - hole.radius : + hole.radius ;
				} else {
					alienRender.setRandomPosition( domCanvas.style );					
				}
			}

			// init scene with random alien face
			alienRender.sprite = aliens.asset[ i%2%2 ]; // green or yellow asset
			alienRender.randomY = random(4); // type of alien
			alienRender.randomX = aliens.inSight; // sprite not in target
		};

	};

	// we uses deltatime for sync our counter with the FPS (frames per seconds)
	GAME.scenes.dropTheAlien.act = function ( countFPS ) {

		// GAME RUNNING
		if( !GAME.pause ){
			// WIN : all draggable aliens are inside the hole
			if( aliens.draggables.length === 0 ){
				loadScene( GAME.scenes.runAwayAlien );
			}

			GAME.counter.time -= countFPS;

			// stop game actions
			if (GAME.counter.time <= 0 ){
				GAME.pause = true;
				GAME.gameover = true;
				GAME.counter.time = 0;
			}

			// INTERACTION ALIENS DRAGGABLES
			for (var i = 0, len = aliens.draggables.length; i < len; i++) {
				var alienRender = aliens.draggables[i];

				// the alien dropped into hole
				if( !!alienRender.intoHole ){
					// center alien into hole
					alienRender.posX = hole.posX;
					alienRender.posY = hole.posY;
					if( alienRender.radius <= 0 ){ // remove from alien draggables
						fireworks.createParticles( 200, 2, hole.posX, hole.posY ); // explotion particles
						aliens.draggables.splice(i, 1);
						len--;
						continue;
					}else{ //effect of drop
						alienRender.radius--;
					}
				}
				// check ousite placed target (because resized window)
				if( !!alienRender.isOutSide( domCanvas ) ){
					alienRender.setRandomPosition( domCanvas );
				}

				var distanceToAlien = sight.distanceToTarget( alienRender );

				// collision alien with player sight
				if(  distanceToAlien < 0  ){
					alienRender.randomX = aliens.inTarget;
					
					// DRAG ALIEN, the last event was mouseDOWN 
					if ( 	GAME.clicks.lastPress === click.LEFT  ) {
						aliens.dragging = i; // select dragging alien
					}

				// no target yet
				} else {
					alienRender.randomX = aliens.inSight; 					
				}
			};

			fireworks.moveParticles( countFPS ); // always moving fireworks

			// player is dragging something, change alien coords to mouse position
			if ( aliens.dragging !== null ) {
				// HACK: remove all selected: possibility of remain select because bblClicking
				window.getSelection().removeAllRanges();

				var	alienDrag = aliens.draggables[ aliens.dragging ]; 
				alienDrag.posX = sight.posX; // move position to mouse
				alienDrag.posY = sight.posY;
				if( alienDrag.radius <= 30	) alienDrag.radius++; // effect drag
				
				// DROP ALIEN, the last event was mouseup 
				if (	GAME.clicks.lastRelease === click.LEFT ) {
					alienDrag.radius = 20; // effect drop
					aliens.dragging = null;

					// DRAGGING INTO HOLE
					if( hole.distanceToTarget( alienDrag ) < 0 ){
						// we cannot do a while becaouse itd too nested, otherwise we marked
						alienDrag.intoHole = true;
					}

				}
			}	


		// GAME PAUSED and conditions for return playing
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

		// reset all interaction mouse events
		GAME.clicks.lastPress = null;
		GAME.clicks.lastRelease = null ;
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
				ctx.fillText('Drags the aliens to the hole', pausePosX, pausePosY);
				ctx.fillText('Enter to Start', pausePosX, pausePosY + 40);
			}

		} else {
			document.querySelector('#boxBlur').classList.remove('pauseView');
			document.querySelector('#instructions').classList.add('pauseView');
			
			// draw hole to score game
			hole.strokeHole(ctx, 10, '#797979', '#000')
			
			// draw target alien with sprites
			for (var i = 0, len = aliens.draggables.length; i < len; i++) {
				aliens
					.draggables[i]
					.strokeTargetDraggables( ctx, 'rgba(255, 0, 0, 0.0)', 50, 50);
			};

			// firework sistem
			fireworks.renderSystem(ctx);

			// draw pointer moved by mouse
			sight.strokeSight(ctx, '#009B00', 0, Math.PI*2);
		}

		// reset canvas background
		bgColor = '#6687DD';
	};

}( GAME.canvas.dom,
	GAME.canvas.bgColor,
	GAME.player.sight,
	GAME.player.hole,
	GAME.clicks.allowed,
	GAME.keys.allowed,
	GAME.sprites.alien,
	GAME.player.firework
));