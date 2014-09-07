/////////////////
// MOUSE ASSET //
/////////////////
var CircleAsset = function (x, y, r) {
	this.radio = r || 5;
	this.posX = x || 0;
	this.posY = y || 0;

	// target to context circle constructor
	var self = this,
	
	// limit mouse position by canvas
	limitPosition = function (x, y, canvas) {
		// we need to check all cases, if else NOT possible
 		if( x < 0 ){
			self.posX = self.radio;
		} if ( y > canvas.h ) {
			self.posY = canvas.h - self.radio;
		} if ( x > canvas.w ) {
			self.posX = canvas.w - self.radio;
		} if ( y < 0 ) {
			self.posY = self.radio;
		}
	};

	this.movePosition = function (x, y) {
		this.posX = x;
		this.posY = y;
		limitPosition(x, y, GAME.canvas);
	};

	this.setPosition = function (x, y) {
		this.posX = x;
		this.posY = y;
	};
};

CircleAsset.prototype.strokeArc = function(ctx, color, initArc, endArc){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(this.posX, this.posY, this.radio, initArc, endArc, true);
	ctx.stroke();
}

CircleAsset.prototype.distanceToTarget = function (target) {
	if( !!target ){

	}
};