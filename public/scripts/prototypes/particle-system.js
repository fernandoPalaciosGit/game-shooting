var ParticleSystem = function (){ };

ParticleSystem.system = []; // set of particles constructor

ParticleSystem.prototype.reloadSystem = function (){
	this.constructor.system.length = 0;
};

ParticleSystem.prototype.renderSystem = function (ctx){
	var particleSys = this.constructor.system;
	for (var i = 0, len = particleSys.length; i < len; i++) {
	    ctx.fillStyle = particleSys[i].color;
	    ctx.beginPath();
	    ctx.arc(	particleSys[i].posX, particleSys[i].posY, particleSys[i].radius,
	    				0, Math.PI * 2, true);
	    ctx.fill();
	};
};

// use angular movement
ParticleSystem.prototype.moveParticles = function ( countFPS ){
	var particleSys = this.constructor.system;
	
	for (var i = 0, len = particleSys.length; i < len; i++){
		particleSys[i].life -= countFPS; // (0.5 -> 1) -= 0.02

		if( particleSys[i].life < 0 ){ // forget particle
			particleSys.splice(i--, 1);
			len--;
			continue;
	
		} else { // movement
			particleSys[i].angularMove( countFPS );
		}
	}
};

/* FIREWORKS
* lifetime between half and a second
* speed three hundred pixels per second
* random 360 degrees of angle position
*/
ParticleSystem.prototype.createParticles = function ( num, radius, posX, posY ){
	var	color = 'rgb('+random(255)+','+random(255)+','+random(255)+')',
			particleSys = this.constructor.system; // arr of particles

	for (var i = 0; i < num; i++) { // createan array of particles after render
		var particle = new Particle(	posX, posY, radius, 0.5+(random(500)/1000),
												random(300), random(360), color );
		particleSys.push( particle );
	};
};