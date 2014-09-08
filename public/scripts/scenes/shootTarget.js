(function(	domCanvas,
				bgColor,
				target,
				sight ){

	GAME.scenes.shootTheTarget.load = function () {

	};

	GAME.scenes.shootTheTarget.act = function () {
		// center target
		target.setPosition(domCanvas.width/2, domCanvas.height/2);
	};

	GAME.scenes.shootTheTarget.paint = function (ctx) {
		// draw canvas background
		ctx.fillStyle = bgColor;
		ctx.fillRect(0, 0, domCanvas.width, domCanvas.height);
		
		// draw circle moved by mouse0
		sight.strokeArc(ctx, '#0f0', 0, Math.PI*2);
		target.strokeArc(ctx, '#f00', 0, Math.PI*2);

		// show distance to target
		ctx.fillStyle = '#fff';
		var distance = sight.distanceToTarget( target );
		if( distance < 0 ){
			distance = 'collision';
			bgColor = '#333';
		} else {
			distance = distance.toFixed(1); 
			bgColor = '#000';
		}
		ctx.fillText(	'Distance to target: '+ distance, 10, 10 );
	};

}( GAME.canvas.dom,
	GAME.canvas.bgColor,
	GAME.player.target,
	GAME.player.sight ));