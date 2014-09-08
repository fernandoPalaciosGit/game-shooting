var Scene = function (settings){
	// set id scene from last index constructor Array scenes
	this.id = this.constructor.addScenes.length;
	this.constructor.addScenes.push(this);
};

// Propiedades estaticas de constructor (this.contructor)
Scene.addScenes = [];
Scene.currentScene = null;

// propiedades publicas de instancias (implementacion particular de cada escena)
Scene.prototype.act = function (){};
Scene.prototype.paint = function (ctx){};
Scene.prototype.load = function (){};