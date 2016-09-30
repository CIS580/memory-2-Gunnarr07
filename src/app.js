"use strict";

//const debug = true;
window.debug = true;

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/animals.png';

var blip = new Audio();
blip.src = '';
var flip = new Audio();
flip.src = '';
var pair = new Audio();
pair.src = '';

// We have 9 pairs of possible cards that are about 212px square
var cards = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
var board = [];
while(cards.length > 0) {
  var index = Math.floor(Math.random() * (cards.length - 1));
  board.push({card: cards[index], flip: false});
  cards.splice(index, 1);
}
var state = "waiting for click 1";
var scores = [0,0];
var player = 0;
var card1, card2;

console.log(board);

// TODO: Place the cards on the board in random order

canvas.onclick = function(event) {
  event.preventDefault();
    // TODO: determine which card was clicked on
    var x = Math.floor((event.clientX - 3) / 165);
    var y = Math.floor((event.clientY - 3) / 165);
    var card = board[y * 6 + x];
    // If card not undefind or not flip
    if(!card || card.flip) return;
    card.flip = true;
    switch (state) {
      case "waiting for click 1":
        if(!board[currentIndex] || board[currentIndex].flip) return blip.play();
        //board[currentIndex].flip = true;
        flip.play();
        card1 = card;
        state = "waiting for click 2";
        break;
      case "waiting for click 2":
        if(!board[currentIndex] || board[currentIndex].flip) return blip.play();
        card2 = card;
        state = "wating for timer";
        setTimeout(function(){
          if(card1.card == card2.card) {
            scores[player]++;
          }
          else {
            card1.flip = false;
            card2.flip = false;
            player = +!player;
            state = "waiting for click 1"
          }
          state = "waiting for click 1";
        }, 3000);

        break;
    }

  // TODO: determine what to do
}

canvas.oncontextmenu = function(event) {
  event.preventDefault();
  alert('foo');
}

var currentIndex, currentX, currentY;
canvas.onmousemove = function(event) {
  event.preventDefault();
  currentX = event.offsetX;
  currentY = event.offsetY;
  var x = Math.floor((currentX + 3));
  var y = Math.floor((currentY + 3));
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#ff7777";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // TODO: Render the board
  for(var y = 0; y < 3; y++) {
    for(var x = 0; x < 6; x++) {
      var card = board[y * 6 + x];
      if(card.flip) {
        // render cute animal
        ctx.drawImage(image,
          // Source rect
          card.card % 3 * 212, Math.floor(card.card / 3) * 212, 212, 212,
          // Dest rect
          x * 165 + 3, y * 165 + 3, 160, 160
        );
      } else {
        // draw the back of the card (212x212px)
        ctx.fillStyle = "#3333ff";
        ctx.fillRect(x * 165 + 3, y * 165 + 3, 160, 160);
      }
    }
  }

  if(debug){
    var x = currentIndex % 6;
    var y = Math.floor(currentIndex / 6);

    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(currentX, currentY, 3, 0, 2*Math.PI);
    ctx.rect(x * 165 + 3, y * 165 + 3, 163, 163);
    ctx.stroke();
  }

}
