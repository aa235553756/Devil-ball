// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let para = document.querySelector("p");



const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
}

// 生成随机颜色值的函数

function randomColor() {
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  return color;
}

//定義 Ball 构造器
function Shape(x,y,velX,velY,exists){
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists //布林值   
}

function Ball(x,y,velX,velY,exists,color,size){
  Shape.call(this,x,y,velX,velY,exists)
  
  this.color = color;
  this.size = size;
}
//因上述構造器，並不會將Shape的prototype一併繼承，需使用下列函式
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball; 

//定义恶魔圈 EvilCircle()
function EvilCircle(x,y,exists){
  Shape.call(this, x, y, 20, 20, exists);
  //20,20 使得velX,velY恆定為20

  this.color = "white";
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function() {
  if((this.x + this.size) >= width) {
    this.x -= this.size; 
    //自己版本。 this.x = width-size  (size is not defined)
    console.log("hi");
  }

  if((this.x - this.size) <= 0) {
    console.log("wrong");
    this.x += this.size ;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

EvilCircle.prototype.setControls = function() {
  window.onkeydown = e => {
    switch(e.key) {
      case 'a':
        this.x -= this.velX;
        break;
      case 'd':
        this.x += this.velX;
        break;
      case 'w':
        this.y -= this.velY;
        break;
      case 's':
        this.y += this.velY;
        break;
    }
  };
}

EvilCircle.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {  /* 原balls[j].exists 本身也是true，if函式判斷true。看有沒有出錯*/
    if(balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = "還剩"+count+"顆球"
      }
    }
  }
};

// 定义彩球绘制函数

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();

      }
    }
  }
};

// 定义一个数组，生成并保存所有的球

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),//ex( 10,width-10
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
}

//我計算寫在實例球外面，好處是分開，但不能在ball實例化以前，MDN用初始化count=0，並透過while使count++。
//各有好壞，MDN好處是可以一開始就有初始化，並在函式中可以調整。邏輯為計算加上幾顆。可能有計算時間。
//我則是寫在外面，空間更大分辨辨認，邏輯較通順(balls.length)共有幾顆球，但一開始找不到，需要置在實例後。
let count = balls.length ;
para.textContent = "還剩"+count+"顆球"

let evilCircle = new EvilCircle
(random(0, width),
 random(0, height), 
 true);
evilCircle.setControls();

// 定义一个循环来不停地播放

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect(); //球撞球 球換色
    };
  };
      
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect(); //惡魔球撞球 球消失

  requestAnimationFrame(loop);
}

loop();

