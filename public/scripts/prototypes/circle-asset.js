/////////////////
// MOUSE ASSET //
/////////////////
var CircleAsset = function (x, y, r, c) {
	this.radius = r || 5;
	this.posX = x || 0;
	this.posY = y || 0;
	this.lenCross = c || 0; // lenght on cross sight

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
		this.setPosition(	random(domCanvas.width/10-1)*10 + this.radius,
								random(domCanvas.height/10-1)*10 + this.radius );
	};
};

CircleAsset.prototype.playSound = function(sound){
	sound.load();
	sound.play();
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

CircleAsset.prototype.strokeTarget = function (	ctx, color, initArc, endArc, sprite, cutPosX, cutPosY, cutWidth, cutHeight ) {
	this.strokeArc(ctx, color, initArc, endArc);
	this.drawImageArea(ctx, sprite, cutPosX, cutPosY, cutWidth, cutHeight);
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