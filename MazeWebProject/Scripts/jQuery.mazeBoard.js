(function ($) {
    // The mazeboard constructor
    $.fn.mazeBoard = function (
        mazeData,
        startRow, startCol,
        exitRow, exitCol,
        playerImage, startImage, exitImage,
        isEnabled, moveFunction
        ) {
        // we initialize necessary values
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

        // Returns a boolean true/false if the end of the maze has been reached
        this.finished = function () {
            return endReached;
        }

        // The solve command begins the loop of the player from beginning to end
        this.solve = function (solutionString) {
            drawPlayer(startCol, startRow);
            isEnabled = false;
            javascriptLoop(solutionString, 0);
        };

        // The endgame function disables the maze, and draws the appropriate ending message
        this.endGame = function (message, color) {
            isEnabled = false;
            drawMessage(message, color);
        };

        // The external drawmessage function allows external drawing on the canvas
        this.drawMessage = function (message, color) {
            drawMessage(message, color);
        }

        // Allows external movement of the player
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
            // We draw the player once the new position is calculated
            drawPlayer(c, r);
        };

        // A function to draw a message onto the maze
        function drawMessage(message, color) {
            // Draw the black background with coloured border
            context.fillStyle = color;
            context.fillRect(0, (height / 2) - 40, width, 80);
            context.fillStyle = "black";
            context.fillRect(2, (height / 2) - 38, width - 4, 76);

            // Draw the text on top
            context.fillStyle = color;
            context.font = "20px Arial";
            context.textAlign = "center";
            context.fillText(message, width / 2, height / 2 + 10);
        }


        // Updates the player position to the provided x and y pos, then draws the player
        function drawPlayer(xPos, yPos) {
            // Overwrite the player with white
            context.fillStyle = "#FFFFFF";
            context.fillRect(cellWidth * playerCol, cellHeight * playerRow, cellWidth, cellHeight);

            // If the player left the start pos, redraw the start pos
            if (playerCol == startCol && playerRow == startRow) {
                drawStartEnd();
            }

            playerCol = xPos;
            playerRow = yPos;

            // When the end is reached, change the boolean value
            if (playerCol == exitCol && playerRow == exitRow) {
                endReached = true;
            }

            var x = cellWidth * playerCol;
            var y = cellHeight * playerRow;
            context.drawImage(playerImage, x, y, cellWidth, cellHeight);
        }

        // Draws the start and end pictures in the maze
        function drawStartEnd() {
            var x = cellWidth * startCol;
            var y = cellHeight * startRow;
            context.drawImage(startImage, x, y, cellWidth, cellHeight);
            x = cellWidth * exitCol;
            y = cellHeight * exitRow;
            context.drawImage(exitImage, x, y, cellWidth, cellHeight);
        }


        // Loops through the maze data to draw the maze
        function drawMaze() {
            context.clearRect(0, 0, width, height);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (mazeData[i][j] == 1) {
                       context.fillStyle = "#000000";
                       context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                    }
                }
            }
        }

        // The loop used to move the player (where 'solution' is pressed)
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
            // Keep going until the player reaches the end of the maze
            if (playerRow != exitRow || playerCol != exitCol) {
                timeoutVar = setTimeout(function () { javascriptLoop(solutionString, i) }, 250);
            } else {
                drawMessage("Maze End Reached", "green");
            }
        }

        // The event handler which handles player key-down events
        function movePlayer(event) {
            if (isEnabled) {
                var key = event.key;
                var direction;
                var moved = false;
                var r = playerRow;
                var c = playerCol;
                // For the input keys, we check to see if the direction is open and within bounds
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

                // If the movement action was performed, we re-draw the player
                if (moved == true) {
                    // If the player won, we draw the winning message
                    if (c == exitCol && r == exitRow) {
                        drawPlayer(c, r);
                        endReached = true;
                        drawMessage("You Win!", "green");
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

        /// --- MAIN LINE OF PLUGIN --- ///

        // We get rid of any previously running solutions
        if (timeoutVar != null) {
            clearTimeout(timeoutVar);
        }

        // We draw the maze and all its components
        drawMaze();
        drawStartEnd();
        drawPlayer(startCol, startRow);

        // We connect to the event handlers
        if (isEnabled == true) {
            $(document).off("keydown");
            $(document).on("keydown", movePlayer);
        }
        return this;
    };
})(jQuery);