window.onload = function(width, height) {
    var playerMap = [],
        computerMap = ['ooosooooss',
                'ososoooooo',
                'ooosoooooo',
                'ooosooosoo',
                'ooooooosoo',
                'osoosoosoo',
                'osoooooooo',
                'ososoooooo',
                'ooooossooo',
                'ssooooooso'],
        player = document.getElementById('player_field'),
        computer = document.getElementById('computer_field'),
        output = document.getElementById("output"),
        button = document.getElementById('start');

    output.innerHTML = "<p>Конфигурация кораблей: 1 x 4, 2 x 3, 3 x 2, 4 x 1</p>";

    button.onclick = function () {
      //button.disabled = true;
      for (var lineNum = 0; lineNum < width; lineNum++) {
        var shipLine = prompt("Расположение кораблей на линии " + lineNum, "ossoooosoo");
        playerMap.push(shipLine);
        if (playerMap[lineNum] != undefined) {
          output.innerHTML += "<p class='ships-line'>" + playerMap[lineNum] + "</p>";
        }
      }

      for (i = 0; i < width; i++)
        for (j = 0; j < height; j++) {
          div1 = document.createElement('div');
          div1.id = i+'_'+j;
          div1.className = playerMap[i][j];
          if (playerMap[i][j] == 's'){
            div1.className = 's';
          } else {
            div1.className = 'w';
          }
          player.appendChild(div1);
          div2 = document.createElement('div');
          div2.className = computerMap[i][j] == 's' ? 's' : 'w';
          div2.onclick = function () { if (fire(this)) backfire(); };
          computer.appendChild(div2);
      }
    };
      function fire(el) {
        if (el.className == 'd' || el.className == 'm') return false;
        el.className = el.className == 's' ? 'd' : 'm';
        if (document.querySelectorAll('#computer_field .s').length === 0) {
          alert('Victory!'); 
          return false;
        }
        if (el.className == 'm') return true;
      }
      function backfire() {
        for (i = width * height; i > 0; i--) {
          var targets = document.querySelectorAll('#player_field .s, #player_field .w');
          if (targets.length === 0 || fire(targets[Math.floor(Math.random() * targets.length)])) break;
        }
        if (document.querySelectorAll('#player_field .s').length === 0) alert('You have lost! Refresh the page to start new game.');
      }
    }(10, 10);