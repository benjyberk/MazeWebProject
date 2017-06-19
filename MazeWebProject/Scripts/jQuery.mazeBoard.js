(function ($) {
    var playerCol, playerRow;
    var startPos, endPos;
    var context;
    var rows, cols;
    var cellWidth, cellHeight;
    var width, height;
    var enabled;
    var playerImage, startImage, exitImage;
    var mazeData;
    var timeoutVar = null;

    function drawPlayer(xPos, yPos) {
        if (playerCol == startCol && playerRow == startRow) {
            drawStartEnd();
        } else {
            context.fillStyle = "#FFFFFF";
            context.fillRect(cellWidth * playerCol, cellHeight * playerRow, cellWidth, cellHeight);
        }

        playerCol = xPos;
        playerRow = yPos;
        var x = cellWidth * xPos;
        var y = cellWidth * yPos;
        context.drawImage(playerImage, x, y, cellWidth, cellHeight);
    }

    function drawStartEnd() {
        var x = cellWidth * startPos[1];
        var y = cellHeight * startPos[0];
        context.drawImage(startImage, x, y, cellWidth, cellHeight);
        x = cellWidth * endPos[1];
        y = cellHeight * endPos[0];
        context.drawImage(exitImage, x, y, cellWidth, cellHeight);
    }

    $.fn.mazeBoard = function (
        md,
        startRow, startCol,
        exitRow, exitCol,
        playerIm, startIm, exitIm,
        isEnabled, moveFunction
        ) {

        if (timeoutVar != null) {
            clearTimeout(timeoutVar);
        }

        mazeData = md;
        playerCol = startCol;
        playerRow = startRow;
        context = this[0].getContext("2d");
        rows = mazeData.length;
        cols = mazeData[0].length;
        width = this.width();
        height = this.height();
        cellWidth = this.width() / cols;
        cellHeight = this.height() / rows;
        enabled = isEnabled;
        startPos = [startRow, startCol];
        endPos = [exitRow, exitCol];
        playerImage = playerIm;
        startImage = startIm;
        exitImage = exitIm;

        function drawMaze() {
            context.clearRect(0, 0, width, height);
            // Draw the maze
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (mazeData[i][j] == 1) {
                       context.fillStyle = "#000000";
                       context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                    }
                }
            }
        }

        drawMaze();
        drawStartEnd();
        drawPlayer(playerCol, playerRow);

        $(document).off("keydown");
        $(document).on("keydown", movePlayer);

        return this;
    };

    function javascriptLoop(solutionString, i) {
        var c = playerCol;
        var r = playerRow;
        
        switch (solutionString[i]) {
            case "0":
                c--;
                break;
            case "1":
                c++;
                break;
            case "2":
                r--;
                break;
            case "3":
                r++;
                break;
            default:
                break;
        }
        drawPlayer(c, r);
        i++;
        if (playerRow != endPos[0] || playerCol != endPos[1]) {
            timeoutVar = setTimeout(function() { javascriptLoop(solutionString, i) }, 250);
        }


    }

    function movePlayer(event) {
        if (enabled) {
            var key = event.key;
            var moved = false;
            var r = playerRow;
            var c = playerCol;
            switch (key) {
                case "ArrowLeft":
                    if (playerCol > 0 && mazeData[r][c - 1] == 0) {
                        c--;
                    }
                    moved = true;
                    break;
                case "ArrowUp":
                    if (playerRow > 0 && mazeData[r - 1][c] == 0) {
                        r--;
                    }
                    moved = true;
                    break;
                case "ArrowRight":
                    if (playerCol < cols - 1 && mazeData[r][c + 1] == 0) {
                        c++;
                    }
                    moved = true;
                    break;
                case "ArrowDown":
                    if (playerRow < rows - 1 && mazeData[r + 1][c] == 0) {
                        r++;
                    }
                    moved = true;
                    break;
                default:
                    break;
            }
            if (moved == true) {
                drawPlayer(c, r);
            }
        }
    }

    $.fn.solve = function (solutionString) {
        drawPlayer(startPos[1], startPos[0]);
        enabled = false;
        javascriptLoop(solutionString, 0);
    };

    
})(jQuery);