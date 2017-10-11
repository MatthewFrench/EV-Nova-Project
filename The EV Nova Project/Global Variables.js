var loadImages = 0;
var loadCount = 0;

var hudImg = new Image();
var shipAnimations = new Array();

var ships = new Array();
var projectiles = new Array();

var player;

var up = false;
var down = false;
var left = false;
var right = false;
var spaceBar = false;

var solarSystemRadius = 3000;
var starArray = new Array();

var redraw = false;
var redrawHud = false;
var redrawCount = 0;

var startTickTime;
var endTickTime;
var delta;
var hudCanvas = document.getElementById("hudCanvas");
var hudCtx = hudCanvas.getContext("2d");
var gameCanvas = document.getElementById("mainCanvas");
var gameCtx = gameCanvas.getContext("2d");

var mapXOrigin = 10;
var mapYOrigin = 10;
var mapXSize = 175;
var mapYSize = 175;

var cameraX;
var cameraY;

var redrawStart;
var redrawEnd;
var delta;
TypeOfShip = {
	DarkFlier : 0//,
	//GREEN : 1,
	//BLUE : 2
}
TypeOfWeapon = {
	Blaster : 0//,
	//GREEN : 1,
	//BLUE : 2
}