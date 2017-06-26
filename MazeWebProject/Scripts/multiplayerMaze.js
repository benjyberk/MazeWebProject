(function () {
    // If the user is not logged in, we re-direct them to the login page
    if (sessionStorage.getItem("username") == null) {
        document.location.href = "/View/Login.html";
        return;
    }

    // We save the username and create our signalR connection
    var localUser = sessionStorage.getItem("username");
    var mazeHub = $.connection.multiplayerMazeHub;
    var localBoard, enemyBoard;

    // We set up the default values (if they exist)
    var defaults = { "defaultRows": "#rows", "defaultCols": "#columns"};
    for (key in defaults) {
        if (localStorage.getItem(key) != null) {
            $(defaults[key]).val(localStorage.getItem(key));
        }
    }

    // The signalR function that handles a maze response
    mazeHub.client.getMaze = function (contents) {
        // We hide the loader and show the maze
        $(".loader").css("display", "none");
        $(".maze").css("display", "block");
        var mazeString = contents.Maze;
        console.log(mazeString);
        var maze = [];
        // We convert the maze into a form that can easily be accessed
        for (var i = 0; i < contents.Rows; i++) {
            var slice = mazeString.slice(i * contents.Cols, (i + 1) * contents.Cols);
            maze.push(slice);
        }
        startRow = contents.Start.Row;
        startCol = contents.Start.Col;
        endRow = contents.End.Row;
        endCol = contents.End.Col;

        // We load in the images
        player = document.getElementById("player1");
        player2 = document.getElementById("player2");
        start = document.getElementById("start");
        end = document.getElementById("goal");

        // The move function handles communication with the server
        moveFunction = function (direction, playerRow, playerCol) {
            mazeHub.server.makeMove(direction);
            if (localBoard.finished() == true) {
                enemyBoard.endGame("Opponent Lost", "red");
                localBoard.endGame("You Won!", "green");
                // We update the players score when the game ends
                $.ajax({
                    url: "../api/Members/" + localUser + "/" + "win",
                    type: 'PUT',
                    success: updatedScore
                });
            }
        }

        // We generate the maze objects
        localBoard = $("#player1canvas").mazeBoard(maze, startRow, startCol, endRow, endCol, player, start, end, true, moveFunction);
        enemyBoard = $("#player2canvas").mazeBoard(maze, startRow, startCol, endRow, endCol, player2, start, end, false);
    };

    // The function draws the updated score message
    function updatedScore(wins) {
        if (wins != null) {
            var msg = "Your score is " + wins;
            localBoard.drawMessage(msg, "gold");
        }
    }

    // The signalR function updates the multiplayer games list
    mazeHub.client.updateList = function (contents) {
        for (index in contents) {
            appString = "<option>" + contents[index] + "</option>";
            $("#existinglist").append(appString);
        }
    };

    // The signalR update position function moves the player on the second mazeboard
    mazeHub.client.updatePosition = function (contents) {
        enemyBoard.movePlayerExternally(contents.Direction);
        if (enemyBoard.finished() == true) {
            enemyBoard.endGame("Opponent Won", "green");
            localBoard.endGame("You Lost", "red");
            // When the game finishes, we update the players score
            $.ajax({
                url: "../api/Members/" + localUser + "/" + "loss",
                type: 'PUT',
                success: updatedScore
            });
        }
    };

    $.connection.hub.start().done(function () {
        // Enable the start/join buttons, because now they work
        $("#btnStart").prop('disabled', false);
        $("#btnJoin").prop('disabled', false);

        mazeHub.server.getList();

        // When start is pressed, we send the 'startmaze' command
        $("#btnStart").click(function () {
            // Validate that correct data is input
            if ($("#name").val() != "" && $("#rows").val() > 0 && $("#columns").val() > 0) {
                $(".maze").css("display", "none");
                // The loader is displayed
                $(".loader").css("display", "table");
                mazeHub.server.startMaze($("#name").val(), $("#rows").val(), $("#columns").val());
            }
            else {
                alert("Rows and Columns must be positive integers. Name must not be empty.");
            }
        });

        // The join button sends out a signalR joinmaze request
        $("#btnJoin").click(function () {
            $(".maze").css("display", "none");
            // We show the loader
            $(".loader").css("display", "table");
            mazeHub.server.joinMaze($("#existinglist").val());
        });
    });
})();