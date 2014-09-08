/////////////////
// MOUSE ASSET //
/////////////////
var CircleAsset = function (x, y, r) {
	this.radius = r || 5;
	this.posX = x || 0;
	this.posY = y || 0;

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
};

CircleAsset.prototype.strokeArc = function(ctx, color, initArc, endArc){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(this.posX, this.posY, this.radius, initArc, endArc, true);
	ctx.stroke();
}

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