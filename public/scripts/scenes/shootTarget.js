(function(	domCanvas,
				bgColor,
				target,
				sight,
				click,
				press,
				spriteAlien ){

	GAME.scenes.shootTheTarget.load = function () {
		// center target
		var	styleWidth = domCanvas.style.width,
				styleHeight = domCanvas.style.height;
		target.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);

		spriteAlien.ramdomY = random(4);
	};

	GAME.scenes.shootTheTarget.act = function () {
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
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, domCanvas.width, domCanvas.height);
		

		// draw target alien with sprites
		target.strokeTarget(	ctx, 'rgba(255, 0, 0, 0.0)', 0, Math.PI*2, spriteAlien.asset,
									// position and Dim of sprite alien
									spriteAlien.randomX, (spriteAlien.ramdomY * 100) + 30, 50, 50);
		
		// draw circle moved by mouse0
		sight.strokeSight(ctx, '#0f0', 0, Math.PI*2);

		// calculate distanca to target
		var distance = sight.distanceToTarget( target );

		// bgColor = ( distance < 0 ) ? '#333' : '#000'; 
		distance = ( distance < 0 ) ? 'collision' : distance.toFixed(1) ;				
		
		ctx.fillStyle = '#fff';
		// show distance to target
		ctx.fillText(	'Distance to target: '+ distance, 10, 10 );
		// show score
		ctx.fillText('Score: '+ GAME.score, domCanvas.width - 50, 10);

		// reset canvas background canvas color shot
		bgColor = '#000';
	};

}( GAME.canvas.dom,
	GAME.canvas.bgColor,
	GAME.player.target,
	GAME.player.sight,
	GAME.clicks.allowed,
	GAME.keys.allowed,
	GAME.sprites.alien ));