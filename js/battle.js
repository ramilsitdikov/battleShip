function init() {
    var WIDTH = 10,
        HEIGHT = 10;
    
    function makeShipOrNot (element){
        if(element.className == 'ship'){
            element.className = 'water';
        } else {
            element.className = 'ship';
        }
    };

    var playerMap = ['oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо',
                     'oooооoooоо'],
        computerMap = [],
        player = document.querySelector('.js_player'),
        computer = document.querySelector('computer_field'),
        output = document.querySelector('output_field'),
        button = document.querySelector('.start_button');

        for(var i = 0; i < HEIGHT; i++)
            for(var j = 0; j < WIDTH; j++){
                playerMapElement = document.createElement('div');
                playerMapElement.className = playerMap[i][j] == 's' ? 'ship' : 'water'
                playerMapElement.onclick = function() {
                    makeShipOrNot(this);
                    };
                player.appendChild(playerMapElement);
        }

};
window.addEventListener("DOMContentLoaded", init);
