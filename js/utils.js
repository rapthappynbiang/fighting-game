function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// declare winner
function declareWinner({ player1, player2, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (fighter.health === enemy.health && timer === 0) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (fighter.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 wins";
  } else if (fighter.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 wins";
  }
}

// timer
let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timer--;
    timerId = setTimeout(decreaseTimer, 1000);
    document.querySelector("#game-timer").innerHTML = timer + "";
  }

  if (timer === 0) declareWinner({ player1: fighter, player2: enemy, timerId });
}

function playAudio(name, loop) {
  const audio = new Audio(name);
  audio.loop = loop;
  audio.volume = 0.5;
  return audio;
}
