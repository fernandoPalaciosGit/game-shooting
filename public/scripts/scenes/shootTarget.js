(function(	domCanvas,
				bgColor,
				target,
				sight,
				pressed,
				click ){

	GAME.scenes.shootTheTarget.load = function () {
		// center target
		var	styleWidth = domCanvas.style.width,
				styleHeight = domCanvas.style.height;
		target.setPosition( parseInt(styleWidth, 10)/2, parseInt(styleHeight, 10)/2);
	};

	GAME.scenes.shootTheTarget.act = function () {

		// check the lastPressed click mouse
		if ( GAME.clicks.lastPress === click.LEFT ) {
			bgColor = '#333'; 
			if ( sight.distanceToTarget( target ) < 0 ) {
				GAME.score++;
				target.setPosition(	random(domCanvas.width/10-1)*10+target.radius,
											random(domCanvas.height/10-1)*10+target.radius );
			}
		}

		GAME.clicks.lastPress = null ;
		
	};

	GAME.scenes.shootTheTarget.paint = function (ctx) {
		// draw canvas background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, domCanvas.width, domCanvas.height);
		
		// draw circle moved by mouse0
		sight.strokeArc(ctx, '#0f0', 0, Math.PI*2);
		target.strokeArc(ctx, '#f00', 0, Math.PI*2);

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
	GAME.clicks.lastPress,
	GAME.clicks.allowed ));