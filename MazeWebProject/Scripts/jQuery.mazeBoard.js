(function ($) {

    $.fn.drawMessage = function (message, color, giveContext) {
        var width, height;
        if (giveContext == null) {
            context = this[0].getContext("2d");
            width = this.width();
            height = this.height();
        }
        else {
            context = giveContext;
            width = context.canvas.width;
            height = context.canvas.height;
        }

        context.fillStyle = color;
        context.fillRect(0, (height / 2) - 40, width, 80);
        context.fillStyle = "black";
        context.fillRect(2, (height / 2) - 38, width - 4, 76);

        context.fillStyle = color;
        context.font = "30px Arial";
        context.textAlign = "center";
        context.fillText(message, width / 2, height / 2 + 10);
    }

    $.fn.mazeBoard = function (
        mazeData,
        startRow, startCol,
        exitRow, exitCol,
        playerImage, startImage, exitImage,
        isEnabled, moveFunction
        ) {
        var canvas = this[0];
        var playerCol, playerRow;
        var context;
        var rows, cols;
        var cellWidth, cellHeight;
        var endReached = false;
        var width, height;
        var timeoutVar = null;

        playerCol = startCol;
        playerRow = startRow;
        context = this[0].getContext("2d");
        rows = mazeData.length;
        cols = mazeData[0].length;
        width = this.width();
        height = this.height();
        cellWidth = this.width() / cols;
        cellHeight = this.height() / rows;
        canvas = this;

        this.finished = function () {
            return endReached;
        }

        this.solve = function (solutionString) {
            drawPlayer(startCol, startRow);
            isEnabled = false;
            javascriptLoop(solutionString, 0);
        };

        this.endGame = function (message, color) {
            isEnabled = false;
            $(this).drawMessage(message, color, context);
        };

        this.movePlayerExternally = function (direction) {
            var r = playerRow;
            var c = playerCol;
            switch (direction) {
                case "left":
                    c--;
                    break;
                case "right":
                    c++;
                    break;
                case "up":
                    r--;
                    break;
                case "down":
                    r++;
                    break;
                default:
                    break;
            }
            drawPlayer(c, r);
        };

        function drawPlayer(xPos, yPos) {
            context.fillStyle = "#FFFFFF";
            context.fillRect(cellWidth * playerCol, cellHeight * playerRow, cellWidth, cellHeight);

            if (playerCol == startCol && playerRow == startRow) {
                drawStartEnd();
            }

            playerCol = xPos;
            playerRow = yPos;

            if (playerCol == exitCol && playerRow == exitRow) {
                endReached = true;
            }

            var x = cellWidth * playerCol;
            var y = cellHeight * playerRow;
            context.drawImage(playerImage, x, y, cellWidth, cellHeight);
        }

        function drawStartEnd() {
            var x = cellWidth * startCol;
            var y = cellHeight * startRow;
            context.drawImage(startImage, x, y, cellWidth, cellHeight);
            x = cellWidth * exitCol;
            y = cellHeight * exitRow;
            context.drawImage(exitImage, x, y, cellWidth, cellHeight);
        }


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
            if (playerRow != exitRow || playerCol != exitCol) {
                timeoutVar = setTimeout(function () { javascriptLoop(solutionString, i) }, 250);
            }
        }

        function movePlayer(event) {
            if (isEnabled) {
                var key = event.key;
                var direction;
                var moved = false;
                var r = playerRow;
                var c = playerCol;
                switch (key) {
                    case "ArrowLeft":
                        if (playerCol > 0 && mazeData[r][c - 1] == 0) {
                            c--;
                            direction = "left";
                            moved = true;
                        }
                        break;
                    case "ArrowUp":
                        if (playerRow > 0 && mazeData[r - 1][c] == 0) {
                            r--;
                            moved = true;
                            direction = "up";
                        }
                        break;
                    case "ArrowRight":
                        if (playerCol < cols - 1 && mazeData[r][c + 1] == 0) {
                            c++;
                            moved = true;
                            direction = "right";
                        }
                        break;
                    case "ArrowDown":
                        if (playerRow < rows - 1 && mazeData[r + 1][c] == 0) {
                            r++;
                            moved = true;
                            direction = "down";
                        }
                        break;
                    default:
                        break;
                }
                if (moved == true) {
                    if (c == exitCol && r == exitRow) {
                        drawPlayer(c, r);
                        endReached = true;
                        $(this).drawMessage("You Win!", "green", context);
                        isEnabled = false;
                    }
                    else {
                        drawPlayer(c, r);
                    }

                    if (moveFunction != null) {
                        moveFunction(direction, r, c);
                    }


                }
            }
        }


        if (timeoutVar != null) {
            clearTimeout(timeoutVar);
        }

        drawMaze();
        drawStartEnd();
        drawPlayer(startCol, startRow);

        if (isEnabled == true) {
            $(document).off("keydown");
            $(document).on("keydown", movePlayer);
        }
        return this;
    };
})(jQuery);