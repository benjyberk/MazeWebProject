(function () {
    var mazeHub = $.connection.multiplayerMazeHub;
    var localBoard, enemyBoard;

    mazeHub.client.getMaze = function (contents) {
        var mazeString = contents.Maze;
        console.log(mazeString);
        var maze = [];
        for (var i = 0; i < contents.Rows; i++) {
            var slice = mazeString.slice(i * contents.Cols, (i + 1) * contents.Cols);
            maze.push(slice);
        }
        startRow = contents.Start.Row;
        startCol = contents.Start.Col;
        endRow = contents.End.Row;
        endCol = contents.End.Col;

        player = document.getElementById("player1");
        player2 = document.getElementById("player2");
        start = document.getElementById("start");
        end = document.getElementById("goal");

        moveFunction = function (direction, playerRow, playerCol) {
            mazeHub.server.makeMove(direction);
            if (localBoard.finished() == true) {
                enemyBoard.endGame("Opponent Lost", "red");
                localBoard.endGame("You Won!", "green");
            }
        }

        localBoard = $("#player1canvas").mazeBoard(maze, startRow, startCol, endRow, endCol, player, start, end, true, moveFunction);
        enemyBoard = $("#player2canvas").mazeBoard(maze, startRow, startCol, endRow, endCol, player2, start, end, false);
    };

    mazeHub.client.updateList = function (contents) {
        for (index in contents) {
            appString = "<option>" + contents[index] + "</option>";
            $("#existinglist").append(appString);
        }
    };

    mazeHub.client.updatePosition = function (contents) {
        enemyBoard.movePlayerExternally(contents.Direction);
        if (enemyBoard.finished() == true) {
            enemyBoard.endGame("Opponent Won", "green");
            localBoard.endGame("You Lost", "red");
        }
    };

    $.connection.hub.start().done(function () {
        // Enable the start/join buttons, because now they work
        $("#btnStart").prop('disabled', false);
        $("#btnJoin").prop('disabled', false);

        mazeHub.server.getList();

        $("#btnStart").click(function () {
            $("#player1canvas").drawMessage("Waiting For Opponent...", "gold");
            $("#player2canvas").drawMessage("Waiting For Opponent...", "gold");
            mazeHub.server.startMaze($("#name").val(), $("#rows").val(), $("#columns").val());
        });

        $("#btnJoin").click(function () {
            $("#player1canvas").drawMessage("Waiting For Opponent...", "gold");
            $("#player2canvas").drawMessage("Waiting For Opponent...", "gold");

            mazeHub.server.joinMaze($("#existinglist").val());
        });
    });
})();