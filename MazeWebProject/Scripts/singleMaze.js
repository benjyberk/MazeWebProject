(function () {
    var mazeboardObject = null;

    // We place the default values in if they exist
    var defaults = { "defaultRows": "#rows", "defaultCols": "#columns", "defaultAlgorithm": "#algorithm" };
    for (key in defaults) {
        if (localStorage.getItem(key) != null) {
            $(defaults[key]).val(localStorage.getItem(key));
        }
    }
    
    // When solve if clicked, we try get the solution
    $("#btnSolve").click(function () {
        var name = sessionStorage.getItem("mazeName");
        // We build the url and send the request
        apiUrl = "../api/Maze/" + name + "/" + $("#algorithm").val();
        $.getJSON(apiUrl).done(
            function (data) {
                if (mazeboardObject != null) {
                    console.log(data.Solution);
                    mazeboardObject.solve(data.Solution);
                }
            }).fail(
            function (data) {
                alert("Error connecting to the server");
            })
    });

    // When generate is clicked, we validate, then send data to the server
    $("#btnGenerate").click(function () {
        if ($("#name").val() == "" || $("#rows").val() < 1 || $("#columns").val() < 1) {
            alert("Rows and Columns must be positive integers. Name must not be empty.");
            return;
        }

        // We show the loader while we wait
        $(".maze").css("display", "none");
        $(".loader").css("display", "table");
        apiUrl = "../api/Maze/" + $('#name').val() + "/" + $('#rows').val() + "/" + $('#columns').val();
        sessionStorage.setItem("mazeName", $('#name').val());

        // We perform the ajax request for the maze
        $.getJSON(apiUrl).done(function (data) {
            $(".loader").css("display", "none");
            $(".maze").css("display", "block");
            var mazeString = data.Maze;
            console.log(mazeString);
            var maze = [];
            // We translate the maze string into an easier format to read
            for (var i = 0; i < data.Rows; i++) {
                var slice = mazeString.slice(i * data.Cols, (i + 1) * data.Cols);
                maze.push(slice);
            }

            startRow = data.Start.Row;
            startCol = data.Start.Col;
            endRow = data.End.Row;
            endCol = data.End.Col;

            player = document.getElementById("player1");
            start = document.getElementById("start");
            end = document.getElementById("goal");
            // The mazeboard object is constructed
            mazeboardObject = $("#singlecanvas").mazeBoard(maze, startRow, startCol, endRow, endCol, player, start, end, true);
        }).fail(function (data) {
            $(".loader").css("display", "none");
            $(".maze").css("display", "block");
            alert("Error connecting to server");
        });
    });
})();