var canvas;
var cenario, form;
var database;
var allPlayers;
var carimg1, carimg2;
var pista, player;
var car1, car2;
var cars = [];
//declarar as variáveis playerCount e gameState
var playerCount = 0;
var gameState = 0;
var coins, fuels, coinImg, fuelImg;
var o1,o2,obs ;  
var life, lifeImg
var explosao
function preload() {
  cenario = loadImage("planodefundo.png");
  carimg1 = loadImage("car1.png");
  carimg2 = loadImage("car2.png");
  pista = loadImage("pista.png");
  coinImg = loadImage("bitcoin.png")
  fuelImg = loadImage("Topax.png")
  lifeImg = loadImage("colazon.png")
  o1 = loadImage("The preda.png")
  o2 = loadImage("jacale.png")
  explosao = loadImage("explosion.gif")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
 
  game = new Game();
  game.start();
  game.getState();
}

function draw() {
  background(cenario);
  if(playerCount==2){
    game.update(1);
  }

  if(gameState == 1){
    game.play();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


