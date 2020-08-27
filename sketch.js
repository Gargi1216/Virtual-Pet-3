//Create variables here
var dog, happyDog, database, foodS, foodStock;
var foodObj;
var feedTime, lastFed;
var feed, add;
var bedRoom_Img, garden_Img, washRoom_Img;
var gameState;
var readState, changeState;

function preload()
{
  //load images here
  dog_img = loadImage("images/dogImg.png");
  dogHappy = loadImage("images/dogImg1.png");
  sadDog = loadImage("virtual pet images/Living Room.png");
  bedRoom_Img = loadImage("virtual pet images/Bed Room.png");
  garden_Img = loadImage("virtual pet images/Garden.png");
  washRoom_Img = loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(1000, 500);
  
  dog = createSprite(700,200,20,20);
  dog.addImage(dog_img);
  dog.scale = 0.3;

  database = firebase.database();
  //console.log(database);
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("FEED TOMMY");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  add = createButton("ADD FOOD");
  add.position(800,95);
  add.mousePressed(addFood);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogHappy);
  }
  text("Note: Press Up Arrow key to feed Tommy milk",200,450);
  text("Food remaining:"+foodS, 100,50)

  drawSprites();
  //add styles here
  textSize(15);
  stroke(5);

  feedTime = database.ref('feedTime');
  feedTime.on("value",function(data){
    lastFed = data.val();
  });


  
  if(gameState!=="Hungry"){
    feed.hide();
    add.hide();
    dog.remove();
  } else{
    feed.show();
    add.show();
    dog.addImage(sadDog);

    
  }

  currentTime=hour();
    if(currentTime===(lastFed+1)){
      update("Playing");
      foodObj.garden();

    } else if(currentTime===(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();

    } else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
      foodOnj.washroom();

    } else{
      update("Hungry");
      foodObj.display();
    }

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  } else{
    x = x-1;
  }

  database.ref('/').update({
    Food : x
  })
}

function addFood(){
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}

function feedDog(){
  dog.addImage(dogHappy);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime : hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });

}


