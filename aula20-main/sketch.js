var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var gameOver, restart;

var jumpSound, checkPointSound, dieSound;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  checkPointSound = loadSound("checkpoint.mp3");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50, height - 40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;

  ground = createSprite(width / 2, height - 20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3 * score / 100);

  gameOver = createSprite(width / 2, height / 2);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2 + 40);
  restart.addImage(restartImg);

  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(width / 2, height - 10, width, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);

  textSize(20);
  text("Score: " + score, width - 100, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + 3 * score / 100);
    //mudar a animação do trex
    trex.changeAnimation("running", trex_running);

    if (score > 0 && score % 100 === 0) {
      //colocar o som para tocar
      checkPointSound.play();

    }

    if (touches.length > 0 || keyDown("space")) {
      if (trex.y >= height - 40) {
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
      }
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //definir a velocidade de cada objeto do jogo para 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //mudar a animação do trex
    trex.changeAnimation("collided", trex_collided);

    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart) || touches.length > 0) {
      touches = [];
      reset();
    }
  }


  drawSprites();
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width + 10, height - 100, 10, 10);
    cloud.y = Math.round(random(height - 150, height - 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //atribua tempo de vida à variável
    cloud.lifetime = 200;

    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adicione cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }

}

//função reset
function reset() {
  gameState = PLAY;
  trex.changeAnimation("running", trex_running);
  score = 0;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(width + 10, height - 35, 10, 40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3 * score / 100);

    //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //atribua dimensão e tempo de vida aos obstáculos           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

