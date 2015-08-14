function makeShipOrNot (fieldElement){
  var mapElement;
  if (fieldElement.className == 'ship') {
      fieldElement.className = 'water';
      mapElement = 'w';
  } else {
      fieldElement.className = 'ship';
      mapElement = 's';
  }
  return mapElement;
};

function init() {
  var WIDTH = 10,
      HEIGHT = 10;


  var playerMap = new Array(HEIGHT),
      computerMap = new Array(HEIGHT),
      playerField = document.querySelector('.js-player'),
      //computerField = document.querySelector('computer_field'),
      //output = document.querySelector('output_field'),
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
      playerFieldElement.className = playerMap[row][col] == 's' ? 'ship' : 'water';
      playerFieldElement.setAttribute("row", row);
      playerFieldElement.setAttribute("col", col);
      playerFieldElement.onclick = function () {
        var elementRow = this.getAttribute("row"),
              elementCol = this.getAttribute("col");
        playerMap[elementRow][elementCol] = makeShipOrNot(this);  
      };
      playerField.appendChild(playerFieldElement);
    }
  }
  button.onclick = function () {
    console.log(playerMap);
  };
};
window.addEventListener("DOMContentLoaded", init);
