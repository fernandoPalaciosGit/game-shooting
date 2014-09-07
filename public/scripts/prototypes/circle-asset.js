/////////////////
// MOUSE ASSET //
/////////////////
var CircleAsset = function (x, y, r) {
	this.radio = r || 5;
	this.posX = x || 0;
	this.posY = y || 0;

	var self = this;
	var limitPossition = function (x, y, canvas) {

		// limit mouse position by canvas
		// we need to check all cases, no if ele possible
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

	this.setPossition = function (x, y) {
		this.posX = x;
		this.posY = y;
		limitPossition(x, y, GAME.canvas);
	};

};

CircleAsset.prototype.strokeArc = function(ctx, color, initArc, endArc){
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(this.posX, this.posY, this.radio, initArc, endArc, true);
	ctx.stroke();
}