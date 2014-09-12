(function(	domCanvas,
				bgColor,
				sight,
				target,
				click,
				press,
				aliens
			){

	GAME.scenes.dropTheAlien.load = function () {
		// reset variables game
		GAME.score = 0;
		GAME.counter.time = 10;
		GAME.scenes.level = 0;
		GAME.gameover = false;
		GAME.pause = true;

		// center the hole to drop the alien
		var	middleWidth = parseInt(domCanvas.style.width, 10)/2,
				middleeHeight = parseInt(domCanvas.style.height, 10)/2;

		sight.setPosition( middleWidth, middleeHeight);

		// set 5 aliens display random over canvas
		aliens.draggables.length = 0; // reset alien draggables
		for (var i = 0; i < 5; i++) {
			aliens.draggables.push( new CircleAsset(0, 0, 20, 0) );
			aliens.draggables[i].setRandomPosition( domCanvas );

			// init scene with random alien face
			aliens.draggables[i].sprite = aliens.asset[ random(2) ]; // green or yellow asset
			aliens.draggables[i].randomY = random(4); // tipe of alien
			aliens.draggables[i].randomX = aliens.inSight; // not in target
		};

	};

	GAME.scenes.dropTheAlien.act = function ( countFPS ) {

		// we uses deltatime for sync our counter with the FPS (frames per seconds)
		if( !GAME.pause ){
			GAME.counter.time -= countFPS;

			// INTERACTION ALIENS DRAGGABLES
			for (var i = 0, len = aliens.draggables.length; i < len; i++) {
				var distanceToAlien = sight.distanceToTarget( aliens.draggables[i] );

				aliens.draggables[i].randomX = ( distanceToAlien < 0 ) ?
					aliens.inTarget: aliens.inSight;
			};


			// interaction game with left click
			if (	GAME.clicks.lastPress === click.LEFT ) {


				// reset status pressing and clicking
				GAME.clicks.lastPress = null;
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

		// reset all interaction
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
		drawBgdTxt(ctx, txt, 'center', '18pt', domCanvas.width/2, 20, 'transparent', colorFontTxt);

		if( !!GAME.pause ){
			document.querySelector('#instructions').classList.remove('pauseView');
			document.querySelector('#boxBlur').classList.add('pauseView');

			var	pausePosX = domCanvas.width/2,
					pausePosY = (domCanvas.height/2) - 100;

			if( !!GAME.gameover ){
				ctx.fillText('Game over: click enter to reset', pausePosX, pausePosY);
			} else {
				ctx.fillText('Reaches 20 points to pass the level', pausePosX, pausePosY);
				ctx.fillText('Enter to Start', pausePosX, pausePosY + 40);
			}

		} else {
			document.querySelector('#boxBlur').classList.remove('pauseView');
			document.querySelector('#instructions').classList.add('pauseView');
			
			// draw target alien with sprites
			for (var i = 0, len = aliens.draggables.length; i < len; i++) {
				aliens
					.draggables[i]
					.strokeTargetDraggables( ctx, 'rgba(255, 0, 0, 0.0)', 50, 50);
			};

			// draw pointer moved by mouse
			sight.strokeSight(ctx, '#009B00', 0, Math.PI*2);

		}

		// reset canvas background
		bgColor = '#6687DD';
	};

}( GAME.canvas.dom,
	GAME.canvas.bgColor,
	GAME.player.sight,
	GAME.player.target,
	GAME.clicks.allowed,
	GAME.keys.allowed,
	GAME.sprites.alien
));