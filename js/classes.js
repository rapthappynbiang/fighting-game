// sprite class
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frameSet = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.frameSet = frameSet;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.frameSet),
      0,
      this.image.width / this.frameSet,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.frameSet) * this.scale,
      this.image.height * this.scale
    );
  }

  animateframes() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.frameSet - 1) {
        this.framesCurrent += 1;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateframes();
  }
}

//player class
class Player extends Sprite {
  constructor({
    position,
    color,
    velocity,
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    frameSet = 1,
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      offset,
      position,
      imageSrc,
      scale,
      frameSet,
    });
    this.width = 50;
    this.height = 150;
    this.color = color;
    this.velocity = velocity;
    this.lastKey = null;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    };
    this.isAttacking = false;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 7;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  update() {
    this.draw();
    this.framesElapsed++;
    if (!this.dead) this.animateframes();
    // attackbox
    // ctx.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvasHeight - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else this.velocity.y += gravity;
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 2;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    // override animation when player is dead
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.frameSet - 1) {
        this.dead = true;
      }
      return;
    }
    // override animation when player is attacking
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.frameSet - 1
    )
      return;
    // overide animation when player gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.frameSet - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frameSet = this.sprites.idle.frameSet;
          this.framesCurrent = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frameSet = this.sprites.run.frameSet;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frameSet = this.sprites.jump.frameSet;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frameSet = this.sprites.fall.frameSet;
          this.framesCurrent = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frameSet = this.sprites.attack1.frameSet;
          this.framesCurrent = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.frameSet = this.sprites.takeHit.frameSet;
          this.framesCurrent = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.frameSet = this.sprites.death.frameSet;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
