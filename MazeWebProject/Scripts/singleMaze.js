(function() {
    maze = [[0, 1, 0],
    [0, 1, 0],
    [0, 0, 0]];
    player = new Image();
    start = new Image();
    end = new Image();
    i = 0



    loadedFunction = function () {
        i = i + 1;
        if (i == 3) {
            var ret = $("#singlecanvas").mazeBoard(maze, 0, 0, 2, 2, player, start, end, true);
        }
    }

    player.onload = loadedFunction;
    start.onload = loadedFunction;
    end.onload = loadedFunction;
    start.src = "../View/start.png";
    end.src = "../View/goal.png";
    player.src = "../View/player1.png";
})();