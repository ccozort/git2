//######### setup the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//######### global variables
const gravity = 9.8;
var bgX = 0;
var bgY = 0;
var allMonsters = [];
var allObstacles = [];
var allPotions = [];
var allProjectiles = [];

//######### game objects

// sprite sheet
var imgReady = false;
var img = new Image();
img.onload = function () {
	imgReady = true;
	console.log("spritesheet loaded successfully");
};
img.src = "_images/GameSprites.gif";

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
	console.log("background loaded successfully");
};
bgImage.src = "_images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "_images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "_images/monster.png";

// Obstacle image
var obstacleReady = false;
var obstacleImage = new Image();
obstacleImage.onload = function () {
	obstacleReady = true;
};
obstacleImage.src = "_images/pingpong_small.png";

// Potion image
var potionReady = false;
var potionImage = new Image();
potionImage.onload = function () {
	potionReady = true;
};
potionImage.src = "_images/cup_small.png";

// projectile image
var projectileReady = false;
var projectileImage = new Image();
projectileImage.onload = function () {
	projectileReady = true;
	// console.log("fireball image loaded successfully");
};

projectileImage.src = "_images/fireball.png";

// // using Factory functions to create objects - IGNORE THIS FOR NOW AND MAYBE FOREVER
// const dog = () => {
// 	const sound = 'woof';
// 	return {
// 		talk: () => console.log(sound),
// 		run: (x) => console.log(x),
// 	};
// };

// const sniffles = dog();
// sniffles.talk();
// sniffles.run("im running!!!!");

function Sprite(img, w, h, x, y, speed, degrees) {
	this.img = img;
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.velX = 0;
	this.velY = 0;
	this.coFriction = 0.7;
	this.friction = function () {
		if (this.velX, this.velX > 0.5) {
			this.velX -= this.coFriction;
		}
		else if (this.velX < -0.5) {
			this.velX += this.coFriction;
		}
		else {
			this.velX = 0;
		}
		if (this.velY > 0.5) {
			this.velY -= this.coFriction;
		}
		else if (this.velY < -0.5) {
			this.velY += this.coFriction;
		}
		else {
			this.velY = 0;
		}
	};
	this.degrees = degrees;
	this.speed = speed;
	this.destroyed = false;
	this.reset = function () {
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	};
	this.draw = function() {
			// ctx.drawImage(this.img, this.x, this.y);
			ctx.clearRect(this.x,this.y,0,0);
			// save the unrotated context of the canvas so we can restore it later
			// the alternative is to untranslate & unrotate after drawing
			ctx.save();
			// move to the center of the canvas
			ctx.translate(this.x,this.y);
			// rotate the canvas to the specified degrees
			ctx.rotate(this.degrees*Math.PI/180);
			// draw the image
			// since the context is rotated, the image will be rotated also
			// ctx.drawImage(image,-image.width/2,-image.width/2);
			ctx.drawImage(this.img,-this.img.width/2,-this.img.height/2);
			// we’re done with the rotating so restore the unrotated context
			ctx.restore();
	};

}	
  // here are the prototypes of Sprite - they can do everything Sprite can do and all the extra stuff they need to do
  var Projectile = function(img, w, h, x, y, speed, degrees) {
		Sprite.call(this, img, w, h, x, y, speed, degrees);
		this.fired = false;
		this.directionX = mouseCoords[0] - hero.x;
		this.directionY = mouseCoords[1] - hero.y;
		this.update = function() {
			this.x += Math.floor(this.directionX*this.speed);
			this.y += Math.floor(this.directionY*this.speed);
			this.friction();
		};
		allProjectiles.push(this);
	};


	function shoot() {
		var bullet = new Projectile(projectileImage, 16, 32, hero.x, hero.y, 15, 0);
		bullet.fired = true;
		var length = Math.sqrt(Math.pow(bullet.directionX, 2) + Math.pow(bullet.directionY, 2));
		bullet.directionX/=length;
		bullet.directionY/=length;
	}

	// var projectile1 = new Projectile(monsterImage,32,32,100,canvas.height/2, 1, 90, "boss");

  var Hero = function(img, w, h, x, y, speed, degrees, type, hitpoints) {
		Sprite.call(this, img, w, h, x, y, speed, degrees);
		this.type = type;
		this.hitpoints = hitpoints;
		this.update = function() {
			this.x += Math.floor(this.velX);
			this.y += Math.floor(this.velY);
			this.friction();
		};
	};
	
  var Monster = function(img, w, h, x, y, speed, degrees, type) {
		Sprite.call(this, img, w, h, x, y, speed, degrees);
		this.heroXdiff = this.x - hero.x;
		this.heroYdiff = this.x - hero.x;
		this.type = type;
		this.coFriction = 1;
		this.update = function() {
			if (this.x < hero.x) {
				this.velX+=this.speed;
				this.degrees = 270;
			}
			if (this.x > hero.x) {
				this.velX-=this.speed;
				this.degrees = 90;
			}
			if (this.y < hero.y) {
				this.velY+=this.speed;
				this.degrees = 180;
			}
			if (this.y > hero.y) {
				this.velY-=this.speed;
				this.degrees = 0;
			}
			this.x += this.velX;
			this.y += this.velY;
			this.friction();
		};
		
		allMonsters.push(this);
	};	
	
  var Obstacle = function(img, w, h, x, y, speed, degrees, type) {
		Sprite.call(this, img, w, h, x, y, speed, degrees);
		this.type = type;
		allObstacles.push(this);
	};

  var Potion = function(img, w, h, x, y, speed, degrees, type) {
		Sprite.call(this, img, w, h, x, y, speed, degrees);
		this.type = type;	
		this.update = function() {
			this.velY += this.speed;
		};
		allPotions.push(this);
	};
	

// Monster.prototype = Object.create(Sprite.prototype);

var monster = new Monster(monsterImage,32,32,100,canvas.height/2, 1, 0, "boss");
var monster2 = new Monster(monsterImage,32,32,350,canvas.height/2, 1,0,"boss");
var obstacle1 = new Obstacle(obstacleImage,32,32,30,canvas.height/2, 1,1,"post");
obstacle1.velY = 200;
var hero = new Hero(heroImage,32,32,canvas.width/2,canvas.height/2, 1, 0, "normal",100);
var healthpotion = new Potion(potionImage,32,32,canvas.width/2,canvas.height/2, 25, 0, "normal");
console.log(monster.type);


//######### functions

//######### input ***

//adding event listeners
 // gets mouse position and runs the shoot function
 addEventListener('mousedown', mouseClick);
 function mouseClick(e) {
	 mouseCoords =  [e.clientX, e.clientY];
	 console.log([e.clientX, e.clientY]);
	 console.log(allProjectiles);
	 if (allProjectiles.length < 3) {
		 shoot();
	 }
 }

var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

//get key input

var input = function (modifier) {
	// checks for user input
	if ("w" in keysDown) { // Player holding up
				hero.velY -= hero.speed;
				hero.degrees = 0;
	}
	if ("a" in keysDown) { // Player holding left
		hero.velX -= hero.speed;
		hero.degrees = 270;
	}
	if ("s" in keysDown) { // Player holding down
		hero.velY += hero.speed;
		hero.degrees = 180;
	}
	if ("d" in keysDown) { // Player holding right
		hero.velX += hero.speed;
		hero.degrees = 90;
		console.log(bgX);
	}
};
//######### updates ***	
function update() {
	hero.update();
	bgX -= hero.velX;
	bgY -= hero.velY;
	for (var monster in allMonsters) {
		allMonsters[monster].update();
		if (
				hero.x <= allMonsters[monster].x + allMonsters[monster].w &&
				allMonsters[monster].x <= (hero.x + hero.w) &&
				hero.y <= allMonsters[monster].y + allMonsters[monster].w &&
				allMonsters[monster].y <= (hero.y + hero.w)
			) {
				console.log(allMonsters[monster].y);
				hero.hitpoints -= 10;
				allMonsters.splice(monster, 1);
			}
		}
		// check to see if projectile collides with monster...	
		for (var projectile in allProjectiles) {
			for (monster in allMonsters) {
				if (
					allProjectiles[projectile].x <= (allMonsters[monster].x + allMonsters[monster].w) &&
					allMonsters[monster].x <= (allProjectiles[projectile].x + allProjectiles[projectile].w) &&
					allProjectiles[projectile].y <= (allMonsters[monster].y + allMonsters[monster].h) &&
					allMonsters[monster].y <= (allProjectiles[projectile].y + allProjectiles[projectile].h)
				){
					console.log("collided");
				}
			}
		}
		//get rid of allProjectiles when off screen or destroyed
		for (projectile in allProjectiles) {
		if (
			allProjectiles[projectile].x > canvas.width ||
			allProjectiles[projectile].x < 0 ||
			allProjectiles[projectile].y > canvas.height ||
			allProjectiles[projectile].y < 0
			// allProjectiles[projectile].state == "destroyed"
		) {
			allProjectiles.splice(projectile, 1);
		}
	}
	for (var obstacle in allObstacles) {
		if (
				hero.x <= allObstacles[obstacle].x + allObstacles[obstacle].w &&
				allObstacles[obstacle].x <= (hero.x + hero.w) &&
				hero.y <= allObstacles[obstacle].y + allObstacles[obstacle].w &&
				allObstacles[obstacle].y <= (hero.y + hero.w)
			) {
				console.log(allObstacles[obstacle].y);
				hero.hitpoints -= 10;
				allObstacles.splice(obstacle, 1);
			}
		}
		for (var projectile in allProjectiles) {
			allProjectiles[projectile].update();
		}

	//keep the hero on the screen at all times
	if (hero.x <= 100) {
		hero.x = 100;
	}
	if (hero.x >= canvas.width-hero.w) {
		hero.x = canvas.width-hero.w;
	}
	if (hero.y < 0) {
		hero.y = 0;
	}
	if (hero.y >= canvas.height-hero.h) {
		hero.y = canvas.height-hero.h;
	}
}

//######### render
function render() {
	if (bgReady) {
		ctx.drawImage(bgImage, bgX, 0);
		if (bgX < 0) {
			ctx.drawImage(bgImage, bgX+bgImage.width, 0);
			if (bgX < -bgImage.width) {
				bgX = 0;
			}
		}
		if (bgX > 0 ) {
			ctx.drawImage(bgImage, bgX-bgImage.width, 0);
			if (bgX > bgImage.width) {
				bgX = 0;
			}
		}
		// if (bgY < 0) {
		// 	ctx.drawImage(bgImage, 0, bgY+bgImage.height);
		// 	if (bgY < -bgImage.width) {
		// 		bgY = 0;
		// 	}
		// }
		// if (bgY > 0 ) {
		// 	ctx.drawImage(bgImage, 0, bgY-bgImage.height);
		// 	if (bgY > bgImage.width) {
		// 		bgY = 0;
		// 	}
		// }
		// uncomment below to create locked backwards movement
		// if (bgX > 0 ) {
		// 	console.log("register image past edges backward");
		// 	ctx.drawImage(bgImage, bgX-bgImage.width, 0);
		// 	if (bgX < bgImage.width) {
		// 		bgX = 0;
		// 	}
		// }
		// console.log("background drawn successfully")
	}
  
    // then hero on top of background
	hero.draw();	

	for (var monster in allMonsters) {
		allMonsters[monster].draw();
	}
	for (var obstacle in allObstacles) {
		allObstacles[obstacle].draw();
	}
	for (var projectile in allProjectiles) {
		allProjectiles[projectile].draw();
	}

	// create gradient
	var grd = ctx.createLinearGradient(0, 0, 200, 0);
	grd.addColorStop(0, "red");
	grd.addColorStop(1, "white");
	
	// then fill with gradient tied to hero health
	ctx.fillStyle = grd;
	ctx.fillRect(10, 10, hero.hitpoints, 20);
}

//######### main function and run once functions
var main = function () {
	now = Date.now();
	delta = now - then;
	input(delta / 1000);
	update(delta / 1000);
	render(delta / 1000);
	then = now;
	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
// hero.reset();
main();