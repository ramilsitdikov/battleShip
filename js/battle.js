var WIDTH = 10,
    HEIGHT = 10;

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
    return map;
  }
};

function isEven (row, col) { return (row + col) % 2 === 0 ? true : false; };

function setFieldElementClassName (mapElement) {
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

function findClosePoints (map, pointRow, pointCol) {
  var pointIsEven = isEven(pointRow, pointCol); 
  for (var row = pointRow - 1; row < pointRow + 2; row++) {
    for (var col = pointCol - 1; col < pointCol + 2; col++) {
      var mapPointExist = (map[row] !== undefined && map[row][col] !== undefined);
      var pointIsDifferent = (row !== pointRow || col !== pointCol);
      var pointIsInDiag = pointIsEven === isEven(row,col);
      if(mapPointExist && pointIsDifferent && pointIsInDiag) {
        map[row][col] = 'c';
      }
    }
  }
  return map;
};

function rebuildMap(map) {
  for (var row = 0; row < HEIGHT; row++){
    for (var col = 0; col < WIDTH; col++){
      if(map[row][col] === 'c')
        map[row][col] = 'w';
    }
  }
  for (var row = 0; row < HEIGHT; row++){
    for (var col = 0; col < WIDTH; col++){
      if(map[row][col] === 's')
        map = findClosePoints(map, row, col);
    }
  }
  return map;
};

function fire(fieldElement) {};

function deactivateMap(map) {
  var fieldElements = document.querySelectorAll(".js-player > div");
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
};

function init() {

  var playerMap = new Array(HEIGHT),
      computerMap = new Array(HEIGHT),
      playerField = document.querySelector('.js-player'),
      computerField = document.querySelector('.js-computer'),
      button = document.querySelector('.js-start');
  for (var row = 0; row < HEIGHT; row++) {
    playerMap[row] = new Array(HEIGHT);
    computerMap[row] = new Array(HEIGHT);
    for (var col = 0; col < WIDTH; col++) {
      playerMap[row][col] = 'w';
      computerMap[row][col] = 'w';
    }
  }

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

  button.onclick = function () {
    this.disabled = true;
    playerMap = deactivateMap(playerMap);

    

    for (var row = 0; row < HEIGHT; row++) {
      for (var col = 0; col < WIDTH; col++) {
        var computerFieldElement = document.createElement('div');
        computerFieldElement.className = setFieldElementClassName(computerMap[row][col]);
        computerFieldElement.setAttribute("row", row);
        computerFieldElement.setAttribute("col", col);
        computerFieldElement.onclick = function () {
          fire(this);
        };
        computerField.appendChild(computerFieldElement);
      }
    }
  };
};
window.addEventListener("DOMContentLoaded", init);
