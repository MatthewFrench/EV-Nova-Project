//Ship object
function Ship(shipType) {
	//Load ship images
	this.animation = shipAnimations[shipType];
	//Set ship vars, position, health, velocity, weapons
	this.position = new Point2D(0, 0);
	this.velocity = new Point2D(0, 0);
	this.acceleration = 0.1;
	this.topVelocity = 2;
	this.slowFactor = 0.9;
	this.rotation = 0;
	this.rotationSpeed = 2.0;
	this.armor = 25;
	this.shield = 50;
	this.energy = 75;

	this.shipAnimCount = 0;
	this.shipAnimTimer = 0;
	this.shipAnimTimerMax = 3;
	this.propulsionAnimCount = 0;
	this.propulsionAnimTimer = 0;
	this.propulsionAnimTimerMax = 3;

	this.propulsion = this.animation.propulsionStraight;
	this.ship = this.animation.shipStraight;

	this.left = false;
	this.right = false;
	this.up = false;
	this.down = false;
	
	this.spaceBar = false;
	
	this.weapon = TypeOfWeapon.Blaster;
	this.weaponCount = 0;

	ships.push(this);

	this.Move = function() {
		//Player animation
		this.shipAnimTimer += 1;
		if(this.shipAnimTimer > this.shipAnimTimerMax) {
			this.shipAnimTimer = 0;
			this.shipAnimCount += 1;
			if(this.shipAnimCount >= this.animation.shipAnimMax) {
				this.shipAnimCount = 0;
			}
		}

		//Propulsion animation
		if(this.left) {
			this.propulsion = this.animation.propulsionLeft;
		}//If going left, show left propulsion
		if(this.right) {
			this.propulsion = this.animation.propulsionRight;
		}//If going right, show right propulsion
		if((this.left && this.right) || (!this.left && !this.right)) {
			this.propulsion = this.animation.propulsionStraight;
		}//Otherwise show straight propulsion
		//If accelerating
		if(this.up) {
			if(this.propulsionAnimCount == -1) {
				this.propulsionAnimCount = 0;
			} else {
				this.propulsionAnimCount += 1;
				if(this.propulsionAnimCount >= this.animation.propulsionAnimMax) {
					this.propulsionAnimCount = 10;
				}
			}
		} else {
			//Not accelerating so slow down until eventual stop
			if(this.propulsionAnimCount > 10) {
				this.propulsionAnimCount = 10;
			} else if(this.propulsionAnimCount > -1) {
				this.propulsionAnimCount -= 1;
			}
		}

		if(this.up) {
			//Speeds Up
			var rot = Math.PI * this.rotation / 180;
			var newVelX = this.velocity.x + (Math.cos(rot) * this.acceleration);
			var newVelY = this.velocity.y + (Math.sin(rot) * this.acceleration);
			if(newVelX * newVelX + newVelY * newVelY > this.topVelocity * this.topVelocity) {
				var theta = Math.atan2(newVelY, newVelX);
				newVelX = (Math.cos(theta) * this.topVelocity);
				newVelY = (Math.sin(theta) * this.topVelocity);
			}
			this.velocity.x = newVelX;
			this.velocity.y = newVelY;
		}
		if(this.down) {
			//Slows down
			this.velocity.x *= this.slowFactor;
			this.velocity.y *= this.slowFactor;
			if(Math.abs(this.velocity.x) < 0.005) {
				this.velocity.x = 0;
			}
			if(Math.abs(this.velocity.y) < 0.005) {
				this.velocity.y = 0;
			}
		}
		if(this.left) {
			this.rotation -= this.rotationSpeed;
			redraw = true;
			this.ship = this.animation.shipLeft;
		}
		if(this.right) {
			this.rotation += this.rotationSpeed;
			redraw = true;
			this.ship = this.animation.shipRight;
		}
		if((this.left && this.right) || (!this.left && !this.right)) {
			this.ship = this.animation.shipStraight;
			redraw = true;
		}
		if(this.rotation < 0) {
			this.rotation += 360;
		}
		if(this.rotation >= 360) {
			this.rotation -= 360;
		}
		if(spaceBar) {
			//Shoot projectiles
			if (this.weaponCount == 0) {
				new Projectile(this, this.weapon, this.position, this.rotation);
				
				this.weaponCount = 60;
			}
		}
		if (this.weaponCount > 0) {this.weaponCount -=1;}
		
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if(this.position.x > solarSystemRadius) {
			this.position.x = -solarSystemRadius;
		}
		if(this.position.x < -solarSystemRadius) {
			this.position.x = solarSystemRadius;
		}
		if(this.position.y > solarSystemRadius) {
			this.position.y = -solarSystemRadius;
		}
		if(this.position.y < -solarSystemRadius) {
			this.position.y = solarSystemRadius;
		}
		if(this.velocity.x != 0 || this.velocity.y != 0) {
			redraw = true;
		}
	}

	this.Draw = function()  {
		var rot = this.rotation * Math.PI / 180.0;

		//var canvas = document.getElementById("mainCanvas");
		//var addX = ();
		//var addY;

		gameCtx.translate((this.position.x-cameraX), (this.position.y-cameraY));
		gameCtx.rotate(rot);
		gameCtx.drawImage(this.ship[this.shipAnimCount], -this.ship[this.shipAnimCount].width / 2, -this.ship[this.shipAnimCount].height / 2);

		if(this.propulsionAnimCount != -1) {
			gameCtx.drawImage(this.propulsion[this.propulsionAnimCount], -this.propulsion[this.propulsionAnimCount].width / 2, -this.propulsion[this.propulsionAnimCount].height / 2);
		}

		gameCtx.rotate(-rot);
		gameCtx.translate(-(this.position.x-cameraX), -(this.position.y-cameraY));
	}

}
