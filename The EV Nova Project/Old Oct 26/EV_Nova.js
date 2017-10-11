/**
  EV Nova Code
*/

var loadImages = 0;
var loadCount = 0;
var playerImg = new Image();
var playerLeft = new Image();
var playerRight = new Image();
var hudImg = new Image();

var player;

var playerX = 50;
var playerY = 50;

var playerVelX = 0;
var playerVelY = 0;
var playerAccel = 0.1;
var playerTopVel = 2;
var playerSlowFactor = 0.9;

var playerRotation = 0;
var playerRotationSpeed = 2.0;

var playerArmor = 100;
var playerShield = 100;
var playerEnergy = 100;

var up = false;
var down = false;
var left = false;
var right = false;
var spaceBar = false;

var solarSystemRadius = 3000;
var starArray = new Array();

var redraw = false;
var redrawCount = 0;

function initialize() {
	if (loadImages == 0) {
		//Make the star map
		for (i = 0; i < 1000; i++) {
			starArray[i] = [(Math.random()* solarSystemRadius*2)-solarSystemRadius,(Math.random()* solarSystemRadius*2)-solarSystemRadius];
		}

		playerImg.src = "Player.png";
		playerImg.onload = function() {
        		loadImages += 1;
			initialize();
    		}
		loadCount += 1;
		playerLeft.src = "PlayerLeft.png";
		playerLeft.onload = function() {
        		loadImages += 1;
			initialize();
    		}
		loadCount += 1;
		playerRight.src = "PlayerRight.png";
		playerRight.onload = function() {
        		loadImages += 1;
			initialize();
    		}
		loadCount += 1;
		hudImg.src = "HUD.png";
		hudImg.onload = function() {
        		loadImages += 1;
			initialize();
    		}
		loadCount += 1;
	} else if (loadImages == loadCount) {
		player = playerImg;
		updateCanvas();
		updateHUD();
		//Start Timer
		setTimeout(gameLogic, 1000/60);
	}
}

function gameLogic() {
	setTimeout(gameLogic, 16.6666666666667);
	if (up) {
		//Speeds Up
		var rot = Math.PI * playerRotation / 180;
		var newVelX = playerVelX + (Math.cos(rot)*playerAccel);
		var newVelY = playerVelY + (Math.sin(rot)*playerAccel);
		if (newVelX* newVelX +newVelY* newVelY > playerTopVel* playerTopVel) {
			var theta = Math.atan2(newVelY,newVelX);
			newVelX = (Math.cos(theta)* playerTopVel);
			newVelY = (Math.sin(theta)* playerTopVel);
		}
		playerVelX = newVelX;
		playerVelY = newVelY;
	}
	//if (down) {
		//Slows down
	//	playerVelX *= playerSlowFactor;
	//	playerVelY *= playerSlowFactor;
	//	if (Math.abs(playerVelX) < 0.01) {playerVelX = 0;}
	//	if (Math.abs(playerVelY) < 0.01) {playerVelY = 0;}
	//}
	if (left || down) {playerRotation -= playerRotationSpeed;redraw = true; player = playerLeft;}
	if (right) {playerRotation += playerRotationSpeed;redraw = true; player = playerRight;}
	if ((left && right) || (!left && !right)) {player = playerImg; redraw = true;}
	if (spaceBar) {
		//Shoot projectiles
		
	}
	playerX += playerVelX;
	playerY += playerVelY;
	var canvas = document.getElementById("mainCanvas");
	if (playerX > solarSystemRadius-canvas.width/2) {playerX = -solarSystemRadius+canvas.width/2;}
	if (playerX < -solarSystemRadius+canvas.width/2) {playerX = solarSystemRadius-canvas.width/2;}
	if (playerY > solarSystemRadius-canvas.height/2) {playerY = -solarSystemRadius+canvas.height/2;}
	if (playerY < -solarSystemRadius+canvas.height/2) {playerY = solarSystemRadius-canvas.height/2;}
	if (playerVelX != 0 || playerVelY != 0) {redraw = true;}

	if (redraw && redrawCount > 1) {
		redrawCount = 0;
		redraw = false;
		updateCanvas();
		updateHUD();
	}
	redrawCount += 1;
}

function updateCanvas() {
	var canvas = document.getElementById("mainCanvas");
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0,0,canvas.width,canvas.height)

	var cameraX = playerX + canvas.width/2;
	var cameraY = playerY + canvas.height/2;

	//Draw the stars
	var x;
	var y;
	for (i = 0; i < 1000; i++) {
		x = starArray[i][0] - cameraX + canvas.width;
		y = starArray[i][1] - cameraY + canvas.height;
		if (x > -3 && x < canvas.width+3 && y > -3 && y < canvas.height+3) {
			ctx.beginPath();
			ctx.arc(x, y, 2, 0, 2 * Math.PI, false);
			ctx.fillStyle = "rgb(255, 255, 255)";
			ctx.fill();
		}
	}

	ctx.translate(cameraX - playerX, cameraY - playerY);
	ctx.rotate(Math.PI * playerRotation / 180);
	ctx.drawImage(player, -player.width/2, -player.height/2);
	ctx.rotate(-Math.PI * playerRotation / 180);
	ctx.translate(-(cameraX -playerX), -(cameraY -playerY));
}
function updateHUD() {
	var canvas = document.getElementById("hudCanvas");
	var ctx = canvas.getContext("2d");

	ctx.drawImage(hudImg, 0, 0);
	
	//Shield Bar
	var lingrad = ctx.createLinearGradient(0,188,0,207);
    	lingrad.addColorStop(0.25, 'rgba(250,100,100,0.4)');
	lingrad.addColorStop(0.5, 'rgba(250,0,0,1.0)');
    	lingrad.addColorStop(1, 'rgba(150,0,0,0.8)');
    	ctx.fillStyle = lingrad;
	fillRoundedRect(ctx, 34,198,185-34,(207-198)*playerShield/100, 4)

	//Armor Bar
	lingrad = ctx.createLinearGradient(0,215,0,224);
    	lingrad.addColorStop(0.25, 'rgba(0,50,250,0.8)');
	lingrad.addColorStop(0.5, 'rgba(0,0,250,1.0)');
    	lingrad.addColorStop(1, 'rgba(0,0,150,0.8)');
    	ctx.fillStyle = lingrad;
	fillRoundedRect(ctx, 34,215,185-34,(224-215)*playerArmor/100, 4)

	//Energy Bar
	var lingrad = ctx.createLinearGradient(0,233,0,242);
    	lingrad.addColorStop(0.25, 'rgba(250,250,250,0.8)');
	lingrad.addColorStop(0.5, 'rgba(200,200,200,1.0)');
    	lingrad.addColorStop(1, 'rgba(150,150,150,0.8)');
    	ctx.fillStyle = lingrad;
	fillRoundedRect(ctx, 34,233,185-34,(242-233)*playerEnergy/100, 4)

	//Draw Map
	var mapXOrigin = 10;
	var mapYOrigin = 10;
	var mapXSize = 175;
	var mapYSize = 175;
	
	var playerMapX = (playerX+solarSystemRadius)/(solarSystemRadius*2)*mapXSize + mapXOrigin;
	var playerMapY = (playerY+solarSystemRadius)/(solarSystemRadius*2)*mapYSize + mapYOrigin;

	ctx.beginPath();
	ctx.arc(playerMapX, playerMapY, 2, 0, 2 * Math.PI, false);
	ctx.fillStyle = "rgb(0, 255, 255)";
	ctx.fill();
}


/////////////////////////
//
// handleKeydown
// - Handles keyboard input.
//
function handleKeydown (ev) {
	key = ( (ev.which) || (ev.keyCode) );
	// Up arrow.
	if (key == 38) {
		up = true;
	}
	// Down arrow.
	if (key == 40) {
		down = true;
	}
	// Left arrow.
	if (key == 37) {
		left = true;
	}
	// Right arrow.
	if (key == 39) {
		right = true;
	}
	//Space bar
	if (key == 32) {
		spaceBat = true;
	}
}
function handleKeyup (ev) {
	key = ( (ev.which) || (ev.keyCode) );
	// Up arrow.
	if (key == 38) {
		up = false;
	}
	// Down arrow.
	if (key == 40) {
		down = false;
	}
	// Left arrow.
	if (key == 37) {
		left = false;
	}
	// Right arrow.
	if (key == 39) {
		right = false;
	}
	//Space bar
	if (key == 32) {
		spaceBat = false;
	}
}

function drawString(ctx, text, posX, posY, textColor, rotation, font, fontSize) {
	var lines = text.split("\n");
	if (!rotation) rotation = 0;
	if (!font) font = "'serif'";
	if (!fontSize) fontSize = 16;
	if (!textColor) textColor = '#000000';
	
    ctx.save();
	ctx.fillStyle = textColor;
    ctx.font = fontSize + "px " + font;
	
    ctx.translate(posX, posY);
	ctx.rotate(rotation * Math.PI / 180);
    ctx.strokeStyle = 'rgb(255,255,255)';
    for (i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i],0, i*fontSize-1);
        ctx.strokeText(lines[i],0, i*fontSize+1);
        ctx.strokeText(lines[i],-1, i*fontSize);
        ctx.strokeText(lines[i],1, i*fontSize);
        ctx.fillText(lines[i],0, i*fontSize);
	}
	ctx.restore();
}

function fillRoundedRect(ctx, x, y, w, h, r){

        ctx.beginPath();

        ctx.moveTo(x+r, y);

        ctx.lineTo(x+w-r, y);

        ctx.quadraticCurveTo(x+w, y, x+w, y+r);

        ctx.lineTo(x+w, y+h-r);

        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);

        ctx.lineTo(x+r, y+h);

        ctx.quadraticCurveTo(x, y+h, x, y+h-r);

        ctx.lineTo(x, y+r);

        ctx.quadraticCurveTo(x, y, x+r, y);

        ctx.fill();        

    }

/**/