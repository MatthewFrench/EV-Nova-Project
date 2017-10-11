function drawString(ctx, text, posX, posY, textColor, rotation, font, fontSize) {
	var lines = text.split("\n");
	if(!rotation)
		rotation = 0;
	if(!font)
		font = "'serif'";
	if(!fontSize)
		fontSize = 16;
	if(!textColor)
		textColor = '#000000';

	ctx.save();
	ctx.fillStyle = textColor;
	ctx.font = fontSize + "px " + font;

	ctx.translate(posX, posY);
	ctx.rotate(rotation * Math.PI / 180);
	ctx.strokeStyle = 'rgb(255,255,255)';
	for( i = 0; i < lines.length; i++) {
		ctx.strokeText(lines[i], 0, i * fontSize - 1);
		ctx.strokeText(lines[i], 0, i * fontSize + 1);
		ctx.strokeText(lines[i], -1, i * fontSize);
		ctx.strokeText(lines[i], 1, i * fontSize);
		ctx.fillText(lines[i], 0, i * fontSize);
	}
	ctx.restore();
}

function fillRoundedRect(ctx, x, y, w, h, r) {

	ctx.beginPath();

	ctx.moveTo(x + r, y);

	ctx.lineTo(x + w - r, y);

	ctx.quadraticCurveTo(x + w, y, x + w, y + r);

	ctx.lineTo(x + w, y + h - r);

	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);

	ctx.lineTo(x + r, y + h);

	ctx.quadraticCurveTo(x, y + h, x, y + h - r);

	ctx.lineTo(x, y + r);

	ctx.quadraticCurveTo(x, y, x + r, y);

	ctx.fill();

}

//2D Point object
function Point2D(x, y) {
	this.x = x;
	this.y = y;
}
