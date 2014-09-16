/////////////////
// MOUSE ASSET //
/////////////////
var CircleAsset = function (x, y, r, c) {
	this.radius = r || 5;
	this.posX = x || 0;
	this.posY = y || 0;
	this.lenCross = c || 0; // lenght on cross sight
	this.bTimer = 0;

	// target to context circle constructor
	var self = this,
	
	// limit mouse position by canvas
	limitPosition = function (x, y, domCanvas) {
		// we need to check all cases, if else NOT possible
 		if( x < 0 ){
			self.posX = self.radius;
		} if ( y > domCanvas.height ) {
			self.posY = domCanvas.height - self.radius;
		} if ( x > domCanvas.width ) {
			self.posX = domCanvas.width - self.radius;
		} if ( y < 0 ) {
			self.posY = self.radius;
		}
	};

	this.movePosition = function (x, y) {
		this.posX = x;
		this.posY = y;
		limitPosition(x, y, GAME.canvas.dom);
	};

	this.setPosition = function (x, y) {
		this.posX = x;
		this.posY = y;
	};

	this.setRandomPosition = function ( domCanvas ) {
		this.setPosition(	random( parseInt(domCanvas.width, 10) /10-1)*10 + this.radius,
								random( parseInt(domCanvas.height, 10) / 10-1)*10 + this.radius );
	};
};

CircleAsset.prototype.isOutSide = function (domCanvas){
 	return ( this.posX < 0 || this.posY > domCanvas.height ||
 				this.posX > domCanvas.width || this.posY < 0 );
}

CircleAsset.prototype.strokeArc = function(ctx, color, initArc, endArc){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(this.posX, this.posY, this.radius, initArc, endArc, true);
	ctx.stroke();
};

CircleAsset.prototype.drawImageArea = function (ctx, sprite, cutPosX, cutPosY, cutWidth, cutHeight){
	if( !!sprite.width ){
		ctx.drawImage(	sprite,
					cutPosX, cutPosY, cutWidth, cutHeight,   //cut the sprite image
					this.posX-this.radius, this.posY-this.radius,	//position the image inside the asset
					this.radius*2, this.radius*2 );	//size the cut image in the canvas
	}
};

CircleAsset.prototype.strokeSight = function(ctx, color, initArc, endArc){
	this.strokeArc(ctx, color, initArc, endArc);

	var distToRadio = this.lenCross * this.radius;
	ctx.moveTo(this.posX - distToRadio, this.posY);
	ctx.lineTo( this.posX + distToRadio, this.posY);

	ctx.moveTo(this.posX, this.posY - distToRadio );
	ctx.lineTo( this.posX , this.posY + distToRadio);
	ctx.stroke();
};

CircleAsset.prototype.strokeHole = function(ctx, lineW, lineColor, fillColor){
	ctx.strokeStyle = lineColor;
	ctx.fillStyle   = fillColor;
	ctx.lineWidth   = lineW;
	ctx.beginPath();
	ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI*2, true);
	ctx.fill();
	ctx.stroke();
	ctx.lineWidth = 1;	
}

// STAGE 1 alien asset target
CircleAsset.prototype.strokeTarget = function (	ctx, color, initArc, endArc, sprite, cutPosX, cutPosY, cutWidth, cutHeight ) {
	this.strokeArc(ctx, color, initArc, endArc);
	this.drawImageArea(ctx, sprite, cutPosX, cutPosY, cutWidth, cutHeight);
};

// STAGE 2 aliens graggebles target
CircleAsset.prototype.strokeTargetDraggables = function ( ctx, color, cutWidth, cutHeight ) {
	this.strokeArc(ctx, color, 0, Math.PI*2 );
	this.drawImageArea(	ctx, this.sprite, this.randomX, (this.randomY * 100) + 30,
								cutWidth, cutHeight	);
};

CircleAsset.prototype.distanceToTarget = function (target) {
	// we got XY position, throw 'Pitagoras' we can calculate the Hipotenuse  
	if( !!target ){
		var	dx = this.posX - target.posX,
				dy = this.posY - target.posY,
				// raiz cuadrada de la suma de los cuadrados de los catetos (ddiferencia en XY)
				distance = Math.sqrt(dx*dx + dy*dy) - (this.radius + target.radius);
		return distance;
	}
};

CircleAsset.prototype.calcDistCuad = function (target) {
	var	dx = this.posX - target.posX,
			dy = this.posY - target.posY,
			cuadr = null;
	if( dx > 0 && dy > 0 ){ // first quad
		return 1;
	} else if (  dx < 0 && dy > 0  ){ // second quad
		return 2;
	} else if (   dx > 0 && dy < 0   ) { // third quad
		return 3;
	} else if (  dx < 0 && dy < 0  ) { // fourth quad
		return 4;
	} else if (  dx === 0 && dy === 0  ) { // same pos
		return 0;
	}
};

CircleAsset.prototype.getAngle = function( target ){
	if( target !== null ){
		return Math.atan2( this.posY-target.posY, this.posX-target.posX);
	}
};

CircleAsset.prototype.angularMove = function( degree, speed ){
	if( speed !== null ){
		// var rad = toRad(degree);
		this.posX += Math.cos(degree) * speed;
		this.posY += Math.sin(degree) * speed;
	}
};