function makeShipOrNot (fieldElement){
  var mapElement;
  if (fieldElement.className === 'water') {
      fieldElement.className = 'ship';
      mapElement = 's';
  } else {
      fieldElement.className = 'water';
      mapElement = 'w';
  }
  return mapElement;
};

function isEven (row, col) { return (row + col) % 2 === 0 ? true : false; };

function fieldElementClassName (mapElement){
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

function findClosePoints (map, pointRow, pointCol){
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
  console.log(map);
  return map;
};

function rebuildMap(map){
  for (var row = 0; row < 10; row++){
    for (var col = 0; col < 10; col++){
      if(map[row][col] === 'c')
        map[row][col] = 'w';
    }
  }
  for (var row = 0; row < 10; row++){
    for (var col = 0; col < 10; col++){
      if(map[row][col] === 's')
        map = findClosePoints(map, row, col);
    }
  }
  return map;
};

function init() {
  var WIDTH = 10,
      HEIGHT = 10;


  var playerMap = new Array(HEIGHT),
      computerMap = new Array(HEIGHT),
      playerField = document.querySelector('.js-player'),
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
      playerFieldElement.className = fieldElementClassName(playerMap[row][col]);
      playerFieldElement.setAttribute("row", row);
      playerFieldElement.setAttribute("col", col);
      playerFieldElement.onclick = function () {
        if (this.className !== 'close') {
          var elementRow = parseInt(this.getAttribute("row")),
              elementCol = parseInt(this.getAttribute("col"));
          playerMap[elementRow][elementCol] = makeShipOrNot(this);

          /*analize and rebuild playerMap*/
          var tempMap = rebuildMap(playerMap);
          for (var r = 0; r < HEIGHT; r++)
            for (var c = 0; c < WIDTH; c++)
              playerMap[r][c] = tempMap[r][c];
          var fieldElements = document.querySelectorAll(".js-player > div");
          for (var r = 0, elemIndex = 0; r < HEIGHT; r++){
            for (var c = 0; c < WIDTH; c++, elemIndex++){
              fieldElements[elemIndex].className = fieldElementClassName(playerMap[r][c]);
            }
          }
        }
      };
      playerField.appendChild(playerFieldElement);
    }
  }

  button.onclick = function () {
    var fieldElements = document.querySelectorAll(".js-player > div");
    console.log(fieldElements);
  };
};
window.addEventListener("DOMContentLoaded", init);
