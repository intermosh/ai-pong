# ai-pong

![Preview](https://raw.githubusercontent.com/intermosh/ai-pong/main/preview.gif)

This is a PONG game created with Artificial Intelligence (ChatGPT3)

## Initial Prompt

> "Give me the code in HTML, CSS and JS of a Pong".
>
This was the first version it made (I've corrected a few minor errors in the resulting code):

HTML
```
<!DOCTYPE html>
<html>
  <head>
    <title>Pong</title>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body onload="init()">
    <canvas id="game"></canvas>
    <script type="text/javascript" src="pong.js"></script>
  </body>
</html>
```

CSS
```
body {
  background-color: green;
  margin: 0;
  padding: 0;
}

canvas {
  background-color: blue;
  display: block;
  margin: 0 auto;
  width: 50%;
}
```

Javascript
```
var canvas;
var ctx;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 1;
var ballSpeedY = 1;
var paddleWidth = 10;
var paddleHeight = 60;
var paddle1Y = 10;
var paddle2Y = 100;
var paddleSpeed = 10;
var player1Score = 0;
var player2Score = 0;

window.onload = function () {
  init();
}

function init() {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");
  setInterval(draw, 10);

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // check for a winner
  if (player1Score >= 10) {
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("Player 1 wins!", canvas.width / 2 - 75, canvas.height / 2);
    return;
  }
  else if (player2Score >= 10) {
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("Player 2 wins!", canvas.width / 2 - 75, canvas.height / 2);
    return;
  }

  //draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  //move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // check for ball hitting left or right wall
  if (ballX > canvas.width) {
    player1Score++;
    resetBall();
  }
  else if (ballX < 0) {
    player2Score++;
    resetBall();
  }

  // check for ball hitting up and down border
  if (ballX > canvas.width || ballX < 0) {
    ballSpeedX = -ballSpeedX;
  }
  if (ballY > canvas.height || ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  // check for ball hitting left paddle
  if (ballX < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // check for ball hitting right paddle
  if (ballX > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // draw left paddle
  ctx.beginPath();
  ctx.rect(0, paddle1Y, paddleWidth, paddleHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // draw right paddle
  ctx.beginPath();
  ctx.rect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  // draw scores
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Player 1: " + player1Score, 8, 20);
  ctx.fillText("Player 2: " + player2Score, canvas.width - 100, 20);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
}

// move paddles
function keyDownHandler(e) {
  if (e.keyCode == 38) {
    paddle2Y -= paddleSpeed;
  }
  else if (e.keyCode == 40) {
    paddle2Y += paddleSpeed;
  }
  if (e.keyCode == 87) {
    paddle1Y -= paddleSpeed;
  }
  else if (e.keyCode == 83) {
    paddle1Y += paddleSpeed;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 38) {
    paddle2Y -= paddleSpeed;
  }
  else if (e.keyCode == 40) {
    paddle2Y += paddleSpeed;
  }
  if (e.keyCode == 87) {
    paddle1Y -= paddleSpeed;
  }
  else if (e.keyCode == 83) {
    paddle1Y += paddleSpeed;
  }
}
```

The resulting game was a very primitive and basic idea:

![First version of AI Pong](https://raw.githubusercontent.com/intermosh/ai-pong/main/pong1.gif)
