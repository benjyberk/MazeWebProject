(function ($) {
    var playerCol;
    var playerRow;
    var context;
    var rows;
    var cols;
    var cellWidth;
    var cellHeight;

    $.fn.mazeBoard = function (
        mazeData,
        startRow, startCol,
        exitRow, exitCol,
        playerImage, startImage, exitImage,
        enabled, moveFunction
        ) {
        playerCol = startCol;
        playerRow = startRow;
        context = this[0].getContext("2d");
        rows = mazeData.length;
        cols = mazeData[0].length;
        cellWidth = this.width() / cols;
        cellHeight = this.height() / rows;

        function drawMaze() {
            // Draw the maze
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    if (mazeData[i][j] == 1) {
                       context.fillRect(cellWidth * j, cellHeight * i, cellWidth, cellHeight);
                    }
                }
            }
        }

        function drawPlayer() {
            var x = cellWidth * playerRow;
            var y = cellWidth * playerCol;
            context.drawImage(playerImage, x, y, cellWidth, cellHeight);
        }

        function drawStartEnd() {
            var x = cellWidth * startRow;
            var y = cellWidth * startCol;
            context.drawImage(startImage, x, y, cellWidth, cellHeight);
            x = cellWidth * exitRow;
            y = cellWidth * exitCol;
            context.drawImage(exitImage, x, y, cellWidth, cellHeight);
           
        }

        drawMaze();
        drawStartEnd();
        drawPlayer();
        return this;
    };

    $.fn.solve = function () {
        
    }
})(jQuery);