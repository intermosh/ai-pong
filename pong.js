// AI PONG Created using Chat GPT3 by KRANK

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const BALL_RADIUS = 3;
const PADDLE_WIDTH = 3;
const PADDLE_HEIGHT = 18;
const PADDLE_SPEED = 3;
const PADDLE_HIT_ZONES = {TOP: 0,CENTER: 1,BOTTOM: 2};

const TITLE_FONT = "30px text";
const SUBTITLE_FONT = "10px text";
const SCORE_FONT = "20px score";
const TEXT_COLOR = "grey";
const PLAYER_COLOR = "#ffFFff";
const GRADIENT_COLOR = "#ffFFff";

const player1 = { y: 50, score: 0 };
const player2 = { y: 50, score: 0 };
let ball = { x: 50, y: 50, speedX: 1.7, speedY: 1.7 };
let collisionDetected = false;

//audio samples
const paddleSound = new Audio('paddle.wav');
const wallSound = new Audio('wall.wav');
const scoreSound = new Audio('score.wav');

var gradient = context.createRadialGradient(3, 3, 0, 3, 3, 5);
var paused = true;

// variables for soft paddle movement
let player1MoveUp = false;
let player1MoveDown = false;
let player2MoveUp = false;
let player2MoveDown = false;

window.onload = function () {
  //start screen
  drawText("PONG", TITLE_FONT, canvas.width / 2, canvas.height / 3, TEXT_COLOR);
  drawText("Press SPACE to start", SUBTITLE_FONT, canvas.width / 2, canvas.height / 2);

  document.addEventListener("keydown", startGame);
};

function startGame(e) {
  console.log("key pressed.");
  //if spacebar
  if (e.keyCode === 32) {
    console.log("spacebar detected.");
    document.removeEventListener("keydown", startGame);
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    //sets neon colors
    gradient.addColorStop(1, PLAYER_COLOR);
    context.fillStyle = gradient;
    context.shadowColor = GRADIENT_COLOR;
    context.shadowBlur = 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    paused = false;
    requestAnimationFrame(runGame);
  }
}

function runGame() {

  if (paused) {
    return;
  }
  context.clearRect(0, 0, canvas.width, canvas.height);

  //draw objects
  drawObjects();

  //move ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  //check ball collisions
  checkBallCollisions();

  // check for a winner
  if (player1.score >= 10 || player2.score >= 10) {
    document.addEventListener("keydown", resetGame);
    gameOver();
    return;
  }

  requestAnimationFrame(runGame);
}

function drawObjects() {
  //draw ball
  context.beginPath();
  //context.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  context.rect(ball.x, ball.y, BALL_RADIUS, BALL_RADIUS);
  context.fill();
  context.closePath();

  // draw left paddle
  context.beginPath();
  context.rect(0, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  context.fill();
  context.closePath();

  // draw right paddle
  context.beginPath();
  context.rect(canvas.width - PADDLE_WIDTH, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  context.fill();
  context.closePath();

  // draw scores
  context.font = SCORE_FONT;
  context.fillText(player1.score, 80, 20);
  context.fillText(player2.score, canvas.width - 80, 20);

  //draw middle line
  context.setLineDash([4, 4]);
  context.lineWidth = 0.5;
  context.strokeStyle = '#ffffff';
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();
  context.setLineDash([]);
}

function checkBallCollisions() {
  if (!collisionDetected) {
    // check for ball hitting left or right wall
    if (ball.x > canvas.width) {
      scoreSound.play();
      player1.score++;
      collisionDetected = true;
      console.log("scored p1");
      resetBall();
    }
    else if (ball.x < 0) {
      scoreSound.play();
      player2.score++;
      collisionDetected = true;
      console.log("scored p2");
      resetBall();
    }

    // check for ball hitting up and down border
    if (ball.y > canvas.height || ball.y < 0) {
      ball.speedY = -ball.speedY;
      wallSound.play();
      collisionDetected = true;
    }

    // check for ball hitting left or right paddle
    if (ball.x < PADDLE_WIDTH) {
      if (ball.y > player1.y && ball.y < player1.y + PADDLE_HEIGHT) {
        collisionDetected = true;
        checkPaddleCollision(player1, ball);
      }
    }
    else if (ball.x > canvas.width - PADDLE_WIDTH) {
      if (ball.y > player2.y && ball.y < player2.y + PADDLE_HEIGHT) {
        collisionDetected = true;
        checkPaddleCollision(player2, ball);
      }
    }

  } else {
    collisionDetected = false;
  }

}

function checkPaddleCollision(paddle, ball) {
  const hitZoneHeight = PADDLE_HEIGHT / 3;
  const ballHitZone = Math.floor((ball.y - paddle.y) / hitZoneHeight);

  switch (ballHitZone) {
    case PADDLE_HIT_ZONES.TOP:
      //ball.speedY = -ball.speedY;
      ball.speedY = -1.7;
      ball.speedX = -ball.speedX;
      console.log("up");
      break;
    case PADDLE_HIT_ZONES.CENTER:
      // if condition prevents from getting stuck in y position
      if (ball.speedY == 0){
        ball.speedY = -1.7;
      } else {
        ball.speedY = 0;
      }
      ball.speedX = -ball.speedX;
      console.log("middle");
      break;
    case PADDLE_HIT_ZONES.BOTTOM:
      //ball.speedY = -ball.speedY;
      ball.speedY = -1.7;
      ball.speedX = -ball.speedX;
      console.log("down");

      break;
  }

  paddleSound.play();
  collisionDetected = true;
}

// evento keyDownHandler para el movimiento del paddle
function keyDownHandler(e) {
  if (e.keyCode == 38) {
    player2MoveUp = true;
  }
  else if (e.keyCode == 40) {
    player2MoveDown = true;
  }
  if (e.keyCode == 87) {
    player1MoveUp = true;
  }
  else if (e.keyCode == 83) {
    player1MoveDown = true;
  }
}

// evento keyUp para detener el movimiento del paddle
function keyUpHandler(e) {
  if (e.keyCode == 38) {
    player2MoveUp = false;
  }
  else if (e.keyCode == 40) {
    player2MoveDown = false;
  }
  if (e.keyCode == 87) {
    player1MoveUp = false;
  }
  else if (e.keyCode == 83) {
    player1MoveDown = false;
  }
}

// animation for paddles
function movePaddles() {
  // move player 1 paddle
  if (player1MoveUp && player1.y > 0) {
    player1.y -= PADDLE_SPEED;
  }
  else if (player1MoveDown && player1.y + PADDLE_HEIGHT < canvas.height) {
    player1.y += PADDLE_SPEED;
  }
  // move player 2 paddle
  if (player2MoveUp && player2.y > 0) {
    player2.y -= PADDLE_SPEED;
  }
  else if (player2MoveDown && player2.y + PADDLE_HEIGHT < canvas.height) {
    player2.y += PADDLE_SPEED;
  }
  requestAnimationFrame(movePaddles);
}

movePaddles();

function drawText(text, font, x, y, color, align = "center") {
  context.font = font;
  context.fillStyle = color;
  context.textAlign = align;
  context.fillText(text, x, y);
}

function gameOver() {
  paused = true;
  if (player1.score >= 10) {
    drawText("PLAYER1 win", SUBTITLE_FONT, canvas.width / 2, canvas.height / 3);
  } else if (player2.score >= 10) {
    drawText("PLAYER2 win", SUBTITLE_FONT, canvas.width / 2, canvas.height / 3);
  }
  drawText("Press ANY KEY to restart", SUBTITLE_FONT, canvas.width / 2, canvas.height / 2);
}

function resetBall() {
  ball.x = canvas.width / 2;
  //ball spawns at random height
  ball.y = Math.floor(Math.random() * canvas.height);
  ball.speedX = -ball.speedX;
  
}

function resetGame() {

  // reset paddle positions
  player1.y = 50;
  player2.y = 50;

  // reset scores
  player1.score = 0;
  player2.score = 0;

  // remove event listener to prevent multiple resets
  document.removeEventListener("keydown", resetGame);
  // reset neon colors   *** gotta fix this
  gradient.addColorStop(1, PLAYER_COLOR);
  context.fillStyle = gradient;
  context.shadowColor = GRADIENT_COLOR;
  context.shadowBlur = 10;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  paused = false;
  resetBall();
  requestAnimationFrame(runGame);
}

