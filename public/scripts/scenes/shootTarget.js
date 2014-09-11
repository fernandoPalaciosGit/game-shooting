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
		// center target
		var	styleWidth = domCanvas.style.width,
				styleHeight = domCanvas.style.height;

		target.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);
		sight.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);

		// init scene with random alien face
		spriteAlien.ramdomY = random(4);
	};

	GAME.scenes.shootTheTarget.act = function ( countFPS ) {
		// we uses deltatime for increase our counter sync with the FPS (frames per seconds)
		GAME.counter.time += countFPS;

		var distanceToTarget = sight.distanceToTarget( target );
		
		spriteAlien.randomX = ( distanceToTarget < 0 ) ?
			spriteAlien.inTarget: spriteAlien.inSight;

		// check the lastPressed click mouse, or key space pressed
		if (	GAME.keys.lastPress === press.SPACE ||
				GAME.clicks.lastPress === click.LEFT ) {

			bgColor = '#333'; 
			if ( distanceToTarget < 0 ) {
				GAME.score++;
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

		
	};

	GAME.scenes.shootTheTarget.paint = function (ctx) {
		// draw canvas background
		ctx.globalAlpha = 0.2;
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, domCanvas.width, domCanvas.height);
		ctx.globalAlpha = 1;

		// calculate distanca to target
		var distance = sight.distanceToTarget( target );
		distance = ( distance < 0 ) ? 'collision' : distance.toFixed(1) ;				

		var	colorBgdTxt = '#6BE',
				colorFontTxt = '#000';

		// show distance to target
		var txt = 'Distance to target: '+ distance;
		drawBgdTxt(ctx, txt, '14pt', 10, 20, colorBgdTxt, colorFontTxt);

		// show score
		txt = 'Score: '+ GAME.score;
		drawBgdTxt(ctx, txt, '14pt', domCanvas.width - 100, 20, colorBgdTxt, colorFontTxt);

		// paint the counter remaining
		txt = GAME.counter.time.toFixed(1);
		ctx.textAlign = 'center';
		drawBgdTxt(ctx, txt, '18pt', domCanvas.width/2, 20, 'rgba(0, 0, 0, 0.0)', colorFontTxt);
		
		// draw target alien with sprites
		target.strokeTarget(	ctx, 'rgba(255, 0, 0, 0.0)', 0, Math.PI*2, spriteAlien.asset,
									// position and Dim of sprite alien
									spriteAlien.randomX, (spriteAlien.ramdomY * 100) + 30, 50, 50);
		
		// draw circle moved by mouse
		sight.strokeSight(ctx, '#009B00', 0, Math.PI*2);

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