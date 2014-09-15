var Particle = function (x, y, r, l, s, a, c){
	this.posX = x || 0;
	this.posY = y || 0;
	this.radius = r || 1;
	this.life = l || 0;
	this.speed = s || 0;
	this.angle = a || 0;
	this.color = c || 0;
};

Particle.prototype.angularMove = function( deltaTime ){
	this.posX += Math.cos( this.angle ) * this.speed * deltaTime;
	this.posY += Math.sin( this.angle ) * this.speed * deltaTime;
};