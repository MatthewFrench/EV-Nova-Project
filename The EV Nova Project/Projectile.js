//Projectile object
function Projectile(originShip, weaponType, position, rotation) {
	//Position, velocity, projectile type
	this.position = new Point2D(position.x,position.y);
	this.velocity = new Point2D(Math.cos(rotation*Math.PI/180)*2,Math.sin(rotation*Math.PI/180)*2);
	this.acceleration = 1.0;
	this.topVelocity = 2.0;
	this.originShip = originShip;
	this.rotation = rotation;
	projectiles.push(this);
	this.Move = function() {
		
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

		if(this.rotation < 0) {
			this.rotation += 360;
		}
		if(this.rotation >= 360) {
			this.rotation -= 360;
		}

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
	this.Draw = function() {
		var rot = this.rotation * Math.PI / 180.0;

		gameCtx.translate((this.position.x-cameraX), (this.position.y-cameraY));
		gameCtx.rotate(rot);
		
		gameCtx.beginPath();
		gameCtx.arc(-1, -1, 2, 0, 2 * Math.PI, false);
		gameCtx.fillStyle = "rgb(0, 255, 255)";
		gameCtx.fill();

		gameCtx.rotate(-rot);
		gameCtx.translate(-(this.position.x-cameraX), -(this.position.y-cameraY)); 
	}
}
