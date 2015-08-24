/*global vars*/
var WIDTH = 10,
    HEIGHT = 10;

/*math*/
function getRandomInt (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function isEven (row, col) { return (row + col) % 2 === 0 ? true : false; };

/*common for player and computer*/
function setFieldElementClassName (mapElement) {
  var className;
  switch(mapElement){
    case '1': className = 'one'; break;
    case '2': className = 'two'; break;
    case '3': className = 'three'; break;
    case '4': className = 'four'; break;
    case 'w': className = 'water'; break;
    case 'd': className = 'dead'; break;
    case 'i': className = 'injured'; break;
    case 'm': className = 'missed'; break;
    case 'c': className = 'close'; break;
    case 's':className = 'ship'; break;
  }
  return className;
};

function redrawField (map, selector) {
  var fieldElements = document.querySelectorAll(selector);
  for (var row = 0, elemIndex = 0; row < HEIGHT; row++) {
    for (var col = 0; col < WIDTH; col++, elemIndex++) {
      fieldElements[elemIndex].className = setFieldElementClassName(map[row][col]);
    }
  }
};

function shipsExist (map) {
  for (var row = 0; row < HEIGHT; row++)
    for (var col = 0; col < WIDTH; col++)
      if(map[row][col] === 's')
        return true; 
  return false;
};

function deactivateMap (map, selector) {
  var fieldElements = document.querySelectorAll(selector); 
  for (var row = 0, elemIndex = 0; row < HEIGHT; row++){
    for (var col = 0; col < WIDTH; col++, elemIndex++){
      if(map[row][col] === 'c')
        map[row][col] = 'w';
      fieldElements[elemIndex].className = setFieldElementClassName(map[row][col]);
      fieldElements[elemIndex].onclick = function() {
         return false;
       };
    }
  }
  return map;
};

/*player only*/
function makeShipOrNot (fieldElement, map) {
  if (fieldElement.className !== 'close') {
    var elementRow = parseInt(fieldElement.getAttribute("row")),
        elementCol = parseInt(fieldElement.getAttribute("col"));
    if (fieldElement.className === 'water') {
        fieldElement.className = 'ship';
        map[elementRow][elementCol] = 's';
    } else {
        fieldElement.className = 'water';
        map[elementRow][elementCol] = 'w';
    }
    map = rebuildMap(map);
    var fieldElements = document.querySelectorAll(".js-player > div");
      for (var r = 0, elemIndex = 0; r < HEIGHT; r++){
        for (var c = 0; c < WIDTH; c++, elemIndex++){
          fieldElements[elemIndex].className = setFieldElementClassName(map[r][c]);
        }
      }
    }
  return map;
};

function playerShot (fieldElement, map) {
  var niceShot = false;
  var elementRow = parseInt(fieldElement.getAttribute("row")),
       elementCol = parseInt(fieldElement.getAttribute("col"));
  if (fieldElement.className === 'ship'){
    fieldElement.className = 'dead';
    map[elementRow][elementCol] = 'd';
    niceShot = true;
  } else {
    fieldElement.className = 'missed';
    map[elementRow][elementCol] = 'm';
    niceShot = false;
  }
  return niceShot;
};

function findClosePoints (map, pointRow, pointCol) {
  var pointIsEven = isEven(pointRow, pointCol); 
  for (var row = pointRow - 1; row < pointRow + 2; row++) {
    for (var col = pointCol - 1; col < pointCol + 2; col++) {
      var mapPointExist = (map[row] !== undefined && map[row][col] !== undefined),
          pointIsDifferent = (row !== pointRow || col !== pointCol),
          pointIsInDiag = pointIsEven === isEven(row,col);
      if(mapPointExist && pointIsDifferent && pointIsInDiag) {
        map[row][col] = 'c';
      }
    }
  }
  return map;
};

function rebuildMap (map) {
  for (var row = 0; row < HEIGHT; row++)
    for (var col = 0; col < WIDTH; col++)
      if(map[row][col] === 'c')
        map[row][col] = 'w';

  for (var row = 0; row < HEIGHT; row++)
    for (var col = 0; col < WIDTH; col++)
      if(map[row][col] === 's')
        map = findClosePoints(map, row, col);
  return map;
};

/*computer only*/
function computerShot (map) {
  var niceShot;
  var shot = getRandomInt(0, 99);
  var r = parseInt(shot/10);
  var c = shot%10;
  if(map[r][c] === 's')
  {
    map[r][c] = 'd';
    niceShot = true;
  } else {
    map[r][c] = 'm';
    niceShot = false;
  }
  redrawField(map, '.js-player > div');
  return niceShot;
};

function makeOneShip(shipLength, map) {
  var count = 0;
  var ship,
      coordCol,
      coordRaw,
      direction,
      shipIsReady,
      tempMap = new Array(10);
  while(!shipIsReady) {
    count++;
    shipIsReady = true;
    ship = [];
    for (var row = 0; row < HEIGHT; row++) {
      tempMap[row] = new Array(10);
      for (var col = 0; col < WIDTH; col++)
        tempMap[row][col] = map[row][col];
    }
    coordCol = getRandomInt(0, 9),
    coordRaw = getRandomInt(0, 9);
    direction = getRandomInt(0, 1);
    ship.push(coordCol);
    ship.push(coordRaw);
    ship.push(direction);

    /*generate x,y,dir*/
    while (!(ship[direction] + shipLength <= 10)) {
      ship = [];
      coordCol = getRandomInt(0, 9),
      coordRaw = getRandomInt(0, 9);
      direction = getRandomInt(0, 1);
      ship.push(coordCol);
      ship.push(coordRaw);
      ship.push(direction);
    }

    /*ship start and end points*/
    var rowLimit, colLimit;
    if(ship[2] === 0) {
      rowLimit = ship[1] + 1;
      colLimit = ship[0] + shipLength;
    } else {
      rowLimit = ship[1] + shipLength;
      colLimit = ship[0] + 1;
    }

    /*check are any ships on the way or near to it*/
    for(var row = ship[1]; row < rowLimit && shipIsReady; row++)
      for(var col = ship[0]; col < colLimit && shipIsReady; col++) {
        if(tempMap[row][col] === 's' || tempMap[row][col] === 'c')
          shipIsReady = false;
        else
          tempMap[row][col] = 'z';
      }

    if(shipIsReady) {
      for(var row = ship[1] - 1; row < rowLimit + 1 && shipIsReady; row++)
        for(var col = ship[0] - 1; col < colLimit + 1 && shipIsReady; col++) {
        var mapPointExist = (tempMap[row] !== undefined && tempMap[row][col] !== undefined);
        if (mapPointExist)
          if (tempMap[row][col] === 's')
            shipIsReady = false;
          else {
            if (tempMap[row][col] === 'z')
              tempMap[row][col] = 's';
            else
              tempMap[row][col] = 'c';
          }
        }

    } else {
      for (var row = 0; row < HEIGHT; row++)
        for (var col = 0; col < WIDTH; col++)
          tempMap[row][col] = map[row][col];
    }
  }

  for (var row = 0; row < HEIGHT; row++)
      for (var col = 0; col < WIDTH; col++)
        map[row][col] = tempMap[row][col];
};

function generateShips (map) {
  /*ship with 4 cell*/
  makeOneShip(4, map);
  redrawField(map, '.js-computer > div')
  /*ship with 3 cell*/
  makeOneShip(3, map);
  redrawField(map, '.js-computer > div')
  makeOneShip(3, map);
  redrawField(map, '.js-computer > div')
  /*ship with 2 cell*/
  makeOneShip(2, map);
  redrawField(map, '.js-computer > div')
  makeOneShip(2, map);
  redrawField(map, '.js-computer > div')
  makeOneShip(2, map);
  redrawField(map, '.js-computer > div')

  /*ship with 1 cell*/
  makeOneShip(1, map);
  redrawField(map, '.js-computer > div')
  makeOneShip(1, map);
  redrawField(map, '.js-computer > div')
  makeOneShip(1, map);
  redrawField(map, '.js-computer > div')
  makeOneShip(1, map);
  redrawField(map, '.js-computer > div')
};


///////////////////////////////////////////////////////////////////////////////////
function init() {
  
  /*initialize variables*/
  var playerMap = new Array(HEIGHT),
      computerMap = new Array(HEIGHT),
      playerField = document.querySelector('.js-player'),
      computerField = document.querySelector('.js-computer'),
      outputField = document.querySelector('.js-output'),
      button = document.querySelector('.js-start');
  for (var row = 0; row < HEIGHT; row++) {
    playerMap[row] = new Array(HEIGHT);
    computerMap[row] = new Array(HEIGHT);
    for (var col = 0; col < WIDTH; col++) {
      playerMap[row][col] = 'w';
      computerMap[row][col] = 'w';
    }
  }

  /*set player field*/
  for (var row = 0; row < HEIGHT; row++) {
    for (var col = 0; col < WIDTH; col++) {
      var playerFieldElement = document.createElement('div');
      playerFieldElement.className = 'water';
      playerFieldElement.setAttribute("row", row);
      playerFieldElement.setAttribute("col", col);
      playerFieldElement.onclick = function () {
        playerMap = makeShipOrNot(this, playerMap);
      };
      playerField.appendChild(playerFieldElement);
    }
  }

  /*start game*/
  button.onclick = function () {
    this.disabled = true;
    deactivateMap(playerMap, '.js-player > div');
    //generateShips(computerMap);

    /*set computer field*/
    for (var row = 0; row < HEIGHT; row++) {
      for (var col = 0; col < WIDTH; col++) {
        var computerFieldElement = document.createElement('div');
        computerFieldElement.className = setFieldElementClassName(computerMap[row][col]);
        computerFieldElement.setAttribute("row", row);
        computerFieldElement.setAttribute("col", col);
        computerFieldElement.onclick = function () {
          if (!playerShot(this, computerMap)){
            var computerHit = computerShot(playerMap);
            while (computerHit && shipsExist(playerMap)) {
              computerHit = computerShot(playerMap);
            }
          }
          if(!shipsExist(computerMap)) {
            outputField.innerHTML += "<div>Вы одержали победу!</div>";
            deactivateMap(computerMap, '.js-computer > div');
          }
          else if (!shipsExist(playerMap)) {
            outputField.innerHTML += "<div>Вы потерпели поражение!</div>";
            deactivateMap(computerMap, '.js-computer > div');
          }
        };
        computerField.appendChild(computerFieldElement);
      }
    }
    generateShips(computerMap);
  };
};
window.addEventListener("DOMContentLoaded", init);
