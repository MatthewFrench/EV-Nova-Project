/**
 EV Nova Code
 */

function initialize() {
	if(loadImages == 0) {
		//Make the star map
		for( i = 0; i < 1000; i++) {
			starArray[i] = [(Math.random() * solarSystemRadius * 2) - solarSystemRadius, (Math.random() * solarSystemRadius * 2) - solarSystemRadius];
		}

		shipAnimations[TypeOfShip.DarkFlier] = new ShipAnimation(TypeOfShip.DarkFlier);
		
		hudImg.src = "HUD.png";
		hudImg.onload = function() {
			loadImages += 1;
			initialize();
		}
		loadCount += 1;
	} else if(loadImages == loadCount) {
		player = new Ship(TypeOfShip.DarkFlier);
		
		var newShip = new Ship(TypeOfShip.DarkFlier);
		newShip.left = true;
		newShip.up = true;
		
		newShip = new Ship(TypeOfShip.DarkFlier);
		newShip.right = true;
		newShip.up = true;
		
		newShip = new Ship(TypeOfShip.DarkFlier);
		newShip.up = true;
		
		redraw = true;
		redrawHud = true;

		//Start Timer
		gameLogic();
		scheduleRedraw();
	}
}

function gameLogic() {
	starTickTime = new Date().getTime();

	player.up = up;
	player.down = down;
	player.left = left;
	player.right = right;

	//Loop through array of ships and do move
	for (i = 0; i < ships.length; i ++) {
		ships[i].Move();
	}
	//Loop through array of projectiles and move
	for (i = 0; i < projectiles.length; i ++) {
		projectiles[i].Move();
	}

	endTickTime = new Date().getTime();
	delta = endTickTime - starTickTime;
	if(16 - delta > 0)
		setTimeout(gameLogic, 16 - delta);
	else
		gameLogic();
}

function scheduleRedraw() {
	if(redraw) {
		redrawCount = 0;
		redraw = false;
		updateCanvas();
		updateMap();
	}
	if(redrawHud) {
		redrawHud = false;
		updateHUD();
	}
	setTimeout(scheduleRedraw, 0);
}

function updateCanvas() {
	gameCtx.fillStyle = "rgb(0, 0, 0)";
	gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height)

	cameraX = player.position.x;
	cameraY = player.position.y;

	//Draw the stars
	var x;
	var y;
	for( i = 0; i < 1000; i++) {
		x = starArray[i][0] - cameraX + gameCanvas.width;
		y = starArray[i][1] - cameraY + gameCanvas.height;
		if(x > -3 && x < gameCanvas.width + 3 && y > -3 && y < gameCanvas.height + 3) {
			gameCtx.beginPath();
			gameCtx.arc(x, y, 1.0, 0, 2 * Math.PI, false);
			gameCtx.fillStyle = "rgb(255, 255, 255)";
			gameCtx.fill();
		}
	}

	//Loop through array of ships and do Draw
	gameCtx.translate(gameCanvas.width/2.0, gameCanvas.height/2.0);
	for (i = 0; i < ships.length; i ++) {
		ships[i].Draw();
	}
	for (i = 0; i < projectiles.length; i ++) {
		projectiles[i].Draw();
	}
	gameCtx.translate(-gameCanvas.width/2.0, -gameCanvas.height/2.0);
}

function updateMap() {
	//Draw Map
	hudCtx.clearRect(mapXOrigin, mapYOrigin, mapXSize, mapYSize);
	
	//Draw all ships on map
	for (i = 0; i < ships.length; i ++) {
		var shipMapX = (ships[i].position.x + solarSystemRadius) / (solarSystemRadius * 2) * mapXSize + mapXOrigin;
		var shipMapY = (ships[i].position.y + solarSystemRadius) / (solarSystemRadius * 2) * mapYSize + mapYOrigin;
		
		hudCtx.beginPath();
		hudCtx.arc(shipMapX, shipMapY, 2, 0, 2 * Math.PI, false);
		hudCtx.fillStyle = "rgb(0, 255, 255)";
		hudCtx.fill();
	}
	
	/*
	var playerMapX = (playerX + solarSystemRadius) / (solarSystemRadius * 2) * mapXSize + mapXOrigin;
	var playerMapY = (playerY + solarSystemRadius) / (solarSystemRadius * 2) * mapYSize + mapYOrigin;

	hudCtx.beginPath();
	hudCtx.arc(playerMapX, playerMapY, 2, 0, 2 * Math.PI, false);
	hudCtx.fillStyle = "rgb(0, 255, 255)";
	hudCtx.fill();
	*/
}

function updateHUD() {

	hudCtx.drawImage(hudImg, 0, 0);

	//Shield Bar
	var lingrad = hudCtx.createLinearGradient(0, 188, 0, 207);
	lingrad.addColorStop(0.25, 'rgba(250,100,100,0.4)');
	lingrad.addColorStop(0.5, 'rgba(250,0,0,1.0)');
	lingrad.addColorStop(1, 'rgba(150,0,0,0.8)');
	hudCtx.fillStyle = lingrad;
	fillRoundedRect(hudCtx, 34, 198, (185 - 34) * player.shield / 100, 207 - 198, 4)

	//Armor Bar
	lingrad = hudCtx.createLinearGradient(0, 215, 0, 224);
	lingrad.addColorStop(0.25, 'rgba(0,50,250,0.8)');
	lingrad.addColorStop(0.5, 'rgba(0,0,250,1.0)');
	lingrad.addColorStop(1, 'rgba(0,0,150,0.8)');
	hudCtx.fillStyle = lingrad;
	fillRoundedRect(hudCtx, 34, 215, (185 - 34) * player.armor / 100, 224 - 215, 4)

	//Energy Bar
	var lingrad = hudCtx.createLinearGradient(0, 233, 0, 242);
	lingrad.addColorStop(0.25, 'rgba(250,250,250,0.8)');
	lingrad.addColorStop(0.5, 'rgba(200,200,200,1.0)');
	lingrad.addColorStop(1, 'rgba(150,150,150,0.8)');
	hudCtx.fillStyle = lingrad;
	fillRoundedRect(hudCtx, 34, 233, (185 - 34) * player.energy / 100, 242 - 233, 4)
}

// - Handles keyboard input.
function handleKeydown(ev) {
	key = ((ev.which) || (ev.keyCode) );
	// Up arrow.
	if(key == 38) {
		up = true;
	}
	// Down arrow.
	if(key == 40) {
		down = true;
	}
	// Left arrow.
	if(key == 37) {
		left = true;
	}
	// Right arrow.
	if(key == 39) {
		right = true;
	}
	//Space bar
	if(key == 32) {
		spaceBar = true;
	}
}

function handleKeyup(ev) {
	key = ((ev.which) || (ev.keyCode) );
	// Up arrow.
	if(key == 38) {
		up = false;
	}
	// Down arrow.
	if(key == 40) {
		down = false;
	}
	// Left arrow.
	if(key == 37) {
		left = false;
	}
	// Right arrow.
	if(key == 39) {
		right = false;
	}
	//Space bar
	if(key == 32) {
		spaceBar = false;
	}
}

//Ship Animation
function ShipAnimation(shipType) {
	this.shipType = shipType;
	var shipOffset;
	var propulsionOffset;
	var filepath;
	if(shipType == TypeOfShip.DarkFlier) {
		this.propulsionAnimMax = 16;
		this.shipAnimMax = 26;
		propulsionOffset = 50;
		shipOffset = 0;
		filepath = "Ship Gfx/Dark Flier/";
	}
	this.shipStraight = new Array(this.shipAnimMax);
	this.shipLeft = new Array(this.shipAnimMax);
	this.shipRight = new Array(this.shipAnimMax);
	this.propulsionStraight = new Array(this.propulsionAnimMax);
	this.propulsionLeft = new Array(this.propulsionAnimMax);
	this.propulsionRight = new Array(this.propulsionAnimMax);
	//Loading code propulsion
	for( i = 0; i < 3; i++) {
		var direction;
		var propulsionDir;
		if(i == 0) {
			direction = "Straight";
			propulsionDir = this.propulsionStraight;
		}
		if(i == 1) {
			direction = "Left";
			propulsionDir = this.propulsionLeft;
		}
		if(i == 2) {
			direction = "Right";
			propulsionDir = this.propulsionRight;
		}
		for( e = propulsionOffset; e < propulsionOffset + this.propulsionAnimMax; e++) {
			propulsionDir[e - propulsionOffset] = new Image();
			var num = "00" + e;
			if(e < 10) {
				num = "000" + e
			}
			propulsionDir[e - propulsionOffset].src = filepath + "Propulsion/" + direction + "_" + num + ".png";
			propulsionDir[e - propulsionOffset].onload = function() {
				loadImages += 1;
				initialize();
			}
			loadCount += 1;
		}
		if(i == 0) {
			this.propulsionStraight = propulsionDir;
		}
		if(i == 1) {
			this.propulsionLeft = propulsionDir;
		}
		if(i == 2) {
			this.propulsionRight = propulsionDir;
		}
	}

	//Ship
	for( i = 0; i < 3; i++) {
		var direction;
		var shipDir;
		if(i == 0) {
			direction = "Straight";
			shipDir = this.shipStraight;
		}
		if(i == 1) {
			direction = "Left";
			shipDir = this.shipLeft;
		}
		if(i == 2) {
			direction = "Right";
			shipDir = this.shipRight;
		}
		for( e = shipOffset; e < shipOffset + this.shipAnimMax; e++) {
			shipDir[e - shipOffset] = new Image();
			var num = "00" + e;
			if(e < 10) {
				num = "000" + e
			}
			shipDir[e - shipOffset].src = filepath + "Ship/" + direction + "_" + num + ".png";
			shipDir[e - shipOffset].onload = function() {
				loadImages += 1;
				initialize();
			}
			loadCount += 1;
		}
		if(i == 0) {
			this.shipStraight = shipDir;
		}
		if(i == 1) {
			this.shipLeft = shipDir;
		}
		if(i == 2) {
			this.shipRight = shipDir;
		}
	}
}


/**/