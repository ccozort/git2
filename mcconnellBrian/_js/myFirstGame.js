// lovingly stolen http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
//and modified heavily

// Create the canvas
// Declares variables to hold the canvas object/API

// Create the canvas element 
var canvas = document.createElement("canvas");
// Takes canvas and gets its context and puts that value in the ctx variable
var ctx = canvas.getContext("2d");
// Set canvas width and height 
canvas.width = 512;
canvas.height = 480;
// Appends the canvas to the document object 
document.body.appendChild(canvas);

// I can create elements on a page dynamically with js and 
var paragraph = document.createElement("p");
document.body.appendChild(paragraph);
/* I can access elements by the order in which they appear on a 
page and edit */
document.getElementsByTagName("p")[0].innerHTML="Hello World";

// Global Variables
var gravity = 9.8;
var monstersCaught = 0;
var tick = 0;
var delta;
var canJump = 1;
var allMonsters = [];
var allProjectiles = [];
var wave = 10;

// Variables for the timer
var timer;
var timerThen = Math.floor(Date.now()/1000);
var timeToDie = 30;
var timerNow;
var currentTimer; 
var countDown;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "Images/background.png";

// Game objects 

// Set up the images and characters
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "Images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "Images/monster.png";

// projectile image
var projectileReady = false;
var projectileImage = new Image();
projectileImage.onload = function () {
	projectileReady = true;
};
projectileImage.src = "Images/projectile.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	messages: ["Yes", "No", "Why"],
	gravity: 1,
	grounded: true,
	jump: function () {
		this.y -= 65;
	}
};

// The function for the monster
function Monster() {
	this.gravity = 100;
	this.x = Math.random()*(canvas.width-100);
	this.y = 0;
	this.jump = function() {
		this.y = 0;
	};
	allMonsters.push(this);
}

// The function for the projectile
function Projectile() {
	this.speed = 25;
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.fired = false;
	allProjectiles.push(this);
}

var projectile = new Projectile(); 
console.log(projectile.fired);

//Create the monster waves 
function range(start, end) {
	var arr = [];
	for (let i = start; i <= end; i++) {
		arr.push(i);
	}
	return arr;
}

function monsterWave(max) {
	for (monster in range(1, max)) {
		monster = new Monster();
	}
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
	ctx.drawImage(img, frameX * width, frameY * height, width, height, canvasX, canvasY, width, height);
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.key];
}, false);

// generate random number
var randNum = function (x) {
	return Math.floor(Math.random() * x);
};

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width-64;
	hero.y = canvas.height-64;

	// Throw the monster somewhere on the screen randomly
	monsterWave(wave);
	projectile.x = hero.x;
	projectile.y = hero.y;
	// Canvas height might not work for my image 
	// Could make the monster move around?
};

// Speedup the hero
var speedUp = function (x) {
	hero.speed += x;
};

var input = function(modifier) {
	if ("w" in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if ("s" in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if ("a" in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if ("d" in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	if (" " in keysDown) { // Player presses space 
		projectile.fired = true;
		projectileImage.src = "Images/projectile.png";
	}
}

// Update game objects
var update = function (modifier) {
	// The projectile movement 
	if (projectile.fired == true) {
		projectile.y -= projectile.speed;
	}
	if (projectile.y < 0) {
		projectile.fired = false;
	}
	if (projectile.fired == false) {
		projectile.x = hero.x;
		projectile.y = hero.y;
	}

	// The hero and monster border conditions
	if (hero.y > canvas.height-100){
		hero.y = canvas.height-100;
	}
	if (hero.x > canvas.width-100){
		hero.x = 0;
	}
	if (hero.y < 0){
		hero.y = 0;
	}
	if (hero.x < 0){
		hero.x = 512-116;
	}

	// Send more waves

	if (allMonsters.length == 0) {
		wave+=10;
		monsterWave(wave);
	}

	// The monster crosses the screen whenever it touches the border
	// if (
	// 	Monster.y > canvas.height-100
	// 	&& canJump >= 1
	// ) {
	// 	Monster.y = 1;
	// 	canJump = 0;
	// }
	// if (
	// 	Monster.x > canvas.width-100
	// 	&& canJump >= 1
	// ) {
	// 	Monster.x = 1;
	// 	canJump = 0
	// }
	// if (
	// 	Monster.y < 0
	// 	&& canJump >= 1
	// ) {
	// 	Monster.y = 480-120;
	// 	canJump = 0;
	// }
	// if (
	// 	Monster.x < 0
	// 	&& canJump >= 1
	// ) {
	// 	Monster.x = 512-120;
	// 	canJump = 0;
	// }
	
	// Are they touching?
	// if (
	// 	hero.x <= (monster.x + 32)
	// 	&& monster.x <= (hero.x + 32)
	// 	&& hero.y <= (monster.y + 32)
	// 	&& monster.y <= (hero.y + 32)
	// ) {
	// 	++monstersCaught;
	// 	++canJump;
	// 	reset();
	// }

	for (monster in allMonsters) {
		ctx.fillStyle = "#FF0000";
		ctx.fillRect(allMonsters[monster].x, allMonsters[monster].y, allMonsters[monster].hitpoints * 5, 50);
		if (allMonsters[monster].y <= canvas.height) {
			allMonsters[monster].y += allMonsters[monster].gravity * modifier;
		}
		if (allMonsters[monster].y > canvas.height) {
			allMonsters[monster].jump();
			allMonsters[monster].x = randNum((canvas.width-100));
		}
	}

	// Applies the gravity to the hero 
	hero.y += hero.gravity;
	
	// Collision 
	for (monster in allMonsters) {
		if (
			hero.x <= (allMonsters[monster].x + 32) &&
			allMonsters[monster].x <= (hero.x + 32) &&
			hero.y <= (allMonsters[monster].y + 32) &&
			allMonsters[monster].y <= (hero.y + 32)
		) {
			++monstersCaught;
			allMonsters.splice(monster, 1);
		}
	}

	// Collision with the fireballs 
	for (monster in allMonsters) {
		if (
			projectile.x <= (allMonsters[monster].x + 32) &&
			allMonsters[monster].x <= (projectile.x + 32) &&
			projectile.y <= (allMonsters[monster].y + 32) &&
			allMonsters[monster].y <= (projectile.y + 32)
		) {
			shot = true;
			++monstersCaught;
			timeToDie+=5;
			allMonsters.splice(monster, 1);
			}
	}

	// Monster running away
	// if (
	// 	hero.x > monster.x
	// 	&& hero.y > monster.y
	// 	&& canJump >= 1
	// ) {
	// 	monster.x = monster.x - 2;
	// 	monster.y = monster.y - 2;
	// }
	// if (
	// 	hero.x < monster.x
	// 	&& hero.y > monster.y
	// 	&& canJump >= 1
	// ) {
	// 	monster.x = monster.x + 2;
	// 	monster.y = monster.y - 2;
	// }
	// if (
	// 	hero.x > monster.x
	// 	&& hero.y < monster.y
	// 	&& canJump >= 1
	// ) {
	// 	monster.x = monster.x - 2;
	// 	monster.y = monster.y + 2;
	// }
	// if (
	// 	hero.x < monster.x
	// 	&& hero.y < monster.y
	// 	&& canJump >= 1
	// ) {
	// 	monster.x = monster.x + 2;
	// 	monster.y = monster.y + 2;
	// }

	// The timer

	timerNow = Math.floor(Date.now()/1000);
	currentTimer = timerNow - timerThen;
	countDown = timeToDie - currentTimer;
	
	if (countDown < 0) {
		console.log("Time's up!");
		countDown = 0;
	}
};

// End of update

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	// if (monsterReady) {
	// 	ctx.drawImage(monsterImage, monster.x, monster.y);
	// }

	if (projectileReady) {
		ctx.drawImage(projectileImage, projectile.x, projectile.y);
	}

	//render monsters
	if (monsterReady) {
		for (monster in allMonsters) {
			ctx.drawImage(monsterImage, allMonsters[monster].x, allMonsters[monster].y);
		}
	}


	// All text that goes on the screen 

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 15);

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "right";
	ctx.textBaseline = "top";
	ctx.fillText("Time Left: " + countDown, 450, 15);
};

// The timer in the top right 
var ticker = function() {
	var now = Date.now();
	var delta = now - then;
	tick = tick + delta;
	return Math.floor(tick/1000);
}

// The main game loop
var main = function () {
	var now = Date.now();
	delta = now - then;
	input(delta / 1000)
	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
var delta;
var now;
reset();
main();