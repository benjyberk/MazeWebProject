(function () {
    var mazeboardObject = null;

    var defaults = { "defaultRows": "#rows", "defaultCols": "#columns", "defaultAlgorithm": "#algorithm" };
    for (key in defaults) {
        if (localStorage.getItem(key) != null) {
            $(defaults[key]).val(localStorage.getItem(key));
        }
    }


    $("#btnSolve").click(function () {
        if (sessionStorage.getItem("mazeName") == null) {
            return;
        }
        var name = sessionStorage.getItem("mazeName");
        apiUrl = "../api/Maze/" + name + "/" + $("#algorithm").val();
        $.getJSON(apiUrl).done(
            function (data) {
                if (mazeboardObject != null) {
                    console.log(data.Solution);
                    mazeboardObject.solve(data.Solution);
                }
            }
            )
    });


    $("#btnGenerate").click(function () {
        apiUrl = "../api/Maze/" + $('#name').val() + "/" + $('#rows').val() + "/" + $('#columns').val();
        sessionStorage.setItem("mazeName", $('#name').val());
        $.getJSON(apiUrl).done(function (data) {
            var mazeString = data.Maze;
            console.log(mazeString);
            var maze = [];
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

            mazeboardObject = $("#singlecanvas").mazeBoard(maze, startRow, startCol, endRow, endCol, player, start, end, true);
        });
    });
})();