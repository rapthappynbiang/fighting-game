const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");

const CanvasWidth = 1024;
const canvasHeight = 576;

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 1024, 576);

const gravity = 0.7;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

const backgroundMusic = playAudio("./audio/background.mp3", true);
const swordSlash = playAudio("./audio/slash.mp3", false);

const backGroundImage = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./assets/background.png",
  frameSet: 1,
});

ctx.fillStyle = "#000";
ctx.fillRect(0, 0, 1024, 576);
backGroundImage.update();

const shop = new Sprite({
  position: { x: 600, y: 125 },
  imageSrc: "./assets/shop.png",
  scale: 2.78,
  frameSet: 6,
});

const fighter = new Player({
  position: { x: 20, y: 300 },
  color: "red",
  velocity: { x: 0, y: 0 },
  offset: { x: 215, y: 157 },
  imageSrc: "./assets/samuraiMack/Idle.png",
  frameSet: 8,
  scale: 2.5,
  attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      frameSet: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      frameSet: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      frameSet: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      frameSet: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      frameSet: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      frameSet: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      frameSet: 6,
    },
  },
});

const enemy = new Player({
  position: { x: 100, y: 300 },
  color: "blue",
  velocity: { x: 0, y: 0 },
  offset: { x: 215, y: 169 },
  imageSrc: "./assets/kenji/Idle.png",
  frameSet: 4,
  scale: 2.5,
  attackBox: { offset: { x: -170, y: 50 }, width: 170, height: 50 },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      frameSet: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      frameSet: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      frameSet: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      frameSet: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      frameSet: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take hit.png",
      frameSet: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      frameSet: 7,
    },
  },
});

function animate() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 1024, 576);
  window.requestAnimationFrame(animate);
  backGroundImage.update();
  shop.update();
  ctx.fillStyle = "rgba(255,255,255, 0.15)";
  ctx.fillRect(0, 0, CanvasWidth, canvasHeight);
  fighter.update();
  enemy.update();

  fighter.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement
  if (keys.d.pressed && fighter.lastKey === "d") {
    fighter.switchSprite("run");
    fighter.velocity.x = 5;
  } else if (keys.a.pressed && fighter.lastKey === "a") {
    fighter.switchSprite("run");
    fighter.velocity.x = -5;
  } else {
    fighter.switchSprite("idle");
  }

  if (fighter.velocity.y < 0) {
    fighter.switchSprite("jump");
  } else if (fighter.velocity.y > 0) {
    fighter.switchSprite("fall");
  }

  // enemy's movement
  if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.switchSprite("run");
    enemy.velocity.x = 5;
  } else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // check for collision for player
  if (
    rectangleCollision({
      rectangle1: fighter,
      rectangle2: enemy,
    }) &&
    fighter.isAttacking &&
    fighter.framesCurrent === 4
  ) {
    enemy.takeHit();
    fighter.isAttacking = false;
    document.getElementById("enemy-health").style.width = enemy.health + "%";
  }

  if (fighter.isAttacking && fighter.framesCurrent >= 4) {
    fighter.isAttacking = false;
  }

  // check for collision for enemy
  if (
    rectangleCollision({
      rectangle1: enemy,
      rectangle2: fighter,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    fighter.takeHit();
    enemy.isAttacking = false;
    document.getElementById("player-health").style.width = fighter.health + "%";
  }

  // enemy misses
  if (enemy.isAttacking && enemy.framesCurrent >= 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health === 0 || fighter.health === 0) {
    declareWinner({ player1: fighter, player2: enemy, timerId });
  }
}

function startGame() {
  document.querySelector("#displayText").innerHTML = "";
  document.querySelector("#displayText").style.display = "none";
  document.querySelector("#displayText").style.backgroundColor = "transparent";
  animate();
  decreaseTimer();
  backgroundMusic.play();
}

document.querySelector(
  "#displayText"
).innerHTML = `<button style="border: 2px solid #000" onclick="startGame()">Start Game</button>`;
document.querySelector("#displayText").style.display = "flex";
document.querySelector("#displayText").style.backgroundColor = "#6a7e9a";

window.addEventListener("keydown", ({ key }) => {
  if (!fighter.dead) {
    switch (key) {
      case "d":
        keys.d.pressed = true;
        fighter.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        fighter.lastKey = "a";
        break;
      case "w":
        fighter.velocity.y = -20;
        break;
      case " ":
        fighter.attack();
        swordSlash.play();
        break;
    }
  }
  if (!enemy.dead) {
    switch (key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "Enter":
        enemy.attack();
        swordSlash.play();
        break;
    }
  }
});
window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
  switch (key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
